FROM python:3.12-slim

WORKDIR /app

# Install system deps including pg client for pg_isready
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev gcc postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# ensure entrypoint is executable
RUN chmod +x /app/entrypoint.sh || true

EXPOSE 5000

ENTRYPOINT ["/app/entrypoint.sh"]
