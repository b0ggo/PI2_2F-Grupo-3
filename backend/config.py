import os
import sys
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

APP_ENV = os.environ.get("APP_ENV", os.environ.get("FLASK_ENV", "development")).lower()
IS_PRODUCTION = APP_ENV == "production"

SECRET_KEY = os.environ.get("SECRET_KEY", "agrogestor-dev-key")
CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+psycopg2://agrogestor:agrogestor@localhost:5432/agrogestor",
)

# Caminho legado para migração JSON → PostgreSQL
DATA_DIR = BASE_DIR / "data"

if IS_PRODUCTION:
    if SECRET_KEY == "agrogestor-dev-key" or len(SECRET_KEY) < 32:
        print(
            "ERRO: defina SECRET_KEY com pelo menos 32 caracteres aleatórios em produção.",
            file=sys.stderr,
        )
        sys.exit(1)
