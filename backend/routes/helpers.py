from functools import wraps

from flask import jsonify, request

from services.auth_service import get_user_from_token


def get_bearer_token():
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:].strip()
    return None


def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = get_bearer_token()
        user = get_user_from_token(token)
        if not user:
            return jsonify({"message": "Não autorizado."}), 401
        return fn(user, *args, **kwargs)

    return wrapper
