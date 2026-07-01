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

