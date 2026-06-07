from flask import Blueprint, jsonify

from config import ANIMAIS_FILE, LOTES_FILE, VACINACOES_FILE
from routes.helpers import require_auth
from storage.json_store import load_list

stats_bp = Blueprint("stats", __name__)


@stats_bp.get("/api/stats")
@require_auth
def obter_stats(user):
    user_id = user["id"]
    animais = [a for a in load_list(ANIMAIS_FILE) if a.get("userId") == user_id]
    lotes = [l for l in load_list(LOTES_FILE) if l.get("userId") == user_id]
    vacinacoes = [v for v in load_list(VACINACOES_FILE) if v.get("userId") == user_id]

    total_animais_lotes = sum(l.get("quantidade", 0) for l in lotes)
    total_animais = len(animais) + total_animais_lotes

    vacinados_lotes = sum(l.get("vacinados", 0) for l in lotes)
    vacinados_animais = sum(len(a.get("vacinas", [])) > 0 for a in animais)
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
