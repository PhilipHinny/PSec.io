from uuid import UUID

from celery import Celery
from sqlalchemy.orm import Session

from apps.api.config import get_settings
from apps.api.identity import engine
from apps.api.logging import configure_logging
from apps.api.worker_access import require_project

settings = get_settings()
configure_logging()
app = Celery("psec", broker=settings.redis_url, backend=settings.redis_url)
app.conf.update(
    worker_hijack_root_logger=False,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    task_ignore_result=True,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    broker_transport_options={"visibility_timeout": 3600},
)


@app.task(name="foundation.ping")  # type: ignore[untyped-decorator]
def ping() -> str:
    return "ok"


@app.task(name="identity.check_project")  # type: ignore[untyped-decorator]
def check_project(org_id: str | None, project_id: str) -> str:
    with Session(engine()) as db:
        return str(require_project(db, UUID(org_id) if org_id else None, UUID(project_id)))
