from datetime import date, datetime

from flask import Blueprint, jsonify, request

from db.database import db
from db.models import Vacinacao
from routes.helpers import require_auth
from utils import new_id

vacinacoes_bp = Blueprint("vacinacoes", __name__)


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
    items = (
        Vacinacao.query.filter_by(user_id=user["id"])
        .order_by(Vacinacao.created_at.desc())
        .all()
    )
    return jsonify([v.to_dict() for v in items])


@vacinacoes_bp.post("/api/vacinacoes")
@require_auth
def criar_vacinacao(user):
    data = request.get_json(silent=True) or {}
    if not data.get("tipoVacina") or not data.get("alvoLabel"):
        return jsonify({"message": "Animal/lote e tipo de vacina são obrigatórios."}), 400

    registro = Vacinacao(
        id=new_id(),
        user_id=user["id"],
        alvo_tipo=data.get("alvoTipo", "animal"),
        alvo_id=str(data.get("alvoId", "")),
        alvo_label=str(data.get("alvoLabel", "")).strip(),
        tipo_vacina=str(data.get("tipoVacina", "")).strip(),
        data_aplicacao=data.get("dataAplicacao") or None,
        proxima_dose=data.get("proximaDose") or None,
        observacoes=str(data.get("observacoes", "")).strip(),
    )

    db.session.add(registro)
    db.session.commit()
    return jsonify(registro.to_dict()), 201


def build_alertas(user_id):
    hoje = date.today()
    alertas = []
    vacinacoes = Vacinacao.query.filter_by(user_id=user_id).all()
    for vac in vacinacoes:
        proxima = _parse_date(vac.proxima_dose)
        if not proxima:
            continue
        dias = (proxima - hoje).days
        titulo = f"{vac.tipo_vacina} — {vac.alvo_label}"
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
            "id": vac.id,
            "titulo": titulo,
            "detalhe": detalhe,
            "urgente": urgente,
        })
    alertas.sort(key=lambda a: (not a["urgente"], a["detalhe"]))
    return alertas
