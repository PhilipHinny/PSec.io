import logging

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from apps.api.config import Settings
from apps.api.logging import JsonRedactingFormatter, redact
from apps.api.main import app


def test_missing_server_secrets_fail(monkeypatch: pytest.MonkeyPatch) -> None:
    for key in ("DATABASE_URL", "REDIS_URL", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "FIREBASE_PROJECT_ID", "FIREBASE_CREDENTIALS", "WEB_ORIGIN"):
        monkeypatch.delenv(key, raising=False)
    with pytest.raises(ValidationError):
        Settings(_env_file=None)  # type: ignore[call-arg]


def test_redaction() -> None:
    assert redact(None, "info", {"token": "private", "event": "ok"}) == {"token": "[REDACTED]", "event": "ok"}
    record = logging.LogRecord("test", logging.INFO, "", 1, "token=private", (), None)
    assert "private" not in JsonRedactingFormatter().format(record)


def test_health(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://local:local@localhost/local")
    monkeypatch.setenv("REDIS_URL", "redis://localhost:6379/0")
    monkeypatch.setenv("SUPABASE_URL", "http://localhost:54321")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "synthetic-test-only")
    monkeypatch.setenv("FIREBASE_PROJECT_ID", "synthetic-test")
    monkeypatch.setenv("FIREBASE_CREDENTIALS", "synthetic-test")
    monkeypatch.setenv("WEB_ORIGIN", "http://localhost:5173")
    with TestClient(app) as client:
        assert client.get("/health").json() == {"status": "ok"}
