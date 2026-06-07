from flask import Blueprint, jsonify, request

from config import ANIMAIS_FILE, LOTES_FILE
from routes.helpers import require_auth
from storage.json_store import load_list

busca_bp = Blueprint("busca", __name__)


@busca_bp.get("/api/busca")
@require_auth
def buscar(user):
    q = request.args.get("q", "").strip().lower()
    if not q:
        return jsonify([])

    user_id = user["id"]
    resultados = []

    for animal in load_list(ANIMAIS_FILE):
        if animal.get("userId") != user_id:
            continue
        label = animal.get("identificacao", "")
        if q in label.lower() or q in animal.get("raca", "").lower():
            resultados.append({
                "tipo": "animal",
                "id": animal.get("id"),
                "titulo": label,
                "subtitulo": f"{animal.get('tipo', '')} · {animal.get('raca', '')}",
            })

    for lote in load_list(LOTES_FILE):
        if lote.get("userId") != user_id:
            continue
        nome = lote.get("nome", "")
        if q in nome.lower() or q in lote.get("tipo", "").lower():
            resultados.append({
                "tipo": "lote",
                "id": lote.get("id"),
                "titulo": nome,
                "subtitulo": f"{lote.get('tipo', '')} · {lote.get('quantidade', 0)} animais",
            })

    return jsonify(resultados)
