from datetime import datetime

from flask import Blueprint, jsonify, request

from db.database import db
from db.models import Conversa, Mensagem
from routes.helpers import require_auth
from services.auth_service import find_user_by_email, _perfil_publico
from utils import new_id

chat_bp = Blueprint("chat", __name__)


def _find_conversation(user_id, partner_id):
    return Conversa.query.filter_by(user_id=user_id, partner_id=partner_id).first()


def _create_chat_partner_conversations(user, partner):
    partner_type_display = partner.get("tipoConta", "Parceiro")
    agora = datetime.now().strftime("%H:%M")

    user_conv = _find_conversation(user["id"], partner["id"])
    partner_conv = _find_conversation(partner["id"], user["id"])

    if not partner_conv:
        partner_conv = Conversa(
            id=new_id(),
            user_id=partner["id"],
            partner_id=user["id"],
            name=user.get("nome", user.get("email", "Produtor")),
            type="Produtor",
            last_msg="Conversa iniciada com o produtor.",
            time_label=agora,
        )
        db.session.add(partner_conv)

    if not user_conv:
        user_conv = Conversa(
            id=new_id(),
            user_id=user["id"],
            partner_id=partner["id"],
            name=partner.get("nome", partner.get("email", partner_type_display)),
            type=partner_type_display,
            last_msg=f"Conversa iniciada com {partner_type_display.lower()}.",
            time_label=agora,
        )
        db.session.add(user_conv)

    db.session.commit()
    return partner_conv, user_conv


@chat_bp.post("/api/chat/profissionais/adicionar")
@require_auth
def adicionar_profissional_chat(user):
    user_tipo = str(user.get("tipoConta", "")).strip().lower()
    if user_tipo == "produtor":
        pass
    elif user_tipo in ["veterinária", "veterinario", "fornecedor"]:
        pass
    else:
        return jsonify({"message": "Não autorizado."}), 403

    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    if not email:
        return jsonify({"message": "Email é obrigatório."}), 400

    partner = find_user_by_email(email)
    if not partner:
        return jsonify({"message": "Este usuário não existe."}), 400

    partner_tipo = str(partner.get("tipoConta", "")).strip().lower()
    allowed_types = ["veterinária", "veterinario", "fornecedor"]

    if partner_tipo not in allowed_types:
        return jsonify({"message": "Você só pode conversar com veterinários e fornecedores."}), 400

    _, user_conv = _create_chat_partner_conversations(user, partner)
    return jsonify(
        {
            "conversationId": user_conv.id,
            "partnerId": partner.get("id"),
            "partner": _perfil_publico(partner),
        }
    ), 201


@chat_bp.get("/api/conversas")
@require_auth
def listar_conversas(user):
    conversas = []
    for conv in Conversa.query.filter_by(user_id=user["id"]).order_by(Conversa.updated_at.desc()).all():
        mensagens = Mensagem.query.filter_by(conversa_id=conv.id).order_by(Mensagem.created_at).all()
        unread = sum(1 for m in mensagens if m.sender_side == "them" and not m.lida)
        data = conv.to_dict(include_messages=True, unread=unread)
        data["messages"] = [m.to_dict() for m in mensagens]
        conversas.append(data)
    return jsonify(conversas)


@chat_bp.get("/api/conversas/<conversa_id>/mensagens")
@require_auth
def listar_mensagens(user, conversa_id):
    conv = Conversa.query.filter_by(id=conversa_id, user_id=user["id"]).first()
    if not conv:
        return jsonify({"message": "Conversa não encontrada."}), 404
    mensagens = Mensagem.query.filter_by(conversa_id=conversa_id).order_by(Mensagem.created_at).all()
    return jsonify([m.to_dict() for m in mensagens])


@chat_bp.post("/api/conversas/<conversa_id>/mensagens")
@require_auth
def enviar_mensagem(user, conversa_id):
    conv = Conversa.query.filter_by(id=conversa_id, user_id=user["id"]).first()
    if not conv:
        return jsonify({"message": "Conversa não encontrada."}), 404

    data = request.get_json(silent=True) or {}
    texto = str(data.get("text", "")).strip()
    if not texto:
        return jsonify({"message": "Mensagem vazia."}), 400

    agora = datetime.now().strftime("%H:%M")
    msg = Mensagem(
        id=new_id(),
        conversa_id=conversa_id,
        sender_side="me",
        text=texto,
        time_label=agora,
        status="sent",
    )
    db.session.add(msg)

    mirror_conv = None
    if conv.partner_id:
        mirror_conv = Conversa.query.filter_by(
            user_id=conv.partner_id, partner_id=conv.user_id
        ).first()

    if mirror_conv:
        db.session.add(
            Mensagem(
                id=new_id(),
                conversa_id=mirror_conv.id,
                sender_side="them",
                text=texto,
                time_label=agora,
                status="received",
            )
        )

    conv.last_msg = texto
    conv.time_label = agora
    if mirror_conv:
        mirror_conv.last_msg = texto
        mirror_conv.time_label = agora

    db.session.commit()
    return jsonify(msg.to_dict()), 201
