# PI2_2F — Grupo 3 (AgroGestor)

**Integrantes:** Lara Letícia Appel, João Batista Bach Cerutti, Tiago Wilhelm Golunski, João Vitor Braatz, Carina Vitória Gugel Müller, Vinicius Pecini Giordani

Sistema de gestão rural com **React + Flask + PostgreSQL**.

---

## Rodar com Docker (recomendado para todo o grupo)

**Pré-requisito:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

Na **raiz do projeto**:

```bash
docker compose up --build
```

Aguarde até ver nos logs:
- `Postgres is ready`
- `Starting Flask app...`
- `VITE v... ready` (frontend)

Acesse:
| Serviço    | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost:5173      |
| API        | http://localhost:5000      |
| Health API | http://localhost:5000/api/health |

Para rodar em segundo plano:

```bash
docker compose up --build -d
```

Parar tudo:

```bash
docker compose down
```

Apagar dados do banco (reset completo):

```bash
docker compose down -v
```

---

## Desenvolvimento local (sem Docker completo)

### 1. Banco de dados

```bash
docker compose up -d db
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate         # Windows
pip install -r requirements.txt
python init_db.py
python app.py
```

### 3. Frontend

```bash
cd vite-project
npm install
npm run dev
```

O frontend usa proxy para `http://localhost:5000` (configurado em `vite.config.js`).

---

## Testar a API manualmente

```bash
curl http://localhost:5000/api/health

# Cadastro
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"teste@exemplo.com\",\"senha\":\"123456\",\"nome\":\"Teste\",\"tipoConta\":\"Produtor\"}"
```

---

## Estrutura

```
PI2_2F-Grupo-3/
├── docker-compose.yml    # Orquestra db + backend + frontend
├── backend/              # API Flask + PostgreSQL
└── vite-project/         # Frontend React (Vite)
```

## Variáveis de ambiente

| Arquivo | Variável | Descrição |
|---------|----------|-----------|
| `backend/.env` | `DATABASE_URL` | Conexão PostgreSQL |
| `backend/.env` | `CORS_ORIGINS` | Origens permitidas |
| `vite-project/.env` | `VITE_API_URL` | URL da API (vazio = usa proxy) |
| Docker frontend | `VITE_PROXY_TARGET` | Proxy interno (`http://backend:5000`) |
