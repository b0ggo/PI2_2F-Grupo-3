from datetime import datetime

from flask import Blueprint, jsonify, request

from config import CONVERSAS_FILE, MENSAGENS_FILE
from routes.helpers import require_auth
from services.auth_service import find_user_by_email, _perfil_publico
from storage.json_store import load_list, new_id, save_list

chat_bp = Blueprint("chat", __name__)


def _conversas_user(user_id):
    return [c for c in load_list(CONVERSAS_FILE) if c.get("userId") == user_id]


def _mensagens_conversa(conversa_id):
    return [m for m in load_list(MENSAGENS_FILE) if m.get("conversaId") == conversa_id]


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


def _create_chat_partner_conversations(user, partner):
    """Criar conversas com um parceiro de chat (veterinário, fornecedor) sem associar."""
    conversas = load_list(CONVERSAS_FILE)

    partner_type_display = partner.get("tipoConta", "Parceiro")

    user_conv = _find_conversation(user["id"], partner["id"])
    partner_conv = _find_conversation(partner["id"], user["id"])

    if not partner_conv:
        partner_conv = {
            "id": new_id(),
            "userId": partner["id"],
            "partnerId": user["id"],
            "name": user.get("nome", user.get("email", "Produtor")),
            "type": "Produtor",
            "lastMsg": "Conversa iniciada com o produtor.",
            "time": datetime.now().strftime("%H:%M"),
        }
        conversas.append(partner_conv)

    if not user_conv:
        user_conv = {
            "id": new_id(),
            "userId": user["id"],
            "partnerId": partner["id"],
            "name": partner.get("nome", partner.get("email", partner_type_display)),
            "type": partner_type_display,
            "lastMsg": f"Conversa iniciada com {partner_type_display.lower()}.",
            "time": datetime.now().strftime("%H:%M"),
        }
        conversas.append(user_conv)

    save_list(CONVERSAS_FILE, conversas)
    return partner_conv, user_conv


@chat_bp.post("/api/chat/profissionais/adicionar")
@require_auth
def adicionar_profissional_chat(user):
    """Adicionar um veterinário ou fornecedor ao chat (apenas para produtores)."""
    user_tipo = str(user.get("tipoConta", "")).strip().lower()
    if user_tipo == "produtor":
        pass
    elif user_tipo in ["veterinária", "veterinario", "fornecedor"]:
        # Permitir vets/fornecedores conversar com outros vets/fornecedores
        pass
    else:
        # Cooperativas não podem usar este endpoint
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
        return jsonify({"message": "Você só pode conversar com veterinários e fornecedores."}), 400

    _, user_conv = _create_chat_partner_conversations(user, partner)
    return jsonify(
        {
            "conversationId": user_conv.get("id"),
            "partnerId": partner.get("id"),
            "partner": _perfil_publico(partner),
        }
    ), 201


@chat_bp.get("/api/conversas")
@require_auth
def listar_conversas(user):
    conversas = []
    for conv in _conversas_user(user["id"]):
        mensagens = _mensagens_conversa(conv["id"])
        unread = sum(1 for m in mensagens if m.get("from") == "them" and not m.get("lida"))
        conversas.append({
            **conv,
            "unread": unread,
            "messages": mensagens,
        })
    return jsonify(conversas)


@chat_bp.get("/api/conversas/<conversa_id>/mensagens")
@require_auth
def listar_mensagens(user, conversa_id):
    conv = next((c for c in _conversas_user(user["id"]) if c["id"] == conversa_id), None)
    if not conv:
        return jsonify({"message": "Conversa não encontrada."}), 404
    return jsonify(_mensagens_conversa(conversa_id))


@chat_bp.post("/api/conversas/<conversa_id>/mensagens")
@require_auth
def enviar_mensagem(user, conversa_id):
    conv = next((c for c in _conversas_user(user["id"]) if c["id"] == conversa_id), None)
    if not conv:
        return jsonify({"message": "Conversa não encontrada."}), 404

    data = request.get_json(silent=True) or {}
    texto = str(data.get("text", "")).strip()
    if not texto:
        return jsonify({"message": "Mensagem vazia."}), 400

    agora = datetime.now().strftime("%H:%M")
    msg = {
        "id": new_id(),
        "conversaId": conversa_id,
        "from": "me",
        "text": texto,
        "time": agora,
        "status": "sent",
    }

    mensagens = load_list(MENSAGENS_FILE)
    mensagens.append(msg)

    mirror_conv = next(
        (
            c
            for c in load_list(CONVERSAS_FILE)
            if c.get("userId") == conv.get("partnerId")
            and c.get("partnerId") == conv.get("userId")
        ),
        None,
    )

    if mirror_conv:
        mensagens.append({
            "id": new_id(),
            "conversaId": mirror_conv["id"],
            "from": "them",
            "text": texto,
            "time": agora,
            "status": "received",
        })

    save_list(MENSAGENS_FILE, mensagens)

    conversas = load_list(CONVERSAS_FILE)
    for i, c in enumerate(conversas):
        if c.get("id") == conversa_id or (mirror_conv and c.get("id") == mirror_conv["id"]):
            conversas[i] = {**c, "lastMsg": texto, "time": agora}
    save_list(CONVERSAS_FILE, conversas)

    return jsonify(msg), 201
