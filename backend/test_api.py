import time
import uuid
import requests

BASE = "http://127.0.0.1:5000"


def pretty(r):
    try:
        return r.status_code, r.json()
    except Exception:
        return r.status_code, r.text


def main():
    suffix = uuid.uuid4().hex[:6]
    coop_email = f"testcoop_{suffix}@example.com"
    coop_pwd = "pass123"

    # Register cooperativa
    r = requests.post(f"{BASE}/api/auth/register", json={
        "email": coop_email,
        "senha": coop_pwd,
        "nome": "Test Coop",
        "tipoConta": "Cooperativa",
    })
    print("register coop:", pretty(r))
    if r.status_code != 201:
        print("Failed to register cooperativa")
        return
    coop_token = r.json()["token"]

    headers_coop = {"Authorization": f"Bearer {coop_token}"}

    # Create producer via cooperativa
    prod_email = f"producer_{suffix}@example.com"
    prod_pwd = "prodpass"
    r = requests.post(f"{BASE}/api/cooperativa/produtores", json={
        "email": prod_email,
        "senha": prod_pwd,
        "nome": "Produtor Teste",
    }, headers=headers_coop)
    print("create producer:", pretty(r))
    if r.status_code != 201:
        print("Failed to create producer")
        return

    # Login as producer
    r = requests.post(f"{BASE}/api/auth/login", json={
        "email": prod_email,
        "senha": prod_pwd,
    })
    print("login producer:", pretty(r))
    if r.status_code != 200:
        print("Failed to login producer")
        return
    prod_token = r.json()["token"]
    headers_prod = {"Authorization": f"Bearer {prod_token}"}

    # Create lote as producer
    r = requests.post(f"{BASE}/api/lotes", json={
        "nome": "Lote A",
        "quantidade": 10,
        "tipo": "Bovino",
    }, headers=headers_prod)
    print("create lote:", pretty(r))
    if r.status_code != 201:
        print("Failed to create lote")
        return

    # Cooperativa lists producers
    r = requests.get(f"{BASE}/api/cooperativa/produtores", headers=headers_coop)
    print("coop list producers:", pretty(r))

    # Cooperativa lists lotes
    r = requests.get(f"{BASE}/api/lotes", headers=headers_coop)
    print("coop list lotes:", pretty(r))


if __name__ == "__main__":
    print("Waiting for server to start...")
    time.sleep(2)
    main()
