from datetime import date, datetime

from flask import Blueprint, jsonify, request

from config import VACINACOES_FILE
from routes.helpers import require_auth
from storage.json_store import load_list, new_id, save_list

vacinacoes_bp = Blueprint("vacinacoes", __name__)


def _filtrar_user(items, user_id):
    return [v for v in items if v.get("userId") == user_id]


def _parse_date(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value)).date()
    except ValueError:
        try:
            return datetime.strptime(str(value), "%Y-%m-%d").date()
        except ValueError:
            return None


@vacinacoes_bp.get("/api/vacinacoes")
@require_auth
def listar_vacinacoes(user):
    return jsonify(_filtrar_user(load_list(VACINACOES_FILE), user["id"]))


@vacinacoes_bp.post("/api/vacinacoes")
@require_auth
def criar_vacinacao(user):
    data = request.get_json(silent=True) or {}
    if not data.get("tipoVacina") or not data.get("alvoLabel"):
        return jsonify({"message": "Animal/lote e tipo de vacina são obrigatórios."}), 400

    registro = {
        "id": new_id(),
        "userId": user["id"],
        "alvoTipo": data.get("alvoTipo", "animal"),
        "alvoId": data.get("alvoId", ""),
        "alvoLabel": str(data.get("alvoLabel", "")).strip(),
        "tipoVacina": str(data.get("tipoVacina", "")).strip(),
        "dataAplicacao": data.get("dataAplicacao", ""),
        "proximaDose": data.get("proximaDose", ""),
        "observacoes": str(data.get("observacoes", "")).strip(),
    }

    vacinacoes = load_list(VACINACOES_FILE)
    vacinacoes.append(registro)
    save_list(VACINACOES_FILE, vacinacoes)
    return jsonify(registro), 201


def build_alertas(user_id):
    hoje = date.today()
    alertas = []
    for vac in _filtrar_user(load_list(VACINACOES_FILE), user_id):
        proxima = _parse_date(vac.get("proximaDose"))
        if not proxima:
            continue
        dias = (proxima - hoje).days
        titulo = f"{vac.get('tipoVacina', 'Vacina')} — {vac.get('alvoLabel', '')}"
        if dias < 0:
            detalhe = f"Reforço vencido há {abs(dias)} dias"
            urgente = True
        elif dias <= 30:
            detalhe = f"Próxima dose em {dias} dias"
            urgente = True
        else:
            detalhe = f"Próxima dose em {proxima.strftime('%d/%m/%Y')}"
            urgente = False
        alertas.append({
            "id": vac.get("id"),
            "titulo": titulo,
            "detalhe": detalhe,
            "urgente": urgente,
        })
    alertas.sort(key=lambda a: (not a["urgente"], a["detalhe"]))
    return alertas
