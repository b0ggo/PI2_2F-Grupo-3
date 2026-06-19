from flask import Blueprint, jsonify, request

from db.models import Animal, Lote
from routes.helpers import require_auth

busca_bp = Blueprint("busca", __name__)


@busca_bp.get("/api/busca")
@require_auth
def buscar(user):
    q = request.args.get("q", "").strip().lower()
    if not q:
        return jsonify([])

    user_id = user["id"]
    resultados = []

    for animal in Animal.query.filter_by(user_id=user_id).all():
        label = animal.identificacao or ""
        if q in label.lower() or q in (animal.raca or "").lower():
            resultados.append({
                "tipo": "animal",
                "id": animal.id,
                "titulo": label,
                "subtitulo": f"{animal.tipo} · {animal.raca}",
            })

    for lote in Lote.query.filter_by(user_id=user_id).all():
        nome = lote.nome or ""
        if q in nome.lower() or q in (lote.tipo or "").lower():
            resultados.append({
                "tipo": "lote",
                "id": lote.id,
                "titulo": nome,
                "subtitulo": f"{lote.tipo} · {lote.quantidade} animais",
            })

    return jsonify(resultados)
