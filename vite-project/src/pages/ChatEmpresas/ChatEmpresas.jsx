import { useState, useRef, useEffect } from "react";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import headerUi from "../../components/Header/Header.module.css";
import { ROUTES } from "../../constants/routes.js";
import { enviarMensagem, getConversas } from "../../services/api.js";
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

function ConversationView({ conversation, onBack, onUpdate }) {
  const [messages, setMessages] = useState(conversation.messages);
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

  const schedule = (fn, delay) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  };

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

        {remoteTyping && (
          <div className="typing-row">
            <div className="typing-bubble">
              <span
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  fontWeight: 700,
                }}
              >
                Usuário está digitando…
              </span>
            </div>
          </div>
        )}

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

  useEffect(() => {
    getConversas()
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setCarregando(false));
  }, []);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpen = (conv) => {
    setConversations((cs) =>
      cs.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c)),
    );
    setOpenConv({ ...conv, unread: 0 });
  };

  const handleUpdate = (id, msgs) => {
    const last = msgs[msgs.length - 1];
    const lastMsg = last?.text ?? "";
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

  if (openConv) {
    return (
      <ConversationView
        key={openConv.id}
        conversation={openConv}
        onBack={() => setOpenConv(null)}
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
              placeholder="Buscar empresas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar conversa"
            />
          </div>
        }>
        </Header>

        <div className="chat-list">
        {carregando && (
          <p style={{ padding: "16px", color: "#6b7280", fontSize: 14 }}>Carregando conversas…</p>
        )}
        {!carregando && filtered.length === 0 && (
          <p style={{ padding: "16px", color: "#6b7280", fontSize: 14 }}>Nenhuma conversa encontrada.</p>
        )}
        {filtered.map((conv) => (
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

        <div className="chat-cta">
          <div className="chat-cta__heading">
            <Icon d={ICONS.connect} size={16} color="#16a34a" />
            <span className="chat-cta__title">Conecte-se com Empresas</span>
          </div>
          <p className="chat-cta__text">
            Entre em contato com cooperativas, veterinárias e fornecedores
            diretamente pelo chat.
          </p>
        </div>
      </div>
      </div>

      <BottomNav />
    </div>
  );
}
