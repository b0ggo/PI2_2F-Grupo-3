from flask import Blueprint, jsonify, request

from routes.helpers import require_auth
from services.auth_service import update_user_profile

perfil_bp = Blueprint("perfil", __name__)


def _perfil_publico(user):
    return {
        "nome": user.get("nome", ""),
        "email": user.get("email", ""),
        "telefone": user.get("telefone", ""),
        "localizacao": user.get("localizacao", ""),
        "cpfCnpj": user.get("cpfCnpj", ""),
        "tipoConta": user.get("tipoConta", ""),
    }


@perfil_bp.get("/api/perfil")
@require_auth
def get_perfil(user):
    return jsonify(_perfil_publico(user))


@perfil_bp.put("/api/perfil")
@require_auth
def put_perfil(user):
    data = request.get_json(silent=True) or {}
    try:
        perfil = update_user_profile(user["id"], data)
        return jsonify(perfil)
    except ValueError as err:
        return jsonify({"message": str(err)}), 400
