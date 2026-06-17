import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import headerUi from "../../components/Header/Header.module.css";
import { ROUTES } from "../../constants/routes.js";
import { enviarMensagem, getConversas, addProducerChatPartner } from "../../services/api.js";
import { getPerfil, resolveUserMode } from "../../services/perfil.js";
import "./ChatEmpresas.css";

function Icon({ d, size = 22, color = "currentColor", strokeWidth = 2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  send: "M22 2L11 13 M22 2L15 22l-4-9-9-4z",
  connect: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
};

const STATUS_LABEL = {
  sending: "Enviando…",
  sent: "Enviada",
  delivered: "Entregue",
  read: "Lida",
};

function nowTime() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function patchMessageStatus(messages, msgId, status) {
  return messages.map((m) => (m.id === msgId ? { ...m, status } : m));
}

export function ConversationView({ conversation, onBack, onUpdate }) {
  const [messages, setMessages] = useState(conversation.messages || []);
  const [input, setInput] = useState("");
  const [remoteTyping, setRemoteTyping] = useState(false);
  const bottomRef = useRef(null);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, remoteTyping]);

  const pushMessages = (updater) => {
    setMessages((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      onUpdate(conversation.id, next);
      return next;
    });
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const msgId = Date.now();
    const newMsg = {
      id: msgId,
      from: "me",
      text,
      time: nowTime(),
      status: "sending",
    };

    pushMessages((prev) => [...prev, newMsg]);
    setInput("");
    setRemoteTyping(false);

    try {
      const salva = await enviarMensagem(conversation.id, text);
      pushMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...salva, status: "sent" } : m)),
      );
    } catch {
      pushMessages((prev) => patchMessageStatus(prev, msgId, "sent"));
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="conv-page">
      <Header
        sticky
        onVoltar={onBack}
        navMiddle={
          <>
            <div className={headerUi.convAvatar}>
              <Icon d={ICONS.chat} size={18} color="#fff" />
            </div>
            <div className={headerUi.convMeta}>
              <div className={headerUi.convName}>{conversation.name}</div>
              <div className={headerUi.convType}>{conversation.type}</div>
            </div>
          </>
        }
      />

      <div className="conv-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg-row ${msg.from}`}>
            <div className={`msg-bubble ${msg.from}`}>
              <p className="msg-bubble__text">{msg.text}</p>
              <span className="msg-bubble__time">{msg.time}</span>
              {msg.from === "me" && msg.status && (
                <span
                  className="msg-bubble__status"
                  style={{
                    fontSize: 10,
                    opacity: 0.88,
                    display: "block",
                    textAlign: "right",
                    marginTop: 4,
                    fontWeight: 600,
                  }}
                >
                  {STATUS_LABEL[msg.status] ?? msg.status}
                </span>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="conv-input-bar">
        <textarea
          rows={1}
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          type="button"
          className="conv-send-btn"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Enviar"
        >
          <Icon d={ICONS.send} size={17} color="#fff" />
        </button>
      </div>
    </div>
  );
}

export default function ChatEmpresas() {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [openConv, setOpenConv] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modo, setModo] = useState("produtor");
  const [autoOpened, setAutoOpened] = useState(false);
  const [tabAtivo, setTabAtivo] = useState("empresas"); // "empresas" ou "profissionais"
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCloseConversation = () => {
    setOpenConv(null);
    setAutoOpened(true);
    navigate(location.pathname, { replace: true, state: {} });
  };

  useEffect(() => {
    getPerfil()
      .then((perfil) => {
        const resolved = resolveUserMode(perfil);
        setModo(resolved);
        if (resolved === "cooperativa") {
          navigate(ROUTES.COOPERATIVA_CHAT, { replace: true });
        }
      })
      .catch(() => setModo("produtor"));
  }, [navigate]);

  useEffect(() => {
    getConversas()
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setCarregando(false));
  }, []);

  const empresasConversations = conversations.filter((c) =>
    String(c.type || "").toLowerCase().includes("cooperativa") || String(c.type || "").toLowerCase().includes("empresa"),
  );

  const profissionaisConversations = conversations.filter(
    (conv) => {
      const type = String(conv.type || "").toLowerCase();
      return type === "veterinária" || type === "veterinario" || type === "fornecedor";
    }
  );

  const filteredEmpresas = empresasConversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredProfissionais = profissionaisConversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpen = (conv) => {
    setConversations((cs) => {
      const updated = cs.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c));
      const current = updated.find((c) => c.id === conv.id);
      if (!current) return updated;
      return [current, ...updated.filter((c) => c.id !== conv.id)];
    });
    setOpenConv({ ...conv, unread: 0 });
  };

  useEffect(() => {
    if (autoOpened || (!location.state?.conversationId && !location.state?.partnerId)) return;

    const state = location.state;
    const conv = conversations.find((c) => c.id === state.conversationId)
      || conversations.find((c) => c.partnerId === state.partnerId);

    if (conv) {
      handleOpen(conv);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, conversations, navigate, location.pathname, autoOpened]);

  const handleUpdate = (id, msgs) => {
    const last = msgs[msgs.length - 1];
    const lastMsg = last?.text ?? "";
    const nowTime = () => {
      const d = new Date();
      return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    setConversations((cs) =>
      cs.map((c) =>
        c.id === id ? { ...c, messages: msgs, lastMsg, time: nowTime() } : c,
      ),
    );
    setOpenConv((prev) =>
      prev?.id === id
        ? { ...prev, messages: msgs, lastMsg, time: nowTime() }
        : prev,
    );
  };

  const handleAbrirModal = () => {
    setShowModal(true);
  };

  const handleFecharModal = () => {
    setShowModal(false);
    setEmail("");
    setError("");
    setLoading(false);
  };

  const handleAdicionar = async () => {
    if (!email.trim()) {
      setError("Informe o email do profissional.");
      return;
    }
    setLoading(true);
    try {
      const result = await addProducerChatPartner({ email: email.trim() });
      setLoading(false);
      if (result?.conversationId) {
        const nowTime = () => {
          const d = new Date();
          return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
        };
        const newConv = {
          id: result.conversationId,
          partnerId: result.partnerId,
          name: result.partner?.nome || result.partner?.email || email.trim(),
          type: result.partner?.tipoConta || "Profissional",
          lastMsg: `Conversa iniciada com ${result.partner?.tipoConta || "profissional"}.`,
          time: nowTime(),
          unread: 0,
          messages: [],
        };
        handleFecharModal();
        setConversations((prev) => [newConv, ...prev]);
        setOpenConv(newConv);
      } else {
        setError("Não foi possível iniciar a conversa.");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Erro ao adicionar profissional.");
    }
  };

  if (openConv) {
    return (
      <ConversationView
        key={openConv.id}
        conversation={openConv}
        onBack={handleCloseConversation}
        onUpdate={handleUpdate}
      />
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-shell">
        <Header titulo="Chat" voltarPara={ROUTES.HOME} navMiddle={
          <div className="app-header-search">
            <Icon d={ICONS.search} size={16} color="#9ca3af" />
            <input
              placeholder={tabAtivo === "empresas" ? "Buscar empresas..." : "Buscar profissionais..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar conversa"
            />
          </div>
        }>
        </Header>

        <div style={{ borderBottom: "1px solid #e5e7eb", display: "flex" }}>
          <button
            onClick={() => { setTabAtivo("empresas"); setSearch(""); }}
            style={{
              flex: 1,
              padding: "16px",
              border: "none",
              background: tabAtivo === "empresas" ? "#fff" : "#f9fafb",
              borderBottom: tabAtivo === "empresas" ? "3px solid #16a34a" : "none",
              color: tabAtivo === "empresas" ? "#111827" : "#6b7280",
              fontWeight: tabAtivo === "empresas" ? "700" : "500",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Empresas
          </button>
          <button
            onClick={() => { setTabAtivo("profissionais"); setSearch(""); }}
            style={{
              flex: 1,
              padding: "16px",
              border: "none",
              background: tabAtivo === "profissionais" ? "#fff" : "#f9fafb",
              borderBottom: tabAtivo === "profissionais" ? "3px solid #16a34a" : "none",
              color: tabAtivo === "profissionais" ? "#111827" : "#6b7280",
              fontWeight: tabAtivo === "profissionais" ? "700" : "500",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Profissionais
          </button>
        </div>

        <div className="chat-list">
          {tabAtivo === "empresas" ? (
            <>
              {carregando && (
                <p style={{ padding: "16px", color: "#6b7280", fontSize: 14 }}>Carregando conversas…</p>
              )}
              {!carregando && filteredEmpresas.length === 0 && (
                <p style={{ padding: "16px", color: "#6b7280", fontSize: 14 }}>Nenhuma conversa com empresas encontrada.</p>
              )}
              {filteredEmpresas.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  className="chat-item"
                  onClick={() => handleOpen(conv)}
                >
                  <div className="chat-item__avatar">
                    <Icon d={ICONS.chat} size={20} color="#16a34a" />
                  </div>

                  <div className="chat-item__content">
                    <div className="chat-item__top">
                      <span className="chat-item__name">{conv.name}</span>
                      <span className="chat-item__time">{conv.time}</span>
                    </div>
                    <div className="chat-item__type">{conv.type}</div>
                    <div className="chat-item__bottom">
                      <span className="chat-item__preview">{conv.lastMsg}</span>
                      {conv.unread > 0 && (
                        <span className="chat-item__badge">{conv.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <>
              <div
                className="chat-item"
                style={{
                  borderRadius: 16,
                  marginTop: 16,
                  marginBottom: 16,
                  marginLeft: 16,
                  marginRight: 16,
                  padding: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  Converse com veterinários e fornecedores
                </span>
                <button
                  type="button"
                  onClick={handleAbrirModal}
                  style={{
                    borderRadius: 12,
                    border: "none",
                    background: "#16a34a",
                    color: "#fff",
                    padding: "12px 18px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Adicionar
                </button>
              </div>

              {carregando && (
                <p style={{ padding: "16px", color: "#6b7280", fontSize: 14 }}>Carregando conversas…</p>
              )}
              {!carregando && filteredProfissionais.length === 0 && (
                <p style={{ padding: "16px", color: "#6b7280", fontSize: 14 }}>
                  Nenhuma conversa com profissionais ainda. Adicione um veterinário ou fornecedor para iniciar.
                </p>
              )}
              {filteredProfissionais.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  className="chat-item"
                  onClick={() => handleOpen(conv)}
                >
                  <div className="chat-item__avatar">
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>
                      {conv.name?.[0] ?? "V"}
                    </span>
                  </div>

                  <div className="chat-item__content">
                    <div className="chat-item__top">
                      <span className="chat-item__name">{conv.name}</span>
                      <span className="chat-item__time">{conv.time}</span>
                    </div>
                    <div className="chat-item__type">{conv.type}</div>
                    <div className="chat-item__bottom">
                      <span className="chat-item__preview">{conv.lastMsg}</span>
                      {conv.unread > 0 && (
                        <span className="chat-item__badge">{conv.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 20,
              background: "#ffffff",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.18)",
              padding: 24,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 22, color: "#111827" }}>
              Adicionar profissional
            </h2>
            <p style={{ margin: "12px 0 20px", color: "#6b7280" }}>
              Informe o email do veterinário ou fornecedor para iniciar a conversa.
            </p>
            <div style={{ display: "grid", gap: 14 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email do profissional"
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  padding: "12px 14px",
                  fontSize: 16,
                }}
              />
              {error && (
                <div style={{ color: "#b91c1c", fontSize: 14 }}>
                  {error}
                </div>
              )}
              <button
                type="button"
                onClick={handleAdicionar}
                disabled={loading}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "none",
                  background: "#16a34a",
                  color: "#fff",
                  padding: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Aguardando..." : "Adicionar"}
              </button>
              <button
                type="button"
                onClick={handleFecharModal}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  color: "#374151",
                  padding: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
