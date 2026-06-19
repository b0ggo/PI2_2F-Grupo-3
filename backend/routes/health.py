from flask import Blueprint, jsonify

from db.database import db
from sqlalchemy import text

health_bp = Blueprint("health", __name__)


@health_bp.get("/api/health")
def health():
    db_ok = False
    try:
        db.session.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    status = "ok" if db_ok else "degraded"
    code = 200 if db_ok else 503
    return jsonify({
        "status": status,
        "service": "agrogestor-api",
        "database": "connected" if db_ok else "disconnected",
    }), code
