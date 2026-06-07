import { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import { buscarGlobal } from "../../services/api.js";
import "./Consultar.css";

export default function Consultar() {
  const [q, setQ] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const termo = q.trim();
    if (!termo) {
      setResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      setBuscando(true);
      try {
        const dados = await buscarGlobal(termo);
        setResultados(dados);
      } catch {
        setResultados([]);
      } finally {
        setBuscando(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [q]);

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
          {!q.trim() && (
            <p className="consultar-placeholder">
              Digite acima para buscar animais e lotes cadastrados.
            </p>
          )}
          {q.trim() && buscando && (
            <p className="consultar-placeholder">Buscando…</p>
          )}
          {q.trim() && !buscando && resultados.length === 0 && (
            <p className="consultar-placeholder">
              Nenhum resultado para “{q.trim()}”.
            </p>
          )}
          {resultados.map((item) => (
            <div key={`${item.tipo}-${item.id}`} className="consultar-resultado">
              <span className="consultar-resultado-tipo">{item.tipo}</span>
              <strong>{item.titulo}</strong>
              <p>{item.subtitulo}</p>
            </div>
          ))}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
