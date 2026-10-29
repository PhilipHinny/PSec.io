import json
import logging
import re
from collections.abc import MutableMapping
from datetime import UTC, datetime
from typing import Any

import structlog

_SENSITIVE = re.compile(r"(authorization|token|secret|password|key|document|prompt|signed_url)", re.I)


def redact(_logger: object, _method: str, event: MutableMapping[str, Any]) -> MutableMapping[str, Any]:
    return {key: "[REDACTED]" if _SENSITIVE.search(key) else value for key, value in event.items()}


class JsonRedactingFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        # Framework log messages are not allowed to carry request bodies or credentials.
        message = record.getMessage()
        message = re.sub(r"(?i)(token|secret|password|key)=\S+", r"\1=[REDACTED]", message)
        return json.dumps({
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname.lower(),
            "event": message,
        })


def configure_logging() -> None:
    handler = logging.StreamHandler()
    handler.setFormatter(JsonRedactingFormatter())
    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").disabled = True
    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso", utc=True),
            structlog.processors.add_log_level,
            redact,
            structlog.processors.JSONRenderer(),
        ],
        logger_factory=structlog.PrintLoggerFactory(),
    )
