-- Schema inicial do AgroGestor (PostgreSQL)
-- As tabelas também são criadas automaticamente pelo SQLAlchemy na inicialização.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR(36) PRIMARY KEY,
    nome            VARCHAR(255) NOT NULL DEFAULT '',
    email           VARCHAR(255) NOT NULL UNIQUE,
    telefone        VARCHAR(50) NOT NULL DEFAULT '',
    localizacao     VARCHAR(255) NOT NULL DEFAULT '',
    cpf_cnpj        VARCHAR(30) NOT NULL DEFAULT '',
    tipo_conta      VARCHAR(50) NOT NULL DEFAULT '',
    foto_perfil     TEXT NOT NULL DEFAULT '',
    senha_hash      TEXT NOT NULL,
    cooperativa_id  VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cooperativa ON users(cooperativa_id);

CREATE TABLE IF NOT EXISTS auth_tokens (
    token       VARCHAR(36) PRIMARY KEY,
    user_id     VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_user ON auth_tokens(user_id);

CREATE TABLE IF NOT EXISTS animais (
    id                    VARCHAR(36) PRIMARY KEY,
    user_id               VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo                  VARCHAR(100) NOT NULL DEFAULT '',
    identificacao         VARCHAR(100) NOT NULL,
    raca                  VARCHAR(100) NOT NULL DEFAULT '',
    idade                 VARCHAR(20),
    peso                  VARCHAR(20),
    sexo                  VARCHAR(20),
    data_nasc             VARCHAR(20),
    status                VARCHAR(50) NOT NULL DEFAULT 'saudavel',
    vacinas               JSONB NOT NULL DEFAULT '[]',
    historico             TEXT NOT NULL DEFAULT '',
    produtividade_leite   VARCHAR(100),
    registrado_em         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_animais_user ON animais(user_id);

CREATE TABLE IF NOT EXISTS lotes (
    id            VARCHAR(36) PRIMARY KEY,
    user_id       VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo          VARCHAR(100) NOT NULL DEFAULT '',
    nome          VARCHAR(255) NOT NULL,
    quantidade    INTEGER NOT NULL DEFAULT 0,
    doentes       INTEGER NOT NULL DEFAULT 0,
    vacinados     INTEGER NOT NULL DEFAULT 0,
    mortes        INTEGER NOT NULL DEFAULT 0,
    observacoes   TEXT NOT NULL DEFAULT '',
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lotes_user ON lotes(user_id);

CREATE TABLE IF NOT EXISTS vacinacoes (
    id               VARCHAR(36) PRIMARY KEY,
    user_id          VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alvo_tipo        VARCHAR(20) NOT NULL DEFAULT 'animal',
    alvo_id          VARCHAR(36) NOT NULL DEFAULT '',
    alvo_label       VARCHAR(255) NOT NULL,
    tipo_vacina      VARCHAR(255) NOT NULL,
    data_aplicacao   VARCHAR(20),
    proxima_dose     VARCHAR(20),
    observacoes      TEXT NOT NULL DEFAULT '',
    created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vacinacoes_user ON vacinacoes(user_id);

CREATE TABLE IF NOT EXISTS conversas (
    id           VARCHAR(36) PRIMARY KEY,
    user_id      VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner_id   VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    name         VARCHAR(255) NOT NULL,
    type         VARCHAR(50) NOT NULL DEFAULT '',
    last_msg     TEXT NOT NULL DEFAULT '',
    time_label   VARCHAR(30) NOT NULL DEFAULT '',
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, partner_id)
);

CREATE INDEX IF NOT EXISTS idx_conversas_user ON conversas(user_id);

CREATE TABLE IF NOT EXISTS mensagens (
    id           VARCHAR(36) PRIMARY KEY,
    conversa_id  VARCHAR(36) NOT NULL REFERENCES conversas(id) ON DELETE CASCADE,
    sender_side  VARCHAR(10) NOT NULL,
    text         TEXT NOT NULL,
    time_label   VARCHAR(30) NOT NULL DEFAULT '',
    status       VARCHAR(20),
    lida         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mensagens_conversa ON mensagens(conversa_id);
