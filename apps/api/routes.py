"""Prompt 02 identity, membership, and representative tenant routes."""
# ruff: noqa: B008

import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from apps.api.identity import (
    ApiError,
    Identity,
    Tenant,
    authorize,
    db_session,
    tenant_context,
    verified_identity,
)
from apps.api.repository import (
    audit,
    member_list,
    project_create,
    project_delete,
    project_get,
    project_list,
    project_update,
)

router = APIRouter(prefix="/v1")


class Input(BaseModel):
    model_config = ConfigDict(extra="forbid")


class OrgInput(Input):
    name: str = Field(min_length=1, max_length=200, pattern=r".*\S.*")


class OrgOut(BaseModel):
    id: UUID
    name: str


class MeOut(BaseModel):
    user_id: UUID
    org_id: UUID
    membership_id: UUID
    role: str


class MemberOut(BaseModel):
    id: UUID
    role: str
    active: bool


class InviteInput(Input):
    email: EmailStr
    role: str


class InviteOut(BaseModel):
    id: UUID
    token: str
    expires_at: datetime


class AcceptInput(Input):
    token: str = Field(min_length=32, max_length=256)


class MemberPatch(Input):
    role: str | None = None
    active: bool | None = None


class ProjectInput(Input):
    name: str = Field(min_length=1, max_length=200, pattern=r".*\S.*")


class ProjectOut(BaseModel):
    id: UUID
    name: str


def same_org(org_id: UUID, ctx: Tenant) -> None:
    if org_id != ctx.org_id:
        raise ApiError(404, "not_found", "Organization not found")


def lock_uid(db: Session, uid: str) -> None:
    db.execute(text("SELECT pg_advisory_xact_lock(hashtextextended(:uid, 0))"), {"uid": uid})


@router.get("/me", response_model=MeOut)
def me(ctx: Tenant = Depends(tenant_context)) -> MeOut:
    return MeOut(**vars(ctx))


@router.post("/orgs", response_model=OrgOut, status_code=201)
def create_org(body: OrgInput, identity: Identity = Depends(verified_identity),
               db: Session = Depends(db_session)) -> OrgOut:
    lock_uid(db, identity.uid)
    user_id: UUID = db.execute(text("""
        INSERT INTO users(firebase_uid) VALUES (:uid)
        ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid=EXCLUDED.firebase_uid
        RETURNING id
    """), {"uid": identity.uid}).scalar_one()
    if db.execute(text("SELECT 1 FROM memberships WHERE user_id=:user"),
                  {"user": user_id}).scalar_one_or_none():
        raise ApiError(409, "already_member", "User already belongs to an organization")
    org = db.execute(text("INSERT INTO organizations(name) VALUES (:name) RETURNING id,name"),
                     {"name": body.name.strip()}).mappings().one()
    member_id: UUID = db.execute(text("""
        INSERT INTO memberships(org_id,user_id,role) VALUES (:org,:user,'owner') RETURNING id
    """), {"org": org["id"], "user": user_id}).scalar_one()
    ctx = Tenant(user_id, member_id, org["id"], "owner")
    audit(db, ctx, "organization.created", "organization", org["id"])
    db.commit()
    return OrgOut(**org)


@router.get("/orgs/{org_id}", response_model=OrgOut)
def get_org(org_id: UUID, ctx: Tenant = Depends(authorize("org.read")),
            db: Session = Depends(db_session)) -> OrgOut:
    same_org(org_id, ctx)
    row = db.execute(text("SELECT id,name FROM organizations WHERE id=:org"),
                     {"org": ctx.org_id}).mappings().one()
    return OrgOut(**row)


@router.get("/orgs/{org_id}/members", response_model=list[MemberOut])
def get_members(org_id: UUID, ctx: Tenant = Depends(authorize("member.read")),
                db: Session = Depends(db_session)) -> list[MemberOut]:
    same_org(org_id, ctx)
    return [MemberOut(**row) for row in member_list(db, ctx)]


@router.post("/orgs/{org_id}/invitations", response_model=InviteOut, status_code=201)
def invite(org_id: UUID, body: InviteInput,
           ctx: Tenant = Depends(authorize("member.invite")),
           db: Session = Depends(db_session)) -> InviteOut:
    same_org(org_id, ctx)
    if body.role not in {"admin", "manager", "contributor", "viewer"}:
        raise ApiError(422, "invalid_role", "Invalid invitation role")
    if ctx.role == "admin" and body.role == "admin":
        raise ApiError(403, "forbidden", "Admin cannot grant Admin")
    token = secrets.token_urlsafe(32)
    expires = datetime.now(UTC) + timedelta(days=7)
    row: UUID = db.execute(text("""
        INSERT INTO invitations(org_id,email,role,token_hash,invited_by_membership_id,expires_at)
        VALUES (:org,:email,:role,:hash,:actor,:expires) RETURNING id
    """), {"org": ctx.org_id, "email": str(body.email).lower(), "role": body.role,
           "hash": hashlib.sha256(token.encode()).hexdigest(), "actor": ctx.membership_id,
           "expires": expires}).scalar_one()
    audit(db, ctx, "invitation.created", "invitation", row)
    db.commit()
    # Caller is responsible for delivering the one-time token through a trusted channel.
    return InviteOut(id=row, token=token, expires_at=expires)


@router.post("/invitations/accept", response_model=MeOut)
def accept(body: AcceptInput, identity: Identity = Depends(verified_identity),
           db: Session = Depends(db_session)) -> MeOut:
    if not identity.email or not identity.email_verified:
        raise ApiError(403, "verified_email_required", "A verified matching email is required")
    lock_uid(db, identity.uid)
    row = db.execute(text("""
        SELECT id,org_id,email,role FROM invitations
        WHERE token_hash=:hash AND accepted_at IS NULL AND revoked_at IS NULL
          AND expires_at > now() FOR UPDATE
    """), {"hash": hashlib.sha256(body.token.encode()).hexdigest()}).mappings().one_or_none()
    if row is None or row["email"] != identity.email:
        raise ApiError(404, "invitation_unavailable", "Invitation unavailable")
    user_id: UUID = db.execute(text("""
        INSERT INTO users(firebase_uid) VALUES (:uid)
        ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid=EXCLUDED.firebase_uid
        RETURNING id
    """), {"uid": identity.uid}).scalar_one()
    if db.execute(text("SELECT 1 FROM memberships WHERE user_id=:user"),
                  {"user": user_id}).scalar_one_or_none():
        raise ApiError(409, "already_member", "User already belongs to an organization")
    member_id: UUID = db.execute(text("""
        INSERT INTO memberships(org_id,user_id,role) VALUES (:org,:user,:role) RETURNING id
    """), {"org": row["org_id"], "user": user_id, "role": row["role"]}).scalar_one()
    db.execute(text("UPDATE invitations SET accepted_at=now() WHERE id=:id AND org_id=:org"),
               {"id": row["id"], "org": row["org_id"]})
    ctx = Tenant(user_id, member_id, row["org_id"], row["role"])
    audit(db, ctx, "invitation.accepted", "invitation", row["id"])
    audit(db, ctx, "membership.created", "membership", member_id)
    db.commit()
    return MeOut(**vars(ctx))


@router.patch("/orgs/{org_id}/members/{member_id}", response_model=MemberOut)
def patch_member(org_id: UUID, member_id: UUID, body: MemberPatch,
                 ctx: Tenant = Depends(authorize("member.manage")),
                 db: Session = Depends(db_session)) -> MemberOut:
    same_org(org_id, ctx)
    if body.role is None and body.active is None:
        raise ApiError(422, "empty_update", "Supply a role or active state")
    if body.role is not None and body.role not in {"admin", "manager", "contributor", "viewer"}:
        raise ApiError(422, "invalid_role", "Invalid membership role")
    row = db.execute(text("""
        SELECT id,role,active FROM memberships WHERE id=:id AND org_id=:org FOR UPDATE
    """), {"id": member_id, "org": ctx.org_id}).mappings().one_or_none()
    if row is None:
        raise ApiError(404, "not_found", "Membership not found")
    if row["role"] == "owner" or member_id == ctx.membership_id:
        raise ApiError(403, "forbidden", "Owner and own membership cannot be changed")
    if ctx.role == "admin" and (row["role"] == "admin" or body.role == "admin"):
        raise ApiError(403, "forbidden", "Admin cannot manage Admin")
    updated = db.execute(text("""
        UPDATE memberships SET role=COALESCE(:role,role), active=COALESCE(:active,active)
        WHERE id=:id AND org_id=:org RETURNING id,role,active
    """), {"id": member_id, "org": ctx.org_id, "role": body.role,
           "active": body.active}).mappings().one()
    audit(db, ctx, "membership.updated", "membership", member_id)
    db.commit()
    return MemberOut(**updated)


@router.get("/projects", response_model=list[ProjectOut])
def list_projects(limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0),
                  ctx: Tenant = Depends(authorize("project.read")),
                  db: Session = Depends(db_session)) -> list[ProjectOut]:
    return [ProjectOut(**row) for row in project_list(db, ctx, limit=limit, offset=offset)]


@router.post("/projects", response_model=ProjectOut, status_code=201)
def add_project(body: ProjectInput, ctx: Tenant = Depends(authorize("project.write")),
                db: Session = Depends(db_session)) -> ProjectOut:
    try:
        return ProjectOut(**project_create(db, ctx, body.name.strip()))
    except IntegrityError:
        db.rollback()
        raise ApiError(409, "duplicate_project", "Project already exists") from None


@router.get("/projects/{project_id}", response_model=ProjectOut)
def get_project(project_id: UUID, ctx: Tenant = Depends(authorize("project.read")),
                db: Session = Depends(db_session)) -> ProjectOut:
    return ProjectOut(**project_get(db, ctx, project_id))


@router.patch("/projects/{project_id}", response_model=ProjectOut)
def edit_project(project_id: UUID, body: ProjectInput,
                 ctx: Tenant = Depends(authorize("project.write")),
                 db: Session = Depends(db_session)) -> ProjectOut:
    try:
        return ProjectOut(**project_update(db, ctx, project_id, body.name.strip()))
    except IntegrityError:
        db.rollback()
        raise ApiError(409, "duplicate_project", "Project already exists") from None


@router.delete("/projects/{project_id}", status_code=204)
def remove_project(project_id: UUID, ctx: Tenant = Depends(authorize("project.write")),
                   db: Session = Depends(db_session)) -> None:
    try:
        project_delete(db, ctx, project_id)
    except IntegrityError:
        db.rollback()
        raise ApiError(409, "project_in_use", "Project has dependent records") from None
