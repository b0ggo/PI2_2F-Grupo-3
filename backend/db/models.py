from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import db
from utils import new_id


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    nome: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    telefone: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    localizacao: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    cpf_cnpj: Mapped[str] = mapped_column(String(30), nullable=False, default="")
    tipo_conta: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    senha_hash: Mapped[str] = mapped_column(Text, nullable=False)
    cooperativa_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self, private=False):
        data = {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "telefone": self.telefone,
            "localizacao": self.localizacao,
            "cpfCnpj": self.cpf_cnpj,
            "tipoConta": self.tipo_conta,
        }
        if private:
            data["senhaHash"] = self.senha_hash
            if self.cooperativa_id:
                data["cooperativaId"] = self.cooperativa_id
        return data


class AuthToken(db.Model):
    __tablename__ = "auth_tokens"

    token: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Animal(db.Model):
    __tablename__ = "animais"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    tipo: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    identificacao: Mapped[str] = mapped_column(String(100), nullable=False)
    raca: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    idade: Mapped[str | None] = mapped_column(String(20))
    peso: Mapped[str | None] = mapped_column(String(20))
    sexo: Mapped[str | None] = mapped_column(String(20))
    data_nasc: Mapped[str | None] = mapped_column(String(20))
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="saudavel")
    vacinas: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    historico: Mapped[str] = mapped_column(Text, nullable=False, default="")
    produtividade_leite: Mapped[str | None] = mapped_column(String(100))
    registrado_em: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "tipo": self.tipo,
            "identificacao": self.identificacao,
            "raca": self.raca,
            "idade": self.idade,
            "peso": self.peso,
            "sexo": self.sexo,
            "dataNasc": self.data_nasc,
            "status": self.status,
            "vacinas": self.vacinas or [],
            "historico": self.historico,
            "produtividadeLeite": self.produtividade_leite,
            "timestamp": self.registrado_em.isoformat() if self.registrado_em else "",
        }


class Lote(db.Model):
    __tablename__ = "lotes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    tipo: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    nome: Mapped[str] = mapped_column(String(255), nullable=False)
    quantidade: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    doentes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    vacinados: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    mortes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    observacoes: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "tipo": self.tipo,
            "nome": self.nome,
            "quantidade": self.quantidade,
            "doentes": self.doentes,
            "vacinados": self.vacinados,
            "mortes": self.mortes,
            "observacoes": self.observacoes,
            "total": self.quantidade,
            "saudaveis": max(0, self.quantidade - self.doentes - self.mortes),
        }


class Vacinacao(db.Model):
    __tablename__ = "vacinacoes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    alvo_tipo: Mapped[str] = mapped_column(String(20), nullable=False, default="animal")
    alvo_id: Mapped[str] = mapped_column(String(36), nullable=False, default="")
    alvo_label: Mapped[str] = mapped_column(String(255), nullable=False)
    tipo_vacina: Mapped[str] = mapped_column(String(255), nullable=False)
    data_aplicacao: Mapped[str | None] = mapped_column(String(20))
    proxima_dose: Mapped[str | None] = mapped_column(String(20))
    observacoes: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "alvoTipo": self.alvo_tipo,
            "alvoId": self.alvo_id,
            "alvoLabel": self.alvo_label,
            "tipoVacina": self.tipo_vacina,
            "dataAplicacao": self.data_aplicacao or "",
            "proximaDose": self.proxima_dose or "",
            "observacoes": self.observacoes,
        }


class Conversa(db.Model):
    __tablename__ = "conversas"
    __table_args__ = (
        UniqueConstraint("user_id", "partner_id", name="uq_conversas_user_partner"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    partner_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    last_msg: Mapped[str] = mapped_column(Text, nullable=False, default="")
    time_label: Mapped[str] = mapped_column(String(30), nullable=False, default="")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    mensagens: Mapped[list["Mensagem"]] = relationship(
        "Mensagem", back_populates="conversa", cascade="all, delete-orphan"
    )

    def to_dict(self, include_messages=False, unread=0):
        data = {
            "id": self.id,
            "userId": self.user_id,
            "name": self.name,
            "type": self.type,
            "lastMsg": self.last_msg,
            "time": self.time_label,
            "unread": unread,
        }
        if self.partner_id:
            data["partnerId"] = self.partner_id
        if include_messages:
            data["messages"] = [m.to_dict() for m in self.mensagens]
        return data


class Mensagem(db.Model):
    __tablename__ = "mensagens"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    conversa_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("conversas.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sender_side: Mapped[str] = mapped_column(String(10), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    time_label: Mapped[str] = mapped_column(String(30), nullable=False, default="")
    status: Mapped[str | None] = mapped_column(String(20))
    lida: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    conversa: Mapped["Conversa"] = relationship("Conversa", back_populates="mensagens")

    def to_dict(self):
        data = {
            "id": self.id,
            "conversaId": self.conversa_id,
            "from": self.sender_side,
            "text": self.text,
            "time": self.time_label,
        }
        if self.status:
            data["status"] = self.status
        if self.lida:
            data["lida"] = self.lida
        return data
