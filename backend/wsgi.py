"""Ponto de entrada WSGI para Gunicorn em produção."""
from app import app

__all__ = ["app"]
