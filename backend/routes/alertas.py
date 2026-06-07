from flask import Blueprint, jsonify

from routes.helpers import require_auth
from routes.vacinacoes import build_alertas

alertas_bp = Blueprint("alertas", __name__)


@alertas_bp.get("/api/alertas")
@require_auth
def listar_alertas(user):
    return jsonify(build_alertas(user["id"]))
