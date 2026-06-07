from datetime import datetime

from flask import Blueprint, jsonify, request

from config import CONVERSAS_FILE, MENSAGENS_FILE
from routes.helpers import require_auth
from storage.json_store import load_list, new_id, save_list

chat_bp = Blueprint("chat", __name__)


def _conversas_user(user_id):
    return [c for c in load_list(CONVERSAS_FILE) if c.get("userId") == user_id]


def _mensagens_conversa(conversa_id):
    return [m for m in load_list(MENSAGENS_FILE) if m.get("conversaId") == conversa_id]


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
    save_list(MENSAGENS_FILE, mensagens)

    conversas = load_list(CONVERSAS_FILE)
    for i, c in enumerate(conversas):
        if c.get("id") == conversa_id:
            conversas[i] = {**c, "lastMsg": texto, "time": agora}
            break
    save_list(CONVERSAS_FILE, conversas)

    return jsonify(msg), 201
