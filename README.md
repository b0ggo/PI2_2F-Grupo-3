# PI2_2F — Grupo 3 (AgroGestor)

**Integrantes:** Lara Letícia Appel, João Batista Bach Cerutti, Tiago Wilhelm Golunski, João Vitor Braatz, Carina Vitória Gugel Müller, Vinicius Pecini Giordani

Sistema de gestão rural com **React + Flask + PostgreSQL**.

---

## Rodar com Docker (desenvolvimento)

**Pré-requisito:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

Na **raiz do projeto**:

```bash
docker compose up --build
```

Aguarde até ver nos logs:
- `Postgres is ready`
- `Starting Flask dev server...`
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

## Deploy em produção (VPS Linux — Locaweb)

### Arquitetura

```
Internet → Nginx (porta 80) → arquivos estáticos do React
                            → /api/* → Gunicorn (Flask) → PostgreSQL
```

O frontend usa caminhos relativos (`/api/...`). O Nginx faz proxy para o backend no mesmo domínio, sem depender de `localhost`.

### Pré-requisitos na VPS

- Docker e Docker Compose instalados
- Porta 80 liberada no firewall
- Domínio apontando para o IP da VPS (opcional, mas recomendado)

### Passo a passo

1. **Clone o repositório na VPS**

```bash
git clone <url-do-repositorio>
cd PI2_2F-Grupo-3
```

2. **Crie o arquivo de ambiente**

```bash
cp .env.example .env
nano .env
```

Ajuste obrigatoriamente:

| Variável | O que definir |
|----------|---------------|
| `POSTGRES_PASSWORD` | Senha forte para o banco |
| `SECRET_KEY` | Chave aleatória com 32+ caracteres |
| `CORS_ORIGINS` | URL(s) do seu domínio (ex.: `https://meusite.com.br`) |
| `DATABASE_URL` | Use a mesma senha definida em `POSTGRES_PASSWORD` |

Gerar `SECRET_KEY`:

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

3. **Suba em produção**

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

4. **Verifique**

```bash
docker compose -f docker-compose.prod.yml ps
curl http://localhost/api/health
```

Acesse `http://SEU_IP_OU_DOMINIO` no navegador.

### HTTPS (recomendado)

Para TLS na Locaweb, use Certbot no host ou um proxy reverso externo apontando para a porta 80 do container. Após obter o certificado, inclua a URL `https://...` em `CORS_ORIGINS` no `.env` e reinicie:

```bash
docker compose -f docker-compose.prod.yml up -d --force-recreate backend
```

### Diferenças dev vs produção

| Item | Desenvolvimento | Produção |
|------|-----------------|----------|
| Compose | `docker-compose.yml` | `docker-compose.prod.yml` |
| Backend | Flask dev server | Gunicorn |
| Frontend | Vite dev server (5173) | Build estático + Nginx (80) |
| PostgreSQL | Porta 5432 exposta | Apenas rede interna Docker |
| `FLASK_DEBUG` | `1` (local) / `0` (compose) | `0` |
| `SECRET_KEY` | Chave de dev | Obrigatória e segura |

---

