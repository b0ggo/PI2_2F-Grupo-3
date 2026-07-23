from flask import Blueprint, jsonify

from db.database import db
from db.models import NotificacaoDispensada
from routes.helpers import require_auth
from routes.vacinacoes import build_alertas
from utils import new_id

alertas_bp = Blueprint("alertas", __name__)


def _ids_dispensados(user_id):
    rows = NotificacaoDispensada.query.filter_by(user_id=user_id).all()
    return {r.alerta_id for r in rows}


@alertas_bp.get("/api/alertas")
@require_auth
def listar_alertas(user):
    dispensados = _ids_dispensados(user["id"])
    alertas = [a for a in build_alertas(user["id"]) if a["id"] not in dispensados]
    return jsonify(alertas)


@alertas_bp.delete("/api/alertas/<alerta_id>")
@require_auth
def excluir_alerta(user, alerta_id):
    existente = NotificacaoDispensada.query.filter_by(
        user_id=user["id"], alerta_id=alerta_id
    ).first()
    if not existente:
        registro = NotificacaoDispensada(
            id=new_id(),
            user_id=user["id"],
            alerta_id=alerta_id,
        )
        db.session.add(registro)
        db.session.commit()
    return "", 204
