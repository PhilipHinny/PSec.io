"""Two-organization HTTP and worker isolation against migrated Postgres."""

import os
from collections.abc import Iterator
from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from firebase_admin import auth
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

from apps.api.config import Settings
from apps.api.identity import ApiError, Identity, db_session, verified_identity
from apps.api.main import app
from apps.api.worker_access import require_project


def test_missing_token() -> None:
    with pytest.raises(ApiError) as exc:
        verified_identity(None)
    assert exc.value.status == 401


def test_verified_token_ignores_authority_claims(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("apps.api.identity.firebase_app", lambda: object())
    monkeypatch.setattr("apps.api.identity.auth.verify_id_token",
                        lambda *_args, **_kwargs: {"uid": "trusted-uid", "email": "A@EXAMPLE.TEST",
                                                   "email_verified": True, "org_id": "foreign",
                                                   "role": "owner"})
    identity = verified_identity("Bearer synthetic")
    assert identity == Identity("trusted-uid", "a@example.test", True)


@pytest.mark.parametrize("error", [auth.InvalidIdTokenError("bad"),
                                    auth.ExpiredIdTokenError("expired", None)])
def test_invalid_and_expired_token(monkeypatch: pytest.MonkeyPatch, error: Exception) -> None:
    monkeypatch.setattr("apps.api.identity.firebase_app", lambda: object())

    def fail(*_args: object, **_kwargs: object) -> None:
        raise error

    monkeypatch.setattr("apps.api.identity.auth.verify_id_token", fail)
    with pytest.raises(ApiError) as exc:
        verified_identity("Bearer synthetic")
    assert exc.value.status == 401


@pytest.mark.skipif(not os.getenv("PSEC_SCHEMA_TEST"), reason="requires migrated disposable Postgres")
def test_two_org_routes_and_worker(monkeypatch: pytest.MonkeyPatch) -> None:
    db_engine = create_engine(Settings().database_url)  # type: ignore[call-arg]
    connection = db_engine.connect()
    outer = connection.begin()
    identity = {"current": Identity("identity_a", "a@example.org", True)}

    def fake_identity() -> Identity:
        return identity["current"]

    def test_db() -> Iterator[Session]:
        with Session(bind=connection, join_transaction_mode="create_savepoint") as db:
            yield db

    app.dependency_overrides[verified_identity] = fake_identity
    app.dependency_overrides[db_session] = test_db
    client = TestClient(app)
    try:
        a = client.post("/v1/orgs", json={"name": "Fixture A"})
        assert a.status_code == 201, a.text
        org_a = a.json()["id"]
        assert client.get(f"/v1/orgs/{org_a}").status_code == 200
        assert len(client.get(f"/v1/orgs/{org_a}/members").json()) == 1
        project_a = client.post("/v1/projects", json={"name": "A project"})
        assert project_a.status_code == 201, project_a.text
        project_a_id = project_a.json()["id"]
        assert client.get("/v1/projects").json() == [project_a.json()]
        changed = client.patch(f"/v1/projects/{project_a_id}", json={"name": "A updated"})
        assert changed.status_code == 200 and changed.json()["name"] == "A updated"
        assert client.get(f"/v1/projects/{project_a_id}").status_code == 200
        invite = client.post(f"/v1/orgs/{org_a}/invitations",
                             json={"email": "new@example.org", "role": "viewer"})
        assert invite.status_code == 201, invite.text
        invitation_token = invite.json()["token"]

        identity["current"] = Identity("identity_b", "b@example.org", True)
        b = client.post("/v1/orgs", json={"name": "Fixture B"})
        assert b.status_code == 201, b.text
        org_b = b.json()["id"]
        b_me = client.get("/v1/me").json()
        assert b_me["org_id"] == org_b
        project_b = client.post("/v1/projects", json={"name": "B project"})
        assert project_b.status_code == 201
        assert client.get("/v1/projects").json() == [project_b.json()]
        assert client.delete(f"/v1/projects/{project_b.json()['id']}").status_code == 204
        assert client.get(f"/v1/orgs/{org_a}").status_code == 404
        assert client.get(f"/v1/orgs/{org_a}/members").status_code == 404
        assert client.get(f"/v1/projects/{project_a_id}").status_code == 404
        assert client.patch(f"/v1/projects/{project_a_id}", json={"name": "stolen"}).status_code == 404
        assert client.delete(f"/v1/projects/{project_a_id}").status_code == 404
        assert client.get("/v1/projects", params={"org_id": org_a}).json() == []
        assert client.post("/v1/projects", json={"name": "bad", "org_id": org_a}).status_code == 422
        assert client.post("/v1/projects", json={"name": "bad", "user_id": "other"}).status_code == 422
        assert client.post(f"/v1/orgs/{org_a}/invitations",
                           json={"email": "new@example.org", "role": "viewer"}).status_code == 404
        assert client.post("/v1/orgs", json={"name": "Again"}).status_code == 409

        identity["current"] = Identity("identity_new", "new@example.org", True)
        assert client.get("/v1/me").status_code == 403
        accepted = client.post("/v1/invitations/accept", json={"token": invitation_token})
        assert accepted.status_code == 200, accepted.text
        assert accepted.json()["org_id"] == org_a
        assert client.post("/v1/invitations/accept", json={"token": invitation_token}).status_code == 404
        assert client.post("/v1/projects", json={"name": "no"}).status_code == 403
        assert client.get(f"/v1/orgs/{org_a}/members").status_code == 403
        assert client.get(f"/v1/projects/{project_a_id}").status_code == 200

        identity["current"] = Identity("identity_a", "a@example.org", True)
        member_id = accepted.json()["membership_id"]
        assert client.patch(f"/v1/orgs/{org_a}/members/{b_me['membership_id']}",
                            json={"active": False}).status_code == 404
        assert client.patch(f"/v1/orgs/{org_b}/members/{member_id}",
                            json={"active": False}).status_code == 404
        assert client.patch(f"/v1/orgs/{org_a}/members/{member_id}",
                            json={"active": False}).status_code == 200
        assert client.patch(f"/v1/orgs/{org_a}/members/{member_id}",
                            json={"role": "manager", "active": True}).status_code == 200
        identity["current"] = Identity("identity_new", "new@example.org", True)
        assert client.post("/v1/projects", json={"name": "manager project"}).status_code == 201
        identity["current"] = Identity("identity_a", "a@example.org", True)
        assert client.patch(f"/v1/orgs/{org_a}/members/{member_id}",
                            json={"active": False}).status_code == 200
        identity["current"] = Identity("identity_new", "new@example.org", True)
        assert client.get("/v1/me").status_code == 403

        with Session(bind=connection, join_transaction_mode="create_savepoint") as db:
            assert require_project(db, UUID(org_a), UUID(project_a_id)) == UUID(project_a_id)
            with pytest.raises(ApiError):
                require_project(db, None, UUID(project_a_id))
            with pytest.raises(ApiError):
                require_project(db, UUID(org_b), UUID(project_a_id))
            assert db.execute(text("SELECT count(*) FROM audit_events WHERE org_id=:org"),
                              {"org": UUID(org_a)}).scalar_one() >= 4
        import importlib

        worker = importlib.import_module("apps.worker.celery_app")
        monkeypatch.setattr(worker, "engine", lambda: connection)
        assert worker.check_project(org_a, project_a_id) == project_a_id
        with pytest.raises(ApiError):
            worker.check_project(None, project_a_id)
        with pytest.raises(ApiError):
            worker.check_project(org_b, project_a_id)
    finally:
        app.dependency_overrides.clear()
        outer.rollback()
        connection.close()
        db_engine.dispose()
