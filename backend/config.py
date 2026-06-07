import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

SECRET_KEY = os.environ.get("SECRET_KEY", "agrogestor-dev-key")
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")

USERS_FILE = DATA_DIR / "users.json"
ANIMAIS_FILE = DATA_DIR / "animais.json"
LOTES_FILE = DATA_DIR / "lotes.json"
VACINACOES_FILE = DATA_DIR / "vacinacoes.json"
CONVERSAS_FILE = DATA_DIR / "conversas.json"
MENSAGENS_FILE = DATA_DIR / "mensagens.json"
TOKENS_FILE = DATA_DIR / "tokens.json"
