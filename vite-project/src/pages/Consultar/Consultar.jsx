import { useState } from "react";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import "./Consultar.css";

export default function Consultar() {
  const [q, setQ] = useState("");

  return (
    <div className="consultar-page">
      <div className="consultar-card">
        <Header
          layout="stack"
          titulo="Buscar"
          subtitulo="Encontre animais, lotes ou registros pelo código ou nome."
        >
          <label className="consultar-search-label" htmlFor="busca-global">
            <span className="app-header-search">
              <svg
                className="app-header-search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="busca-global"
                type="search"
                placeholder="Ex.: BR-001234, Lote A…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                autoComplete="off"
              />
            </span>
          </label>
        </Header>

        <section className="consultar-body" aria-live="polite">
          {q.trim() ? (
            <p className="consultar-placeholder">
              Nenhum resultado local para “{q.trim()}”. Conecte a API quando
              disponível.
            </p>
          ) : (
            <p className="consultar-placeholder">
              Digite acima para simular uma busca. Esta tela está preparada para
              integração com o backend.
            </p>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
