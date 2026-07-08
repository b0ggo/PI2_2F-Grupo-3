from werkzeug.security import check_password_hash, generate_password_hash

from db.database import db
from db.models import AuthToken, User
from utils import new_id


def _perfil_publico(user):
    if isinstance(user, dict):
        return {
            "id": user.get("id", ""),
            "nome": user.get("nome", ""),
            "email": user.get("email", ""),
            "telefone": user.get("telefone", ""),
            "localizacao": user.get("localizacao", ""),
            "cpfCnpj": user.get("cpfCnpj", ""),
            "tipoConta": user.get("tipoConta", ""),
            "fotoPerfil": user.get("fotoPerfil", ""),
        }
    return user.to_dict()


def find_user_by_email(email):
    email = email.strip().lower()
    user = User.query.filter_by(email=email).first()
    return user.to_dict(private=True) if user else None


def find_user_by_id(user_id):
    user = User.query.get(user_id)
    return user.to_dict(private=True) if user else None


def find_producers_for_cooperative(coop_id):
    return [
        u.id
        for u in User.query.filter_by(cooperativa_id=coop_id).all()
    ]


def is_cooperative_user(user):
    tipo = str(user.get("tipoConta") or "").strip().lower()
    return tipo != "" and tipo != "produtor"


def register_user(data):
    email = data.get("email", "").strip().lower()
    if not email or not data.get("senha"):
        raise ValueError("Email e senha são obrigatórios.")

    if User.query.filter_by(email=email).first():
        raise ValueError("Este email já está cadastrado.")

    user = User(
        id=new_id(),
        nome=data.get("nome", "").strip(),
        email=email,
        telefone=data.get("telefone", "").strip(),
        localizacao=data.get("localizacao", "").strip(),
        cpf_cnpj=data.get("cpfCnpj", "").strip(),
        tipo_conta=data.get("tipoConta", "").strip(),
        senha_hash=generate_password_hash(data["senha"]),
    )

    if data.get("cooperativaId"):
        user.cooperativa_id = str(data.get("cooperativaId")).strip()

    db.session.add(user)
    db.session.commit()
    return user.to_dict(private=True)


def login_user(email, senha):
    user = User.query.filter_by(email=email.strip().lower()).first()
    if not user or not check_password_hash(user.senha_hash, senha):
        raise ValueError("Email ou senha incorretos.")

    token = new_id()
    db.session.add(AuthToken(token=token, user_id=user.id))
    db.session.commit()
    return token, user.to_dict()


def reset_password(email, senha):
    email = email.strip().lower()
    if not email or not senha:
        raise ValueError("Email e nova senha são obrigatórios.")
    if len(senha) < 6:
        raise ValueError("A senha deve ter no mínimo 6 caracteres.")

    user = User.query.filter_by(email=email).first()
    if not user:
        raise ValueError("Email não encontrado.")

    user.senha_hash = generate_password_hash(senha)
    db.session.commit()


def logout_user(token):
    if not token:
        return
    AuthToken.query.filter_by(token=token).delete()
    db.session.commit()


def get_user_from_token(token):
    if not token:
        return None
    auth = AuthToken.query.filter_by(token=token).first()
    if not auth:
        return None
    user = User.query.get(auth.user_id)
    return user.to_dict(private=True) if user else None


def update_user_profile(user_id, data):
    user = User.query.get(user_id)
    if not user:
        raise ValueError("Usuário não encontrado.")

    field_map = {
        "nome": "nome",
        "telefone": "telefone",
        "localizacao": "localizacao",
        "cpfCnpj": "cpf_cnpj",
        "tipoConta": "tipo_conta",
        "fotoPerfil": "foto_perfil",
    }
    for api_key, col in field_map.items():
        if api_key in data and data[api_key] is not None:
            setattr(user, col, str(data[api_key]).strip())

    if "email" in data and data["email"]:
        novo_email = str(data["email"]).strip().lower()
        existente = User.query.filter_by(email=novo_email).first()
        if existente and existente.id != user_id:
            raise ValueError("Este email já está em uso.")
        user.email = novo_email

    db.session.commit()
    return user.to_dict()
