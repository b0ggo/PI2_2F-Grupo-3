import uuid
from datetime import date, datetime


def new_id():
    return str(uuid.uuid4())


def calcular_idade_meses(data_nasc):
    """Calcula idade em meses a partir de data ISO (YYYY-MM-DD)."""
    if not data_nasc:
        return None
    try:
        nasc = datetime.strptime(str(data_nasc)[:10], "%Y-%m-%d").date()
    except ValueError:
        return None
    hoje = date.today()
    meses = (hoje.year - nasc.year) * 12 + (hoje.month - nasc.month)
    if hoje.day < nasc.day:
        meses -= 1
    return str(max(0, meses)) if meses >= 0 else None


def normalizar_sexo(sexo):
    if not sexo:
        return None
    s = str(sexo).strip().lower()
    if s in ("macho", "m", "masculino"):
        return "macho"
    if s in ("femea", "fêmea", "f", "feminino"):
        return "femea"
    return s
