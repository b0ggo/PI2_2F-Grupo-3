#!/bin/sh
set -e

: "${POSTGRES_USER:=agrogestor}"
: "${POSTGRES_DB:=agrogestor}"

echo "Waiting for postgres (host: db)..."
until pg_isready -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do
  sleep 1
done

echo "Postgres is ready. Running DB init and seed (if present)..."

python init_db.py || true
python seed.py || true

if [ "${GUNICORN:-0}" = "1" ]; then
  WORKERS="${GUNICORN_WORKERS:-2}"
  TIMEOUT="${GUNICORN_TIMEOUT:-120}"
  echo "Starting Gunicorn (${WORKERS} workers)..."
  exec gunicorn \
    --bind 0.0.0.0:5000 \
    --workers "$WORKERS" \
    --timeout "$TIMEOUT" \
    --access-logfile - \
    --error-logfile - \
    wsgi:app
else
  echo "Starting Flask dev server..."
  exec python app.py
fi
