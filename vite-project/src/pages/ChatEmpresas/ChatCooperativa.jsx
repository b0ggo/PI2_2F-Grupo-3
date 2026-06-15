import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import { ROUTES } from "../../constants/routes.js";
import { associateProducerByEmail, getConversas } from "../../services/api.js";
import { getPerfil, resolveUserMode } from "../../services/perfil.js";
import { ConversationView } from "./ChatEmpresas.jsx";
import "./ChatEmpresas.css";

function nowTime() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function ChatCooperativa() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [openConv, setOpenConv] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modo, setModo] = useState("produtor");

  useEffect(() => {
    getPerfil()
      .then((perfil) => {
        const resolved = resolveUserMode(perfil);
        setModo(resolved);
        if (resolved !== "cooperativa") {
          navigate(ROUTES.CHAT, { replace: true });
        }
      })
      .catch(() => navigate(ROUTES.CHAT, { replace: true }));
  }, [navigate]);

  useEffect(() => {
    if (modo !== "cooperativa") return;
    getConversas()
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setCarregando(false));
  }, [modo]);

  const handleOpen = (conv) => {
    setOpenConv({ ...conv, unread: 0 });
  };

  const handleCloseConversation = () => {
    setOpenConv(null);
  };

  const produtorConversations = conversations.filter(
    (conv) =>
      String(conv.type || "").toLowerCase() === "produtor" ||
      Boolean(conv.partnerId),
  );

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
      setError("Informe o email do produtor.");
      return;
    }
    setLoading(true);
    try {
      const result = await associateProducerByEmail({ email: email.trim() });
      setLoading(false);
      if (result?.conversationId) {
        const newConv = {
          id: result.conversationId,
          partnerId: result.partnerId,
          name:
            result.partner?.nome || result.partner?.email || email.trim(),
          type: "Produtor",
          lastMsg: "Conversa iniciada com o produtor.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
      setError(err.message || "Erro ao adicionar produtor.");
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
        <Header titulo="Chat Cooperativa" voltarPara={ROUTES.HOME} />
        <div className="chat-list" style={{ padding: 24 }}>
          <div
            className="chat-item"
            style={{
              borderRadius: 16,
              marginBottom: 16,
              padding: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
              Adicione produtores para conversar
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
              }}
            >
              Adicionar produtor
            </button>
          </div>

          {carregando ? (
            <p style={{ color: "#6b7280", fontSize: 14 }}>Carregando conversas…</p>
          ) : produtorConversations.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Nenhuma conversa com produtores ainda. Adicione um produtor para iniciar.
            </p>
          ) : (
            produtorConversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                className="chat-item"
                onClick={() => handleOpen(conv)}
              >
                <div className="chat-item__avatar">
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>
                    {conv.name?.[0] ?? "P"}
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
            ))
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
              Adicionar produtor
            </h2>
            <p style={{ margin: "12px 0 20px", color: "#6b7280" }}>
              Informe o email do produtor para iniciar a conversa.
            </p>
            <div style={{ display: "grid", gap: 14 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email do produtor"
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
                {loading ? "Aguardando..." : "Adicionar produtor"}
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
