from flask import Blueprint, jsonify, request

from seed import seed_chat_for_user
from services.auth_service import login_user, logout_user, register_user, reset_password

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    try:
        user = register_user(data)
        seed_chat_for_user(user["id"], user)
        token, perfil = login_user(data.get("email", ""), data.get("senha", ""))
        return jsonify({"token": token, "perfil": perfil}), 201
    except ValueError as err:
        return jsonify({"message": str(err)}), 400


@auth_bp.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "")
    senha = data.get("senha", "")
    try:
        from services.auth_service import find_user_by_email
        user = find_user_by_email(email)
        if user:
            seed_chat_for_user(user["id"], user)
        token, perfil = login_user(email, senha)
        return jsonify({"token": token, "perfil": perfil})
    except ValueError as err:
        return jsonify({"message": str(err)}), 401


@auth_bp.post("/api/auth/redefinir-senha")
def redefinir_senha():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "")
    senha = data.get("senha", "")
    try:
        reset_password(email, senha)
        return jsonify({"message": "Senha redefinida com sucesso."})
    except ValueError as err:
        return jsonify({"message": str(err)}), 400


@auth_bp.post("/api/auth/logout")
def logout():
    from routes.helpers import get_bearer_token
    from services.auth_service import logout_user as do_logout

    do_logout(get_bearer_token())
    return jsonify({"message": "Logout realizado."})
