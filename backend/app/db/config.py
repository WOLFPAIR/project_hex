from __future__ import annotations

from dataclasses import dataclass
import os
from urllib.parse import urlparse, urlunparse


@dataclass(frozen=True)
class DatabaseConfig:
    url: str
    echo: bool
    ssl_required: bool


def get_database_config() -> DatabaseConfig:
    url = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./app.db")
    echo_raw = os.getenv("DB_ECHO", "false").strip().lower()
    echo = echo_raw in {"1", "true", "yes", "on"}
    ssl_raw = os.getenv("DB_SSL", "").strip().lower()
    ssl_required = ssl_raw in {"1", "true", "yes", "on"}
    if not ssl_required and "supabase.co" in url:
        ssl_required = True
    return DatabaseConfig(url=url, echo=echo, ssl_required=ssl_required)


def redact_database_url(url: str) -> str:
    try:
        parsed = urlparse(url)
        if not parsed.scheme:
            return "<redacted>"
        if parsed.username:
            host = parsed.hostname or ""
            port = f":{parsed.port}" if parsed.port else ""
            auth = f"{parsed.username}:***@" if parsed.password else f"{parsed.username}@"
            netloc = f"{auth}{host}{port}"
        else:
            netloc = parsed.netloc
        return urlunparse(parsed._replace(netloc=netloc))
    except Exception:
        return "<redacted>"
