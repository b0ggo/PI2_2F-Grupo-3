from flask import Blueprint, jsonify, request

from db.database import db
from db.models import Lote
from routes.helpers import require_auth
from services.auth_service import find_producers_for_cooperative, is_cooperative_user
from utils import new_id

lotes_bp = Blueprint("lotes", __name__)


def _user_ids(user):
    if is_cooperative_user(user):
        return set(find_producers_for_cooperative(user["id"]))
    return {user["id"]}


def _query_lotes(user):
    ids = _user_ids(user)
    if not ids:
        return Lote.query.filter(Lote.id.is_(None))
    return Lote.query.filter(Lote.user_id.in_(ids)).order_by(Lote.created_at.desc())


@lotes_bp.get("/api/lotes")
@require_auth
def listar_lotes(user):
    return jsonify([l.to_dict() for l in _query_lotes(user).all()])


@lotes_bp.get("/api/lotes/<lote_id>")
@require_auth
def obter_lote(user, lote_id):
    ids = _user_ids(user)
    lote = Lote.query.filter(Lote.id == lote_id, Lote.user_id.in_(ids)).first()
    if not lote:
        return jsonify({"message": "Lote não encontrado."}), 404
    return jsonify(lote.to_dict())


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

    lote = Lote(
        id=new_id(),
        user_id=user["id"],
        tipo=data.get("tipo", ""),
        nome=nome,
        quantidade=quantidade,
        doentes=doentes,
        vacinados=int(data.get("vacinados", 0)),
        mortes=mortes,
        observacoes=str(data.get("observacoes", "")).strip(),
    )

    db.session.add(lote)
    db.session.commit()
    return jsonify(lote.to_dict()), 201


@lotes_bp.put("/api/lotes/<lote_id>")
@require_auth
def atualizar_lote(user, lote_id):
    ids = _user_ids(user)
    lote = Lote.query.filter(Lote.id == lote_id, Lote.user_id.in_(ids)).first()
    if not lote:
        return jsonify({"message": "Lote não encontrado."}), 404

    data = request.get_json(silent=True) or {}
    nome = str(data.get("nome", lote.nome)).strip()
    if not nome:
        return jsonify({"message": "Nome do lote é obrigatório."}), 400

    quantidade = int(data.get("quantidade", lote.quantidade))
    doentes = int(data.get("doentes", lote.doentes))
    mortes = int(data.get("mortes", lote.mortes))

    if doentes + mortes > quantidade:
        return jsonify({
            "message": "A soma de doentes e mortes não pode ser maior que a quantidade total de animais."
        }), 400

    if "tipo" in data:
        lote.tipo = data["tipo"]
    lote.nome = nome
    lote.quantidade = quantidade
    lote.doentes = doentes
    lote.vacinados = int(data.get("vacinados", lote.vacinados))
    lote.mortes = mortes
    if "observacoes" in data:
        lote.observacoes = str(data.get("observacoes", "")).strip()

    db.session.commit()
    return jsonify(lote.to_dict())
