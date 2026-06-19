from flask import Blueprint, jsonify

from db.models import Animal, Lote, Vacinacao
from routes.helpers import require_auth
from services.auth_service import find_producers_for_cooperative, is_cooperative_user

stats_bp = Blueprint("stats", __name__)


@stats_bp.get("/api/stats")
@require_auth
def obter_stats(user):
    user_id = user["id"]
    if is_cooperative_user(user):
        producer_ids = set(find_producers_for_cooperative(user_id))
        if not producer_ids:
            animais, lotes, vacinacoes = [], [], []
        else:
            animais = Animal.query.filter(Animal.user_id.in_(producer_ids)).all()
            lotes = Lote.query.filter(Lote.user_id.in_(producer_ids)).all()
            vacinacoes = Vacinacao.query.filter(Vacinacao.user_id.in_(producer_ids)).all()
    else:
        animais = Animal.query.filter_by(user_id=user_id).all()
        lotes = Lote.query.filter_by(user_id=user_id).all()
        vacinacoes = Vacinacao.query.filter_by(user_id=user_id).all()

    total_animais_lotes = sum(l.quantidade for l in lotes)
    total_animais = len(animais) + total_animais_lotes

    vacinados_lotes = sum(l.vacinados for l in lotes)
    vacinados_animais = sum(1 for a in animais if a.vacinas)
    total_vacinados = vacinados_lotes + vacinados_animais

    percentual = 0
    if total_animais > 0:
        percentual = min(100, round((total_vacinados / total_animais) * 100))

    return jsonify({
        "animais": total_animais,
        "lotes": len(lotes),
        "vacinas": len(vacinacoes),
        "percentualVacinados": percentual,
    })
