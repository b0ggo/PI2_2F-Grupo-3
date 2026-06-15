from flask import Blueprint

from routes.alertas import alertas_bp
from routes.animais import animais_bp
from routes.auth import auth_bp
from routes.busca import busca_bp
from routes.chat import chat_bp
from routes.health import health_bp
from routes.lotes import lotes_bp
from routes.perfil import perfil_bp
from routes.stats import stats_bp
from routes.vacinacoes import vacinacoes_bp
from routes.cooperativa import cooperativa_bp


def register_routes(app):
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(perfil_bp)
    app.register_blueprint(animais_bp)
    app.register_blueprint(lotes_bp)
    app.register_blueprint(vacinacoes_bp)
    app.register_blueprint(alertas_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(busca_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(cooperativa_bp)
