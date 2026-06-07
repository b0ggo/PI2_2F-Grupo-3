from flask import Blueprint, jsonify, request

from config import LOTES_FILE
from routes.helpers import require_auth
from storage.json_store import load_list, new_id, save_list

lotes_bp = Blueprint("lotes", __name__)


def _filtrar_user(items, user_id):
    return [l for l in items if l.get("userId") == user_id]


@lotes_bp.get("/api/lotes")
@require_auth
def listar_lotes(user):
    return jsonify(_filtrar_user(load_list(LOTES_FILE), user["id"]))


@lotes_bp.get("/api/lotes/<lote_id>")
@require_auth
def obter_lote(user, lote_id):
    for lote in _filtrar_user(load_list(LOTES_FILE), user["id"]):
        if lote.get("id") == lote_id:
            return jsonify(lote)
    return jsonify({"message": "Lote não encontrado."}), 404


@lotes_bp.post("/api/lotes")
@require_auth
def criar_lote(user):
    data = request.get_json(silent=True) or {}
    nome = str(data.get("nome", "")).strip()
    if not nome:
        return jsonify({"message": "Nome do lote é obrigatório."}), 400

    quantidade = int(data.get("quantidade", 0))
    doentes = int(data.get("doentes", 0))
    mortes = int(data.get("mortes", 0))

    lote = {
        "id": new_id(),
        "userId": user["id"],
        "tipo": data.get("tipo", ""),
        "nome": nome,
        "quantidade": quantidade,
        "doentes": doentes,
        "vacinados": int(data.get("vacinados", 0)),
        "mortes": mortes,
        "observacoes": str(data.get("observacoes", "")).strip(),
        "total": quantidade,
        "saudaveis": max(0, quantidade - doentes - mortes),
    }

    lotes = load_list(LOTES_FILE)
    lotes.append(lote)
    save_list(LOTES_FILE, lotes)
    return jsonify(lote), 201
