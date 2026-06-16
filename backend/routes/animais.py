from flask import Blueprint, jsonify, request

from config import ANIMAIS_FILE
from routes.helpers import require_auth
from storage.json_store import load_list, new_id, save_list
from services.auth_service import find_producers_for_cooperative

animais_bp = Blueprint("animais", __name__)

CAMPOS = (
    "tipo", "identificacao", "raca", "idade", "peso", "sexo",
    "dataNasc", "status", "vacinas", "historico", "produtividadeLeite",
    "timestamp",
)


def _filtrar_user(items, user):
    if user.get("tipoConta") == "Cooperativa":
        producer_ids = set(find_producers_for_cooperative(user["id"]))
        return [a for a in items if a.get("userId") in producer_ids]
    return [a for a in items if a.get("userId") == user["id"]]


@animais_bp.get("/api/animais")
@require_auth
def listar_animais(user):
    items = _filtrar_user(load_list(ANIMAIS_FILE), user)
    q = request.args.get("q", "").strip().lower()
    if q:
        items = [
            a for a in items
            if q in a.get("identificacao", "").lower()
            or q in a.get("raca", "").lower()
            or q in a.get("tipo", "").lower()
        ]
    return jsonify(items)


@animais_bp.get("/api/animais/<animal_id>")
@require_auth
def obter_animal(user, animal_id):
    for animal in _filtrar_user(load_list(ANIMAIS_FILE), user):
        if animal.get("id") == animal_id:
            return jsonify(animal)
    return jsonify({"message": "Animal não encontrado."}), 404


@animais_bp.post("/api/animais")
@require_auth
def criar_animal(user):
    data = request.get_json(silent=True) or {}
    identificacao = str(data.get("identificacao", "")).strip()
    if not identificacao:
        return jsonify({"message": "Identificação é obrigatória."}), 400

    animal = {"id": new_id(), "userId": user["id"]}
    for campo in CAMPOS:
        if campo in data:
            animal[campo] = data[campo]

    animais = load_list(ANIMAIS_FILE)
    animais.append(animal)
    save_list(ANIMAIS_FILE, animais)
    return jsonify(animal), 201
