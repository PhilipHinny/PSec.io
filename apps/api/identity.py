"""Verified Firebase identity and database-derived tenant authorization."""
# ruff: noqa: B008

from collections.abc import Iterator
from dataclasses import dataclass
from functools import lru_cache
from uuid import UUID

import firebase_admin
from fastapi import Depends, Header
from firebase_admin import auth, credentials
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

from apps.api.config import get_settings


class ApiError(Exception):
    def __init__(self, status: int, code: str, message: str) -> None:
        self.status = status
        self.code = code
        self.message = message


@dataclass(frozen=True)
class Identity:
    uid: str
    email: str | None
    email_verified: bool


@dataclass(frozen=True)
class Tenant:
    user_id: UUID
    membership_id: UUID
    org_id: UUID
    role: str


# The matrix is deliberately small. New routes must name an action here.
ACTIONS: dict[str, frozenset[str]] = {
    "org.read": frozenset({"owner", "admin", "manager", "contributor", "viewer"}),
    "member.read": frozenset({"owner", "admin", "manager"}),
    "member.invite": frozenset({"owner", "admin"}),
    "member.manage": frozenset({"owner", "admin"}),
    "project.read": frozenset({"owner", "admin", "manager", "contributor", "viewer"}),
    "project.write": frozenset({"owner", "admin", "manager"}),
    "report.approve": frozenset({"manager", "admin"}),
}


@lru_cache
def engine():  # type: ignore[no-untyped-def]
    return create_engine(get_settings().database_url, pool_pre_ping=True, pool_size=3, max_overflow=2)


def db_session() -> Iterator[Session]:
    with Session(engine()) as db:
        yield db


@lru_cache
def firebase_app() -> firebase_admin.App:
    settings = get_settings()
    # FIREBASE_CREDENTIALS is a server-only service-account JSON path.
    credential = credentials.Certificate(settings.firebase_credentials)
    return firebase_admin.initialize_app(
        credential, {"projectId": settings.firebase_project_id}, name="psec-api"
    )


def verified_identity(authorization: str | None = Header(default=None)) -> Identity:
    if not authorization or not authorization.startswith("Bearer "):
        raise ApiError(401, "invalid_token", "A valid Firebase ID token is required")
    token = authorization[7:]
    if not token or " " in token:
        raise ApiError(401, "invalid_token", "A valid Firebase ID token is required")
    try:
        claims = auth.verify_id_token(token, app=firebase_app(), check_revoked=True)
    except (ValueError, auth.InvalidIdTokenError, auth.ExpiredIdTokenError,
            auth.RevokedIdTokenError, auth.UserDisabledError):
        raise ApiError(401, "invalid_token", "A valid Firebase ID token is required") from None
    uid = claims.get("uid")
    if not isinstance(uid, str) or not uid:
        raise ApiError(401, "invalid_token", "A valid Firebase ID token is required")
    email = claims.get("email")
    return Identity(uid, email.lower() if isinstance(email, str) else None,
                    claims.get("email_verified") is True)


def tenant_context(identity: Identity = Depends(verified_identity),
                   db: Session = Depends(db_session)) -> Tenant:
    rows = db.execute(text("""
        SELECT u.id AS user_id, m.id AS membership_id, m.org_id, m.role
        FROM users u JOIN memberships m ON m.user_id = u.id
        WHERE u.firebase_uid = :uid AND m.active
    """), {"uid": identity.uid}).mappings().all()
    if len(rows) != 1:
        raise ApiError(403, "membership_required", "Exactly one active membership is required")
    row = rows[0]
    return Tenant(row["user_id"], row["membership_id"], row["org_id"], row["role"])


def authorize(action: str):  # type: ignore[no-untyped-def]
    if action not in ACTIONS:
        raise ValueError(f"Unknown authorization action: {action}")

    def dependency(tenant: Tenant = Depends(tenant_context)) -> Tenant:
        if tenant.role not in ACTIONS[action]:
            raise ApiError(403, "forbidden", "Action is not permitted")
        return tenant

    return dependency
