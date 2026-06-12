import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import { ROUTES } from "../../constants/routes.js";
import { getAlertas } from "../../services/api.js";
import "./Alertas.css";

const STORAGE_KEY = "alertas-lidos";

function getLidos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(JSON.parse(raw || "[]"));
  } catch {
    return new Set();
  }
}

function saveLidos(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

function iconeAlerta(alerta) {
  if (alerta.urgente && alerta.detalhe?.toLowerCase().includes("vencido")) {
    return "⚠️";
  }
  return "💉";
}

export default function Alertas() {
  const navigate = useNavigate();
  const [aba, setAba] = useState("todas");
  const [alertas, setAlertas] = useState([]);
  const [lidos, setLidos] = useState(() => getLidos());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(() => {
    setCarregando(true);
    setErro("");
    getAlertas()
      .then(setAlertas)
      .catch(() => {
        setAlertas([]);
        setErro("Não foi possível carregar as notificações.");
      })
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const alertasComEstado = useMemo(
    () =>
      alertas.map((a) => ({
        ...a,
        lido: lidos.has(String(a.id)),
      })),
    [alertas, lidos]
  );

  const naoLidas = useMemo(
    () => alertasComEstado.filter((a) => !a.lido),
    [alertasComEstado]
  );

  const listaVisivel = aba === "nao-lidas" ? naoLidas : alertasComEstado;

  function marcarComoLida(id) {
    setLidos((prev) => {
      const next = new Set(prev);
      next.add(String(id));
      saveLidos(next);
      return next;
    });
  }

  function marcarTodasComoLidas() {
    setLidos((prev) => {
      const next = new Set(prev);
      alertas.forEach((a) => next.add(String(a.id)));
      saveLidos(next);
      return next;
    });
  }

  return (
    <div className="alertas-page">
      <div className="alertas-card">
        <Header
          layout="nav"
          titulo="Notificações"
          onVoltar={() => navigate(ROUTES.HOME)}
        />

        <div className="alertas-toolbar">
          <div className="alertas-titulo-area">
            <span className="alertas-badge">
              {naoLidas.length > 0
                ? `${naoLidas.length} nova${naoLidas.length > 1 ? "s" : ""}`
                : "Tudo em dia"}
            </span>
          </div>

          <div className="alertas-tabs" role="tablist" aria-label="Filtrar notificações">
            <button
              type="button"
              role="tab"
              aria-selected={aba === "todas"}
              className={`alertas-tab${aba === "todas" ? " alertas-tab--ativa" : ""}`}
              onClick={() => setAba("todas")}
            >
              Todas ({alertasComEstado.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={aba === "nao-lidas"}
              className={`alertas-tab${aba === "nao-lidas" ? " alertas-tab--ativa" : ""}`}
              onClick={() => setAba("nao-lidas")}
            >
              Não lidas ({naoLidas.length})
            </button>
          </div>

          {naoLidas.length > 0 && (
            <button
              type="button"
              className="alertas-marcar"
              onClick={marcarTodasComoLidas}
            >
              ✓ Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="alertas-lista">
          {carregando && (
            <p className="alertas-estado" role="status">
              Carregando notificações…
            </p>
          )}

          {!carregando && erro && (
            <div className="alertas-estado alertas-estado--erro">
              <p>{erro}</p>
              <button type="button" onClick={carregar}>
                Tentar novamente
              </button>
            </div>
          )}

          {!carregando && !erro && listaVisivel.length === 0 && (
            <p className="alertas-estado">
              {aba === "nao-lidas"
                ? "Nenhuma notificação não lida."
                : "Nenhuma notificação no momento."}
            </p>
          )}

          {!carregando &&
            !erro &&
            listaVisivel.map((alerta) => (
              <Link
                key={alerta.id}
                to={`/alertas/${alerta.id}`}
                className={`alertas-item${alerta.lido ? " alertas-item--lido" : ""}`}
                onClick={() => marcarComoLida(alerta.id)}
                aria-label={`${alerta.titulo}. ${alerta.detalhe}${alerta.lido ? ". Lida" : ". Não lida"}`}
              >
                <div className="alertas-icone" aria-hidden>
                  {iconeAlerta(alerta)}
                </div>

                <div className="alertas-conteudo">
                  <div className="alertas-linha-titulo">
                    <h3>{alerta.titulo}</h3>
                    {alerta.urgente && (
                      <span className="alertas-urgente">Urgente</span>
                    )}
                  </div>

                  <p>{alerta.detalhe}</p>
                </div>

                {!alerta.lido && (
                  <span className="alertas-ponto" aria-hidden title="Não lida" />
                )}
              </Link>
            ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
