# AgroGestor API (Flask + PostgreSQL)

Backend com persistência em **PostgreSQL** via SQLAlchemy.

## Pré-requisitos

- Python 3.11+
- PostgreSQL 16+ (local ou via Docker)

## Opção 1 — Docker (recomendado)

Na raiz do projeto:

```bash
docker compose up -d
```

Isso sobe:
- **PostgreSQL** em `localhost:5432`
- **API Flask** em `http://localhost:5000`

## Opção 2 — Desenvolvimento local

### 1. Subir o PostgreSQL

```bash
docker compose up -d db
```

### 2. Configurar variáveis de ambiente

```bash
cd backend
copy .env.example .env   # Windows
# cp .env.example .env   # Linux/macOS
```

### 3. Instalar dependências e rodar

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python init_db.py        # cria as tabelas
python app.py
```

A API sobe em `http://localhost:5000`.

## Frontend

No diretório `vite-project`:

```bash
copy .env.example .env
npm install
npm run dev
```

O frontend conecta à API via `VITE_API_URL=http://localhost:5000`.

## Migrar dados JSON antigos

Se você tinha dados em `backend/data/*.json`:

```bash
python migrate_json.py
```

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Status da API e conexão com o banco |
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET/PUT | `/api/perfil` | Perfil do usuário |
| POST/GET | `/api/animais` | Animais |
| POST/GET | `/api/lotes` | Lotes |
| POST/GET | `/api/vacinacoes` | Vacinações |
| GET | `/api/alertas` | Alertas de vacinas |
| GET | `/api/stats` | Estatísticas |
| GET | `/api/busca?q=` | Busca global |
| GET | `/api/conversas` | Chat |

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `DATABASE_URL` | `postgresql+psycopg2://agrogestor:agrogestor@localhost:5432/agrogestor` | Conexão PostgreSQL |
| `SECRET_KEY` | `agrogestor-dev-key` | Chave da aplicação |
| `CORS_ORIGINS` | `http://localhost:5173` | Origens permitidas (frontend) |

## Estrutura do banco

Tabelas: `users`, `auth_tokens`, `animais`, `lotes`, `vacinacoes`, `conversas`, `mensagens`.

Schema SQL em `db/init_schema.sql`.
