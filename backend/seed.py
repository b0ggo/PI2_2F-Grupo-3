from config import CONVERSAS_FILE, MENSAGENS_FILE
from storage.json_store import load_list, new_id, save_list


def seed_chat_for_user(user_id):
    conversas = load_list(CONVERSAS_FILE)
    if any(c.get("userId") == user_id for c in conversas):
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
