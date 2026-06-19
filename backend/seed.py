from datetime import datetime

from db.database import db
from db.models import Conversa, Mensagem
from services.auth_service import find_producers_for_cooperative, find_user_by_id
from utils import new_id


def _find_conversation(user_id, partner_id):
    return Conversa.query.filter_by(user_id=user_id, partner_id=partner_id).first()


def _create_coop_prod_conversations(cooperativa, produtor):
    coop_id = cooperativa["id"] if isinstance(cooperativa, dict) else cooperativa.id
    prod_id = produtor["id"] if isinstance(produtor, dict) else produtor.id
    coop_nome = cooperativa.get("nome", "Cooperativa") if isinstance(cooperativa, dict) else cooperativa.nome
    prod_nome = (
        produtor.get("nome", produtor.get("email", "Produtor"))
        if isinstance(produtor, dict)
        else (produtor.nome or produtor.email or "Produtor")
    )

    agora = datetime.now().strftime("%H:%M")
    prod_conv = _find_conversation(prod_id, coop_id)
    coop_conv = _find_conversation(coop_id, prod_id)

    if not prod_conv:
        prod_conv = Conversa(
            id=new_id(),
            user_id=prod_id,
            partner_id=coop_id,
            name=coop_nome,
            type="Cooperativa",
            last_msg="Conversa iniciada com a cooperativa.",
            time_label=agora,
        )
        db.session.add(prod_conv)

    if not coop_conv:
        coop_conv = Conversa(
            id=new_id(),
            user_id=coop_id,
            partner_id=prod_id,
            name=prod_nome,
            type="Produtor",
            last_msg="Conversa iniciada com o produtor.",
            time_label=agora,
        )
        db.session.add(coop_conv)

    db.session.commit()
    return prod_conv, coop_conv


def _seed_chat_for_cooperativa(cooperativa):
    coop_id = cooperativa["id"] if isinstance(cooperativa, dict) else cooperativa.id
    for producer_id in find_producers_for_cooperative(coop_id):
        produtor = find_user_by_id(producer_id)
        if produtor:
            _create_coop_prod_conversations(cooperativa, produtor)


def seed_chat_for_user(user_id, user=None):
    if Conversa.query.filter_by(user_id=user_id).first():
        return

    if user and user.get("tipoConta") == "Produtor" and user.get("cooperativaId"):
        cooperativa = find_user_by_id(user.get("cooperativaId"))
        if cooperativa:
            _create_coop_prod_conversations(cooperativa, user)
            return

    if user and str(user.get("tipoConta", "")).strip().lower() != "produtor":
        _seed_chat_for_cooperativa(user)
        if Conversa.query.filter_by(user_id=user_id).first():
            return

    demos = [
        {
            "name": "Cooperativa AgroBrasil",
            "type": "Cooperativa",
            "lastMsg": "Desconto de 15% em insumos agrícolas selecionados!",
            "time": "10:30",
            "messages": [
                {"from": "them", "text": "Olá! Temos uma oferta especial para você esta semana.", "time": "10:28"},
                {"from": "them", "text": "Desconto de 15% em insumos agrícolas selecionados!", "time": "10:30"},
            ],
        },
        {
            "name": "VetCare Clínica",
            "type": "Veterinária",
            "lastMsg": "Obrigado pelo contato!",
            "time": "Ontem",
            "messages": [
                {"from": "me", "text": "Boa tarde! Gostaria de agendar uma visita técnica.", "time": "14:00", "status": "read"},
                {"from": "them", "text": "Obrigado pelo contato! Podemos agendar para quinta-feira às 9h.", "time": "14:05"},
            ],
        },
        {
            "name": "Rações Premium",
            "type": "Fornecedor",
            "lastMsg": "Seu pedido foi processado",
            "time": "15/03",
            "messages": [
                {"from": "me", "text": "Quero fazer um pedido de 500kg de ração.", "time": "09:00", "status": "read"},
                {"from": "them", "text": "Seu pedido foi processado e será entregue em 3 dias úteis.", "time": "09:15"},
            ],
        },
    ]

    for demo in demos:
        conv_id = new_id()
        conversa = Conversa(
            id=conv_id,
            user_id=user_id,
            name=demo["name"],
            type=demo["type"],
            last_msg=demo["lastMsg"],
            time_label=demo["time"],
        )
        db.session.add(conversa)
        for msg in demo["messages"]:
            db.session.add(
                Mensagem(
                    id=new_id(),
                    conversa_id=conv_id,
                    sender_side=msg["from"],
                    text=msg["text"],
                    time_label=msg["time"],
                    status=msg.get("status"),
                    lida=msg.get("from") == "me",
                )
            )

    db.session.commit()
