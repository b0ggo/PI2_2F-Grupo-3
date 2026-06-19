from flask import Blueprint, jsonify

from routes.helpers import require_auth
from services.auth_service import _perfil_publico

perfil_bp = Blueprint("perfil", __name__)


@perfil_bp.get("/api/perfil")
@require_auth
def get_perfil(user):
    return jsonify(_perfil_publico(user))


@perfil_bp.put("/api/perfil")
@require_auth
def put_perfil(user):
    from flask import request
    from services.auth_service import update_user_profile

    data = request.get_json(silent=True) or {}
    try:
        perfil = update_user_profile(user["id"], data)
        return jsonify(perfil)
    except ValueError as err:
        return jsonify({"message": str(err)}), 400
