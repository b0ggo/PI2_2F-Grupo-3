from werkzeug.security import check_password_hash, generate_password_hash

from config import TOKENS_FILE, USERS_FILE
from storage.json_store import load_dict, load_list, new_id, save_dict, save_list


def _perfil_publico(user):
    return {
        "nome": user.get("nome", ""),
        "email": user.get("email", ""),
        "telefone": user.get("telefone", ""),
        "localizacao": user.get("localizacao", ""),
        "cpfCnpj": user.get("cpfCnpj", ""),
        "tipoConta": user.get("tipoConta", ""),
    }


def find_user_by_email(email):
    email = email.strip().lower()
    for user in load_list(USERS_FILE):
        if user.get("email", "").lower() == email:
            return user
    return None


def find_user_by_id(user_id):
    for user in load_list(USERS_FILE):
        if user.get("id") == user_id:
            return user
    return None


def register_user(data):
    email = data.get("email", "").strip().lower()
    if not email or not data.get("senha"):
        raise ValueError("Email e senha são obrigatórios.")

    if find_user_by_email(email):
        raise ValueError("Este email já está cadastrado.")

    user = {
        "id": new_id(),
        "nome": data.get("nome", "").strip(),
        "email": email,
        "telefone": data.get("telefone", "").strip(),
        "localizacao": data.get("localizacao", "").strip(),
        "cpfCnpj": data.get("cpfCnpj", "").strip(),
        "tipoConta": data.get("tipoConta", "").strip(),
        "senhaHash": generate_password_hash(data["senha"]),
    }

    users = load_list(USERS_FILE)
    users.append(user)
    save_list(USERS_FILE, users)
    return user


def login_user(email, senha):
    user = find_user_by_email(email)
    if not user or not check_password_hash(user.get("senhaHash", ""), senha):
        raise ValueError("Email ou senha incorretos.")

    token = new_id()
    tokens = load_dict(TOKENS_FILE)
    tokens[token] = user["id"]
    save_dict(TOKENS_FILE, tokens)
    return token, _perfil_publico(user)


def reset_password(email, senha):
    email = email.strip().lower()
    if not email or not senha:
        raise ValueError("Email e nova senha são obrigatórios.")
    if len(senha) < 6:
        raise ValueError("A senha deve ter no mínimo 6 caracteres.")

    user = find_user_by_email(email)
    if not user:
        raise ValueError("Email não encontrado.")

    users = load_list(USERS_FILE)
    for i, item in enumerate(users):
        if item.get("id") != user["id"]:
            continue
        users[i] = {**item, "senhaHash": generate_password_hash(senha)}
        save_list(USERS_FILE, users)
        return
    raise ValueError("Usuário não encontrado.")


def logout_user(token):
    if not token:
        return
    tokens = load_dict(TOKENS_FILE)
    if token in tokens:
        del tokens[token]
        save_dict(TOKENS_FILE, tokens)


def get_user_from_token(token):
    if not token:
        return None
    tokens = load_dict(TOKENS_FILE)
    user_id = tokens.get(token)
    if not user_id:
        return None
    return find_user_by_id(user_id)


def update_user_profile(user_id, data):
    users = load_list(USERS_FILE)
    updated = None
    for i, user in enumerate(users):
        if user.get("id") != user_id:
            continue
        user = {**user}
        for key in ("nome", "telefone", "localizacao", "cpfCnpj", "tipoConta"):
            if key in data and data[key] is not None:
                user[key] = str(data[key]).strip()
        if "email" in data and data["email"]:
            novo_email = str(data["email"]).strip().lower()
            existente = find_user_by_email(novo_email)
            if existente and existente["id"] != user_id:
                raise ValueError("Este email já está em uso.")
            user["email"] = novo_email
        users[i] = user
        updated = user
        break

    if not updated:
        raise ValueError("Usuário não encontrado.")

    save_list(USERS_FILE, users)
    return _perfil_publico(updated)
