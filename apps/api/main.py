from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import redis
import structlog
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from apps.api.config import get_settings
from apps.api.identity import ApiError
from apps.api.logging import configure_logging
from apps.api.routes import router


class Health(BaseModel):
    status: str


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    get_settings()  # Validate server-only config at startup.
    configure_logging()
    structlog.get_logger().info("api_started")
    yield


app = FastAPI(title="PSec API", version="0.1.0", lifespan=lifespan)
app.include_router(router)


@app.exception_handler(ApiError)
async def api_error(_request: Request, exc: ApiError) -> JSONResponse:
    return JSONResponse(status_code=exc.status,
                        content={"error": {"code": exc.code, "message": exc.message}})


@app.exception_handler(RequestValidationError)
async def validation_error(_request: Request, _exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(status_code=422,
                        content={"error": {"code": "invalid_request", "message": "Invalid request"}})


@app.exception_handler(HTTPException)
async def http_error(_request: Request, exc: HTTPException) -> JSONResponse:
    code = "not_found" if exc.status_code == 404 else "http_error"
    return JSONResponse(status_code=exc.status_code,
                        content={"error": {"code": code, "message": str(exc.detail)}})


@app.exception_handler(Exception)
async def unhandled(_request: Request, _exc: Exception) -> JSONResponse:
    structlog.get_logger().error("unhandled_error")
    return JSONResponse(status_code=500, content={"error": {"code": "internal_error", "message": "Internal error"}})


@app.get("/health", response_model=Health)
def health() -> Health:
    return Health(status="ok")


@app.get("/ready", response_model=Health)
def ready() -> Health:
    settings = get_settings()
    try:
        engine = create_engine(settings.database_url, connect_args={"connect_timeout": 2})
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        engine.dispose()
        redis.Redis.from_url(settings.redis_url, socket_connect_timeout=2).ping()
    except (SQLAlchemyError, redis.RedisError, OSError):
        return JSONResponse(  # type: ignore[return-value]
            status_code=503,
            content={"error": {"code": "not_ready", "message": "Dependency unavailable"}},
        )
    return Health(status="ok")
