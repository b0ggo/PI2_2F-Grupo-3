from datetime import datetime

from config import CONVERSAS_FILE, MENSAGENS_FILE
from services.auth_service import find_producers_for_cooperative, find_user_by_id
from storage.json_store import load_list, new_id, save_list


def _conversation_exists(conversas, user_id, partner_id):
    return any(
        c.get("userId") == user_id and c.get("partnerId") == partner_id
        for c in conversas
    )


def _find_conversation(conversas, user_id, partner_id):
    return next(
        (
            c
            for c in conversas
            if c.get("userId") == user_id and c.get("partnerId") == partner_id
        ),
        None,
    )


def _create_coop_prod_conversations(cooperativa, produtor):
    conversas = load_list(CONVERSAS_FILE)
    mensagens = load_list(MENSAGENS_FILE)

    coop_conv = _find_conversation(conversas, cooperativa["id"], produtor["id"])
    prod_conv = _find_conversation(conversas, produtor["id"], cooperativa["id"])

    if not prod_conv:
        prod_conv = {
            "id": new_id(),
            "userId": produtor["id"],
            "partnerId": cooperativa["id"],
            "name": cooperativa.get("nome", "Cooperativa"),
            "type": "Cooperativa",
            "lastMsg": "Conversa iniciada com a cooperativa.",
            "time": datetime.now().strftime("%H:%M"),
        }
        conversas.append(prod_conv)

    if not coop_conv:
        coop_conv = {
            "id": new_id(),
            "userId": cooperativa["id"],
            "partnerId": produtor["id"],
            "name": produtor.get("nome", produtor.get("email", "Produtor")),
            "type": "Produtor",
            "lastMsg": "Conversa iniciada com o produtor.",
            "time": datetime.now().strftime("%H:%M"),
        }
        conversas.append(coop_conv)

    save_list(CONVERSAS_FILE, conversas)
    save_list(MENSAGENS_FILE, mensagens)

    return prod_conv, coop_conv


def _seed_chat_for_cooperativa(cooperativa):
    producer_ids = find_producers_for_cooperative(cooperativa["id"])
    for producer_id in producer_ids:
        produtor = find_user_by_id(producer_id)
        if produtor:
            _create_coop_prod_conversations(cooperativa, produtor)


def seed_chat_for_user(user_id, user=None):
    conversas = load_list(CONVERSAS_FILE)
    if any(c.get("userId") == user_id for c in conversas):
        return

    if user and user.get("tipoConta") == "Produtor" and user.get("cooperativaId"):
        cooperativa = find_user_by_id(user.get("cooperativaId"))
        if cooperativa:
            _create_coop_prod_conversations(cooperativa, user)
            return

    if user and user.get("tipoConta") == "Cooperativa":
        _seed_chat_for_cooperativa(user)
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

    mensagens = load_list(MENSAGENS_FILE)
    for demo in demos:
        conv_id = new_id()
        conversas.append({
            "id": conv_id,
            "userId": user_id,
            "name": demo["name"],
            "type": demo["type"],
            "lastMsg": demo["lastMsg"],
            "time": demo["time"],
        })
        for msg in demo["messages"]:
            mensagens.append({
                "id": new_id(),
                "conversaId": conv_id,
                **msg,
            })

    save_list(CONVERSAS_FILE, conversas)
    save_list(MENSAGENS_FILE, mensagens)
