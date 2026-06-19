from flask import Blueprint, jsonify, request

from db.database import db
from db.models import Animal
from routes.helpers import require_auth
from services.auth_service import find_producers_for_cooperative, is_cooperative_user
from utils import new_id

animais_bp = Blueprint("animais", __name__)

CAMPOS = {
    "tipo": "tipo",
    "identificacao": "identificacao",
    "raca": "raca",
    "idade": "idade",
    "peso": "peso",
    "sexo": "sexo",
    "dataNasc": "data_nasc",
    "status": "status",
    "vacinas": "vacinas",
    "historico": "historico",
    "produtividadeLeite": "produtividade_leite",
    "timestamp": "registrado_em",
}


def _user_ids(user):
    if is_cooperative_user(user):
        return set(find_producers_for_cooperative(user["id"]))
    return {user["id"]}


def _query_animais(user):
    ids = _user_ids(user)
    if not ids:
        return Animal.query.filter(Animal.id.is_(None))
    return Animal.query.filter(Animal.user_id.in_(ids)).order_by(Animal.registrado_em.desc())


@animais_bp.get("/api/animais")
@require_auth
def listar_animais(user):
    items = _query_animais(user).all()
    q = request.args.get("q", "").strip().lower()
    if q:
        items = [
            a for a in items
            if q in (a.identificacao or "").lower()
            or q in (a.raca or "").lower()
            or q in (a.tipo or "").lower()
        ]
    return jsonify([a.to_dict() for a in items])


@animais_bp.get("/api/animais/<animal_id>")
@require_auth
def obter_animal(user, animal_id):
    ids = _user_ids(user)
    animal = Animal.query.filter(Animal.id == animal_id, Animal.user_id.in_(ids)).first()
    if not animal:
        return jsonify({"message": "Animal não encontrado."}), 404
    return jsonify(animal.to_dict())


@animais_bp.post("/api/animais")
@require_auth
def criar_animal(user):
    data = request.get_json(silent=True) or {}
    identificacao = str(data.get("identificacao", "")).strip()
    if not identificacao:
        return jsonify({"message": "Identificação é obrigatória."}), 400

    animal = Animal(id=new_id(), user_id=user["id"], identificacao=identificacao)
    for api_key, col in CAMPOS.items():
        if api_key in data and api_key != "timestamp":
            setattr(animal, col, data[api_key])

    db.session.add(animal)
    db.session.commit()
    return jsonify(animal.to_dict()), 201
