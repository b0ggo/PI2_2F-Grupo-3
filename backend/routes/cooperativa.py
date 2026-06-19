from datetime import datetime

from flask import Blueprint, jsonify, request

from db.database import db
from db.models import Conversa, User
from routes.helpers import require_auth
from seed import seed_chat_for_user, _create_coop_prod_conversations
from services.auth_service import (
    find_user_by_email,
    register_user,
    _perfil_publico,
)
from utils import new_id

cooperativa_bp = Blueprint("cooperativa", __name__)


def _is_cooperativa_user(user):
    tipo = str(user.get("tipoConta") or "").strip().lower()
    return tipo != "" and tipo != "produtor"


def _find_conversation(user_id, partner_id):
    return Conversa.query.filter_by(user_id=user_id, partner_id=partner_id).first()


def _create_chat_partner_conversations(cooperativa, partner):
    partner_type_display = partner.get("tipoConta", "Parceiro")
    agora = datetime.now().strftime("%H:%M")

    coop_conv = _find_conversation(cooperativa["id"], partner["id"])
    partner_conv = _find_conversation(partner["id"], cooperativa["id"])

    if not partner_conv:
        partner_conv = Conversa(
            id=new_id(),
            user_id=partner["id"],
            partner_id=cooperativa["id"],
            name=cooperativa.get("nome", "Cooperativa"),
            type="Cooperativa",
            last_msg="Conversa iniciada com a cooperativa.",
            time_label=agora,
        )
        db.session.add(partner_conv)

    if not coop_conv:
        coop_conv = Conversa(
            id=new_id(),
            user_id=cooperativa["id"],
            partner_id=partner["id"],
            name=partner.get("nome", partner.get("email", partner_type_display)),
            type=partner_type_display,
            last_msg=f"Conversa iniciada com {partner_type_display.lower()}.",
            time_label=agora,
        )
        db.session.add(coop_conv)

    db.session.commit()
    return partner_conv, coop_conv


def _associate_producer(user, produtor):
    if produtor.get("cooperativaId"):
        return produtor

    db_user = User.query.get(produtor["id"])
    if not db_user:
        return produtor

    db_user.cooperativa_id = user["id"]
    db.session.commit()
    return db_user.to_dict(private=True)


@cooperativa_bp.get("/api/cooperativa/produtores")
@require_auth
def listar_produtores(user):
    if not _is_cooperativa_user(user):
        return jsonify({"message": "Não autorizado."}), 403
    producers = User.query.filter_by(cooperativa_id=user["id"]).all()
    return jsonify([p.to_dict() for p in producers])


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
            "conversationId": coop_conv.id,
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
    allowed_types = ["veterinária", "veterinario", "fornecedor"]
    if partner_tipo not in allowed_types:
        return jsonify({"message": "Apenas veterinários e fornecedores podem ser adicionados ao chat."}), 400

    _, coop_conv = _create_chat_partner_conversations(user, partner)
    return jsonify(
        {
            "conversationId": coop_conv.id,
            "partnerId": partner.get("id"),
            "partner": _perfil_publico(partner),
        }
    ), 201


@cooperativa_bp.delete("/api/cooperativa/produtores/<produtor_id>")
@require_auth
def remover_produtor(user, produtor_id):
    if not _is_cooperativa_user(user):
        return jsonify({"message": "Não autorizado."}), 403

    db_user = User.query.filter_by(id=produtor_id, cooperativa_id=user["id"]).first()
    if not db_user:
        return jsonify({"message": "Produtor não encontrado."}), 404

    db_user.cooperativa_id = None
    db.session.commit()
    return jsonify({"message": "Produtor removido."}), 200
