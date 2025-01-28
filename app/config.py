from pydantic import BaseSettings, root_validator

from functools import lru_cache


class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASS: str
    DB_NAME: str

    @root_validator
    def get_database_url(cls, v):
        v["DATABASE_URL"] = (
            f"postgresql+asyncpg://{v['DB_USER']}:{v['DB_PASS']}@{v['DB_HOST']}:{v['DB_PORT']}/{v['DB_NAME']}"
        )

        return v

    env_name: str = "Local"
    base_url: str = "http://localhost:8000"
    echo_sql: bool = True

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    print(f"Loading settings for: {settings.env_name}")
    return settings
