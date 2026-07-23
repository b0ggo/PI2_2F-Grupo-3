from flask import Blueprint, jsonify, request

from db.database import db
from db.models import Animal, PesoHistorico
from routes.helpers import require_auth
from services.auth_service import find_producers_for_cooperative, is_cooperative_user
from utils import calcular_idade_meses, new_id, normalizar_sexo

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


def _aplicar_dados_animal(animal, data):
    """Aplica payload da API ao modelo, com regras de negócio."""
    sexo = normalizar_sexo(data.get("sexo", animal.sexo))
    data_nasc = data.get("dataNasc", animal.data_nasc)

    for api_key, col in CAMPOS.items():
        if api_key in data and api_key != "timestamp":
            setattr(animal, col, data[api_key])

    animal.sexo = sexo
    animal.data_nasc = data_nasc or None
    animal.idade = calcular_idade_meses(animal.data_nasc)

    if animal.tipo == "bovino" and sexo == "macho":
        animal.produtividade_leite = None
    elif "produtividadeLeite" in data and not (
        animal.tipo == "bovino" and sexo == "macho"
    ):
        valor = data.get("produtividadeLeite")
        animal.produtividade_leite = str(valor).strip() if valor else None


def _registrar_peso(animal, peso_novo, user_id):
    """Registra peso no histórico quando informado."""
    if peso_novo is None or str(peso_novo).strip() == "":
        return
    peso_str = str(peso_novo).strip()
    ultimo = (
        PesoHistorico.query.filter_by(animal_id=animal.id)
        .order_by(PesoHistorico.registrado_em.desc())
        .first()
    )
    if ultimo and ultimo.peso == peso_str:
        return
    registro = PesoHistorico(
        id=new_id(),
        animal_id=animal.id,
        user_id=user_id,
        peso=peso_str,
    )
    db.session.add(registro)


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


@animais_bp.get("/api/animais/<animal_id>/peso-historico")
@require_auth
def listar_peso_historico(user, animal_id):
    ids = _user_ids(user)
    animal = Animal.query.filter(Animal.id == animal_id, Animal.user_id.in_(ids)).first()
    if not animal:
        return jsonify({"message": "Animal não encontrado."}), 404
    registros = (
        PesoHistorico.query.filter_by(animal_id=animal_id)
        .order_by(PesoHistorico.registrado_em.asc())
        .all()
    )
    return jsonify([r.to_dict() for r in registros])


@animais_bp.post("/api/animais")
@require_auth
def criar_animal(user):
    data = request.get_json(silent=True) or {}
    identificacao = str(data.get("identificacao", "")).strip()
    if not identificacao:
        return jsonify({"message": "Identificação é obrigatória."}), 400

    animal = Animal(id=new_id(), user_id=user["id"], identificacao=identificacao)
    _aplicar_dados_animal(animal, data)

    if animal.tipo == "bovino" and animal.sexo == "macho" and data.get("produtividadeLeite"):
        return jsonify({
            "message": "Animais masculinos não podem ter produtividade leiteira."
        }), 400

    db.session.add(animal)
    db.session.flush()
    _registrar_peso(animal, animal.peso, user["id"])
    db.session.commit()
    return jsonify(animal.to_dict()), 201


@animais_bp.put("/api/animais/<animal_id>")
@require_auth
def atualizar_animal(user, animal_id):
    ids = _user_ids(user)
    animal = Animal.query.filter(Animal.id == animal_id, Animal.user_id.in_(ids)).first()
    if not animal:
        return jsonify({"message": "Animal não encontrado."}), 404

    data = request.get_json(silent=True) or {}
    identificacao = str(data.get("identificacao", animal.identificacao)).strip()
    if not identificacao:
        return jsonify({"message": "Identificação é obrigatória."}), 400

    peso_anterior = animal.peso
    _aplicar_dados_animal(animal, data)

    if animal.tipo == "bovino" and animal.sexo == "macho" and data.get("produtividadeLeite"):
        return jsonify({
            "message": "Animais masculinos não podem ter produtividade leiteira."
        }), 400

    if "peso" in data and str(data.get("peso") or "").strip() != str(peso_anterior or "").strip():
        _registrar_peso(animal, animal.peso, user["id"])

    db.session.commit()
    return jsonify(animal.to_dict())
