"""Importa dados legados de backend/data/*.json para PostgreSQL."""
import json
from pathlib import Path

from app import create_app
from config import DATA_DIR
from db.database import db
from db.models import (
    Animal,
    AuthToken,
    Conversa,
    Lote,
    Mensagem,
    User,
    Vacinacao,
)
from utils import new_id


def _load_list(path):
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []


def _load_tokens(path):
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except (json.JSONDecodeError, OSError):
        return {}


def migrate():
    app = create_app()
    with app.app_context():
        if User.query.first():
            print("Banco já contém dados. Migração abortada.")
            return

        users = _load_list(DATA_DIR / "users.json")
        for u in users:
            db.session.add(
                User(
                    id=u.get("id") or new_id(),
                    nome=u.get("nome", ""),
                    email=u.get("email", "").lower(),
                    telefone=u.get("telefone", ""),
                    localizacao=u.get("localizacao", ""),
                    cpf_cnpj=u.get("cpfCnpj", ""),
                    tipo_conta=u.get("tipoConta", ""),
                    senha_hash=u.get("senhaHash", ""),
                    cooperativa_id=u.get("cooperativaId"),
                )
            )
        db.session.commit()
        print(f"  {len(users)} usuários importados")

        for a in _load_list(DATA_DIR / "animais.json"):
            db.session.add(
                Animal(
                    id=a.get("id") or new_id(),
                    user_id=a["userId"],
                    tipo=a.get("tipo", ""),
                    identificacao=a.get("identificacao", ""),
                    raca=a.get("raca", ""),
                    idade=a.get("idade"),
                    peso=a.get("peso"),
                    sexo=a.get("sexo"),
                    data_nasc=a.get("dataNasc"),
                    status=a.get("status", "saudavel"),
                    vacinas=a.get("vacinas") or [],
                    historico=a.get("historico", ""),
                    produtividade_leite=a.get("produtividadeLeite"),
                )
            )
        db.session.commit()
        print(f"  animais importados")

        for l in _load_list(DATA_DIR / "lotes.json"):
            db.session.add(
                Lote(
                    id=l.get("id") or new_id(),
                    user_id=l["userId"],
                    tipo=l.get("tipo", ""),
                    nome=l.get("nome", ""),
                    quantidade=int(l.get("quantidade", 0)),
                    doentes=int(l.get("doentes", 0)),
                    vacinados=int(l.get("vacinados", 0)),
                    mortes=int(l.get("mortes", 0)),
                    observacoes=l.get("observacoes", ""),
                )
            )
        db.session.commit()
        print(f"  lotes importados")

        for v in _load_list(DATA_DIR / "vacinacoes.json"):
            db.session.add(
                Vacinacao(
                    id=v.get("id") or new_id(),
                    user_id=v["userId"],
                    alvo_tipo=v.get("alvoTipo", "animal"),
                    alvo_id=str(v.get("alvoId", "")),
                    alvo_label=v.get("alvoLabel", ""),
                    tipo_vacina=v.get("tipoVacina", ""),
                    data_aplicacao=v.get("dataAplicacao") or None,
                    proxima_dose=v.get("proximaDose") or None,
                    observacoes=v.get("observacoes", ""),
                )
            )
        db.session.commit()
        print(f"  vacinações importadas")

        for c in _load_list(DATA_DIR / "conversas.json"):
            db.session.add(
                Conversa(
                    id=c.get("id") or new_id(),
                    user_id=c["userId"],
                    partner_id=c.get("partnerId"),
                    name=c.get("name", ""),
                    type=c.get("type", ""),
                    last_msg=c.get("lastMsg", ""),
                    time_label=c.get("time", ""),
                )
            )
        db.session.commit()
        print(f"  conversas importadas")

        for m in _load_list(DATA_DIR / "mensagens.json"):
            db.session.add(
                Mensagem(
                    id=m.get("id") or new_id(),
                    conversa_id=m["conversaId"],
                    sender_side=m.get("from", "them"),
                    text=m.get("text", ""),
                    time_label=m.get("time", ""),
                    status=m.get("status"),
                    lida=bool(m.get("lida")),
                )
            )
        db.session.commit()
        print(f"  mensagens importadas")

        tokens = _load_tokens(DATA_DIR / "tokens.json")
        for token, user_id in tokens.items():
            db.session.add(AuthToken(token=token, user_id=user_id))
        db.session.commit()
        print(f"  {len(tokens)} tokens importados")

        print("Migração concluída.")


if __name__ == "__main__":
    migrate()
