from datetime import datetime
from flask import Blueprint, jsonify, request

from config import USERS_FILE, CONVERSAS_FILE
from routes.helpers import require_auth
from services.auth_service import (
    find_user_by_email,
    register_user,
    _perfil_publico,
)
from storage.json_store import load_list, save_list, new_id
from seed import seed_chat_for_user, _create_coop_prod_conversations

cooperativa_bp = Blueprint("cooperativa", __name__)


def _is_cooperativa_user(user):
    tipo = str(user.get("tipoConta") or "").strip().lower()
    return tipo != "" and tipo != "produtor"


@cooperativa_bp.get("/api/cooperativa/produtores")
@require_auth
def listar_produtores(user):
    if not _is_cooperativa_user(user):
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


def _create_chat_partner_conversations(cooperativa, partner):
    """Criar conversas com um parceiro de chat (veterinário, fornecedor) sem associar como produtor."""
    conversas = load_list(CONVERSAS_FILE)

    partner_tipo = str(partner.get("tipoConta") or "").strip().lower()
    partner_type_display = partner.get("tipoConta", "Parceiro")

    coop_conv = _find_conversation(cooperativa["id"], partner["id"])
    partner_conv = _find_conversation(partner["id"], cooperativa["id"])

    if not partner_conv:
        partner_conv = {
            "id": new_id(),
            "userId": partner["id"],
            "partnerId": cooperativa["id"],
            "name": cooperativa.get("nome", "Cooperativa"),
            "type": "Cooperativa",
            "lastMsg": "Conversa iniciada com a cooperativa.",
            "time": datetime.now().strftime("%H:%M"),
        }
        conversas.append(partner_conv)

    if not coop_conv:
        coop_conv = {
            "id": new_id(),
            "userId": cooperativa["id"],
            "partnerId": partner["id"],
            "name": partner.get("nome", partner.get("email", partner_type_display)),
            "type": partner_type_display,
            "lastMsg": f"Conversa iniciada com {partner_type_display.lower()}.",
            "time": datetime.now().strftime("%H:%M"),
        }
        conversas.append(coop_conv)

    save_list(CONVERSAS_FILE, conversas)
    return partner_conv, coop_conv


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
    if not _is_cooperativa_user(user):
        return jsonify({"message": "Não autorizado."}), 403

    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    if not email:
        return jsonify({"message": "Email é obrigatório."}), 400

    produtor = find_user_by_email(email)
    if not produtor:
        return jsonify({"message": "Este produtor não existe."}), 400

    produtor_tipo = str(produtor.get("tipoConta") or "").strip().lower()
    if produtor_tipo != "produtor":
        return jsonify({"message": "Usuário não é produtor."}), 400
    if produtor.get("cooperativaId") and produtor.get("cooperativaId") != user["id"]:
        return jsonify({"message": "Produtor já está vinculado a outra cooperativa."}), 400

    produtor = _associate_producer(user, produtor)
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
    if not _is_cooperativa_user(user):
        return jsonify({"message": "Não autorizado."}), 403
    data = request.get_json(silent=True) or {}
    # garantir que o novo usuário é um produtor vinculado a esta cooperativa
    data["tipoConta"] = data.get("tipoConta", "Produtor")
    data["cooperativaId"] = user["id"]
    try:
        novo = register_user(data)
        seed_chat_for_user(novo["id"], novo)
        return jsonify(_perfil_publico(novo)), 201
    except ValueError as err:
        return jsonify({"message": str(err)}), 400


@cooperativa_bp.post("/api/cooperativa/chat-partners/adicionar")
@require_auth
def adicionar_chat_partner(user):
    """Adicionar um veterinário ou fornecedor ao chat sem associar como produtor."""
    if not _is_cooperativa_user(user):
        return jsonify({"message": "Não autorizado."}), 403

    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    if not email:
        return jsonify({"message": "Email é obrigatório."}), 400

    partner = find_user_by_email(email)
    if not partner:
        return jsonify({"message": "Este usuário não existe."}), 400

    partner_tipo = str(partner.get("tipoConta", "")).strip().lower()
    # Apenas permitir tipos veterinário e fornecedor
    allowed_types = ["veterinária", "veterinario", "fornecedor"]
    if partner_tipo not in allowed_types:
        return jsonify({"message": "Apenas veterinários e fornecedores podem ser adicionados ao chat."}), 400

    _, coop_conv = _create_chat_partner_conversations(user, partner)
    return jsonify(
        {
            "conversationId": coop_conv.get("id"),
            "partnerId": partner.get("id"),
            "partner": _perfil_publico(partner),
        }
    ), 201


@cooperativa_bp.delete("/api/cooperativa/produtores/<produtor_id>")
@require_auth
def remover_produtor(user, produtor_id):
    if not _is_cooperativa_user(user):
        return jsonify({"message": "Não autorizado."}), 403

    users = load_list(USERS_FILE)
    for i, item in enumerate(users):
        if item.get("id") != produtor_id:
            continue
        if item.get("cooperativaId") != user["id"]:
            return jsonify({"message": "Produtor não encontrado para esta cooperativa."}), 404
        users[i] = {k: v for k, v in item.items() if k != "cooperativaId"}
        save_list(USERS_FILE, users)
        return jsonify({"message": "Produtor removido."}), 200

    return jsonify({"message": "Produtor não encontrado."}), 404
