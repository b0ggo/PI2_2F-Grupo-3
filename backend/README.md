# AgroGestor API (Flask)

Backend provisório com persistência em arquivos JSON (sem banco de dados).

## Como rodar

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

A API sobe em `http://localhost:5000`.

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Status da API |
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

Os dados ficam em `backend/data/*.json` (ignorados pelo git).
