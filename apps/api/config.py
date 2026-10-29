from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: Literal["test", "dev", "prod"] = "dev"
    database_url: str = Field(min_length=1)
    redis_url: str = Field(min_length=1)
    supabase_url: str = Field(min_length=1)
    supabase_service_role_key: str = Field(min_length=1, repr=False)
    firebase_project_id: str = Field(min_length=1)
    firebase_credentials: str = Field(min_length=1, repr=False)
    web_origin: str = Field(min_length=1)


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
