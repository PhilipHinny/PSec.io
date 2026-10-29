"""Run after `alembic upgrade head` against disposable local/CI Postgres."""

import os
from uuid import UUID

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError

from apps.api.config import Settings


@pytest.mark.skipif(not os.getenv("PSEC_SCHEMA_TEST"), reason="requires migrated disposable Postgres")
def test_cross_org_parent_rejected() -> None:
    engine = create_engine(Settings().database_url)  # type: ignore[call-arg]
    with engine.begin() as conn:
        one = UUID(str(conn.execute(text("INSERT INTO organizations(name) VALUES ('Fixture A') RETURNING id")).scalar_one()))
        two = UUID(str(conn.execute(text("INSERT INTO organizations(name) VALUES ('Fixture B') RETURNING id")).scalar_one()))
        project = UUID(str(conn.execute(text("INSERT INTO projects(org_id,name) VALUES (:org,'Synthetic') RETURNING id"), {"org": one}).scalar_one()))
        with pytest.raises(IntegrityError):
            with conn.begin_nested():
                conn.execute(
                    text("INSERT INTO activities(org_id,project_id,activity_date,summary) VALUES (:org,:project,DATE '2026-01-01','redacted')"),
                    {"org": two, "project": project},
                )
        conn.execute(text("DELETE FROM projects WHERE id = :id"), {"id": project})
        conn.execute(text("DELETE FROM organizations WHERE id IN (:one,:two)"), {"one": one, "two": two})
    engine.dispose()
