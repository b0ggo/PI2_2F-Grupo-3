import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.environ.get("SECRET_KEY", "agrogestor-dev-key")
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+psycopg2://agrogestor:agrogestor@localhost:5432/agrogestor",
)

# Caminho legado para migração JSON → PostgreSQL
DATA_DIR = BASE_DIR / "data"
