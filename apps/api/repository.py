"""Tenant-scoped project and membership operations."""

from typing import Any
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.orm import Session

from apps.api.identity import ApiError, Tenant


def project_list(db: Session, ctx: Tenant, *, limit: int, offset: int) -> list[dict[str, Any]]:
    rows = db.execute(text("""
        SELECT id, name FROM projects WHERE org_id = :org
        ORDER BY created_at, id LIMIT :limit OFFSET :offset
    """), {"org": ctx.org_id, "limit": limit, "offset": offset}).mappings().all()
    return [dict(row) for row in rows]


def project_get(db: Session, ctx: Tenant, project_id: UUID) -> dict[str, Any]:
    row = db.execute(text("SELECT id, name FROM projects WHERE id=:id AND org_id=:org"),
                     {"id": project_id, "org": ctx.org_id}).mappings().one_or_none()
    if row is None:
        raise ApiError(404, "not_found", "Project not found")
    return dict(row)


def project_create(db: Session, ctx: Tenant, name: str) -> dict[str, Any]:
    row = db.execute(text("""
        INSERT INTO projects(org_id,name) VALUES (:org,:name) RETURNING id,name
    """), {"org": ctx.org_id, "name": name}).mappings().one()
    audit(db, ctx, "project.created", "project", row["id"])
    db.commit()
    return dict(row)


def project_update(db: Session, ctx: Tenant, project_id: UUID, name: str) -> dict[str, Any]:
    row = db.execute(text("""
        UPDATE projects SET name=:name WHERE id=:id AND org_id=:org RETURNING id,name
    """), {"org": ctx.org_id, "id": project_id, "name": name}).mappings().one_or_none()
    if row is None:
        raise ApiError(404, "not_found", "Project not found")
    audit(db, ctx, "project.updated", "project", project_id)
    db.commit()
    return dict(row)


def project_delete(db: Session, ctx: Tenant, project_id: UUID) -> None:
    # Keep DB FK denial explicit if the project has child records.
    row = db.execute(text("""
        DELETE FROM projects WHERE id=:id AND org_id=:org RETURNING id
    """), {"org": ctx.org_id, "id": project_id}).one_or_none()
    if row is None:
        raise ApiError(404, "not_found", "Project not found")
    audit(db, ctx, "project.deleted", "project", project_id)
    db.commit()


def member_list(db: Session, ctx: Tenant) -> list[dict[str, Any]]:
    rows = db.execute(text("""
        SELECT m.id, m.role, m.active FROM memberships m
        WHERE m.org_id=:org ORDER BY m.created_at,m.id
    """), {"org": ctx.org_id}).mappings().all()
    return [dict(row) for row in rows]


def audit(db: Session, ctx: Tenant, action: str, target_type: str, target_id: UUID) -> None:
    db.execute(text("""
        INSERT INTO audit_events(org_id,actor_membership_id,action,target_type,target_id)
        VALUES (:org,:actor,:action,:target_type,:target_id)
    """), {"org": ctx.org_id, "actor": ctx.membership_id, "action": action,
           "target_type": target_type, "target_id": target_id})
