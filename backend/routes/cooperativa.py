from flask import Blueprint, jsonify, request

from config import USERS_FILE
from routes.helpers import require_auth
from services.auth_service import (
    find_user_by_email,
    register_user,
    _perfil_publico,
)
from storage.json_store import load_list, save_list
from seed import seed_chat_for_user, _create_coop_prod_conversations

cooperativa_bp = Blueprint("cooperativa", __name__)


@cooperativa_bp.get("/api/cooperativa/produtores")
@require_auth
def listar_produtores(user):
    if user.get("tipoConta") != "Cooperativa":
        return jsonify({"message": "Não autorizado."}), 403
    users = load_list(USERS_FILE)
    producers = [u for u in users if u.get("cooperativaId") == user["id"]]
    return jsonify([_perfil_publico(p) for p in producers])


def _find_conversation(user_id, partner_id):
    conversas = load_list(CONVERSAS_FILE)
    return next(
        (
            c
            for c in conversas
            if c.get("userId") == user_id and c.get("partnerId") == partner_id
        ),
        None,
    )


def _associate_producer(user, produtor):
    if produtor.get("cooperativaId"):
        return produtor

    users = load_list(USERS_FILE)
    for i, item in enumerate(users):
        if item.get("id") != produtor.get("id"):
            continue
        users[i] = {**item, "cooperativaId": user["id"]}
        produtor = users[i]
        save_list(USERS_FILE, users)
        break

    return produtor


@cooperativa_bp.post("/api/cooperativa/produtores/associar")
@require_auth
def associar_produtor(user):
    if user.get("tipoConta") != "Cooperativa":
        return jsonify({"message": "Não autorizado."}), 403

    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    if not email:
        return jsonify({"message": "Email é obrigatório."}), 400

    produtor = find_user_by_email(email)
    if produtor:
        if produtor.get("tipoConta") != "Produtor":
            return jsonify({"message": "Usuário não é produtor."}), 400
        if produtor.get("cooperativaId") and produtor.get("cooperativaId") != user["id"]:
            return jsonify({"message": "Produtor já está vinculado a outra cooperativa."}), 400
        produtor = _associate_producer(user, produtor)
    else:
        data = {
            "email": email,
            "nome": email.split("@")[0] if "@" in email else email,
            "tipoConta": "Produtor",
            "cooperativaId": user["id"],
            "senha": "produtor123",
        }
        try:
            produtor = register_user(data)
        except ValueError as err:
            return jsonify({"message": str(err)}), 400

    _, coop_conv = _create_coop_prod_conversations(user, produtor)
    return jsonify(
        {
            "conversationId": coop_conv.get("id"),
            "partnerId": produtor.get("id"),
            "partner": _perfil_publico(produtor),
        }
    ), 201


@cooperativa_bp.post("/api/cooperativa/produtores")
@require_auth
def criar_produtor(user):
    if user.get("tipoConta") != "Cooperativa":
        return jsonify({"message": "Não autorizado."}), 403
    data = request.get_json(silent=True) or {}
    # ensure the new user is a producer linked to this cooperativa
    data["tipoConta"] = data.get("tipoConta", "Produtor")
    data["cooperativaId"] = user["id"]
    try:
        novo = register_user(data)
        seed_chat_for_user(novo["id"], novo)
        return jsonify(_perfil_publico(novo)), 201
    except ValueError as err:
        return jsonify({"message": str(err)}), 400
