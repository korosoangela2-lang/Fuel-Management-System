"""Configuration. Secrets come from the environment, never from source control."""
import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///" + os.path.join(BASE_DIR, "fuel_dev.db")
    )


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    JWT_SECRET_KEY = "testing-secret"


class ProductionConfig(BaseConfig):
    DEBUG = False
    # Render hands out postgres:// URLs; SQLAlchemy 2.x requires postgresql://
    _uri = os.getenv("DATABASE_URL", "")
    if _uri.startswith("postgres://"):
        _uri = _uri.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = _uri
