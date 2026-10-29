"""Explicit worker tenant context; never fall back to an unscoped read."""

from uuid import UUID

from sqlalchemy import text
from sqlalchemy.orm import Session

from apps.api.identity import ApiError


def require_project(db: Session, org_id: UUID | None, project_id: UUID) -> UUID:
    if org_id is None:
        raise ApiError(403, "tenant_context_required", "Worker tenant context is required")
    row = db.execute(text("SELECT id FROM projects WHERE org_id=:org AND id=:id"),
                     {"org": org_id, "id": project_id}).scalar_one_or_none()
    if row is None:
        raise ApiError(404, "not_found", "Project not found")
    return row
