#!/bin/sh
set -e

# Defaults (if not provided via env)
: "${POSTGRES_USER:=agrogestor}"
: "${POSTGRES_DB:=agrogestor}"

echo "Waiting for postgres (host: db)..."
until pg_isready -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do
  sleep 1
done

echo "Postgres is ready. Running DB init and seed (if present)..."
# attempt to create tables and seed; tolerate failures
python init_db.py || true
python seed.py || true

echo "Starting Flask app..."
exec python app.py
