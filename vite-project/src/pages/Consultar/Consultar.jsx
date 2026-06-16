import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import { ROUTES } from "../../constants/routes.js";
import { getAnimais, getLotes } from "../../services/api.js";
import "./Consultar.css";

const TIPOS_ANIMAL = ["bovino", "suino", "frango", "caprino", "ovino"];
const STATUS_ANIMAL = [
  { id: "", label: "Todos" },
  { id: "saudavel", label: "Saudável" },
  { id: "tratamento", label: "Em Tratamento" },
  { id: "quarentena", label: "Quarentena" },
];

function rotuloTipo(tipo) {
  if (!tipo) return "";
  return tipo.charAt(0).toUpperCase() + tipo.slice(1);
}

function rotuloStatus(status) {
  const mapa = {
    saudavel: "Saudável",
    tratamento: "Em Tratamento",
    quarentena: "Quarentena",
    doente: "Doente",
  };
  return mapa[status] || "—";
}

function classeStatus(status) {
  if (status === "saudavel") return "saudavel";
  if (status === "tratamento" || status === "quarentena") return "alerta";
  return "doente";
}

function combinaBusca(textos, termo) {
  if (!termo) return true;
  const q = termo.toLowerCase();
  return textos.some((t) => String(t || "").toLowerCase().includes(q));
}

function formatarData(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function Consultar() {
  const [aba, setAba] = useState("animais");
  const [q, setQ] = useState("");
  const [animais, setAnimais] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtros, setFiltros] = useState({ tipo: "", status: "" });
  const [detalheId, setDetalheId] = useState(null);

  useEffect(() => {
    setCarregando(true);
    Promise.all([getAnimais(), getLotes()])
      .then(([listaAnimais, listaLotes]) => {
        setAnimais(listaAnimais);
        setLotes(listaLotes);
      })
      .catch(() => {
        setAnimais([]);
        setLotes([]);
      })
      .finally(() => setCarregando(false));
  }, []);

  const animaisFiltrados = useMemo(() => {
    const termo = q.trim();
    return animais.filter((a) => {
      if (
        !combinaBusca(
          [a.identificacao, a.raca, a.tipo, rotuloTipo(a.tipo)],
          termo
        )
      ) {
        return false;
      }
      if (filtros.tipo && a.tipo !== filtros.tipo) return false;
      if (filtros.status && a.status !== filtros.status) return false;
      return true;
    });
  }, [animais, q, filtros]);

  const lotesFiltrados = useMemo(() => {
    const termo = q.trim();
    return lotes.filter((l) => {
      if (!combinaBusca([l.nome, l.tipo, rotuloTipo(l.tipo)], termo)) {
        return false;
      }
      if (filtros.tipo && l.tipo !== filtros.tipo) return false;
      return true;
    });
  }, [lotes, q, filtros]);

  const listaAtiva = aba === "animais" ? animaisFiltrados : lotesFiltrados;

  function limparFiltros() {
    setFiltros({ tipo: "", status: "" });
  }

  return (
    <div className="consultar-page">
      <div className="consultar-card">
        <Header layout="stack" titulo="Buscar" voltarPara={ROUTES.HOME}>
          <label className="consultar-search-label" htmlFor="busca-consultar">
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
                id="busca-consultar"
                type="search"
                placeholder="Buscar por identificação, raça..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                autoComplete="off"
              />
            </span>
          </label>
        </Header>

        <div className="consultar-abas" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={aba === "animais"}
            className={
              aba === "animais"
                ? "consultar-aba consultar-aba--ativa"
                : "consultar-aba"
            }
            onClick={() => {
              setAba("animais");
              setDetalheId(null);
            }}
          >
            Animais ({animaisFiltrados.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={aba === "lotes"}
            className={
              aba === "lotes"
                ? "consultar-aba consultar-aba--ativa"
                : "consultar-aba"
            }
            onClick={() => {
              setAba("lotes");
              setDetalheId(null);
            }}
          >
            Lotes ({lotesFiltrados.length})
          </button>
        </div>

        <div className="consultar-filtros-area">
          <button
            type="button"
            className={`consultar-filtros-btn${filtrosAbertos ? " consultar-filtros-btn--aberto" : ""}`}
            onClick={() => setFiltrosAbertos((v) => !v)}
            aria-expanded={filtrosAbertos}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            Filtros Avançados
          </button>

          {filtrosAbertos && (
            <div className="consultar-filtros-panel">
              <label htmlFor="filtro-tipo">Tipo</label>
              <select
                id="filtro-tipo"
                value={filtros.tipo}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, tipo: e.target.value }))
                }
              >
                <option value="">Todos</option>
                {TIPOS_ANIMAL.map((t) => (
                  <option key={t} value={t}>
                    {rotuloTipo(t)}
                  </option>
                ))}
              </select>

              {aba === "animais" && (
                <>
                  <label htmlFor="filtro-status">Status</label>
                  <select
                    id="filtro-status"
                    value={filtros.status}
                    onChange={(e) =>
                      setFiltros((f) => ({ ...f, status: e.target.value }))
                    }
                  >
                    {STATUS_ANIMAL.map((s) => (
                      <option key={s.id || "todos"} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <button
                type="button"
                className="consultar-filtros-limpar"
                onClick={limparFiltros}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        <section className="consultar-lista" aria-live="polite">
          {carregando && (
            <p className="consultar-vazio">Carregando dados…</p>
          )}

          {!carregando && listaAtiva.length === 0 && (
            <p className="consultar-vazio">
              {q.trim() || filtros.tipo || filtros.status
                ? "Nenhum resultado encontrado."
                : aba === "animais"
                  ? "Nenhum animal cadastrado ainda."
                  : "Nenhum lote cadastrado ainda."}
            </p>
          )}

          {!carregando &&
            aba === "animais" &&
            animaisFiltrados.map((animal) => {
              const aberto = detalheId === animal.id;
              const statusClasse = classeStatus(animal.status);
              return (
                <article key={animal.id} className="consultar-item">
                  <div className="consultar-item-topo">
                    <h3>{animal.identificacao || "Sem identificação"}</h3>
                    <span
                      className={`consultar-badge consultar-badge--${statusClasse}`}
                    >
                      {statusClasse !== "saudavel" && (
                        <span className="consultar-badge-icone" aria-hidden>
                          !
                        </span>
                      )}
                      {rotuloStatus(animal.status)}
                    </span>
                  </div>

                  <p className="consultar-item-tipo">
                    {rotuloTipo(animal.tipo)}
                    {animal.raca ? ` - ${animal.raca}` : ""}
                  </p>

                  <div className="consultar-item-rodape">
                    <span className="consultar-item-peso">
                      Peso: {animal.peso ? `${animal.peso} kg` : "—"}
                    </span>
                    <button
                      type="button"
                      className="consultar-detalhes"
                      onClick={() =>
                        setDetalheId(aberto ? null : animal.id)
                      }
                      aria-expanded={aberto}
                    >
                      Ver detalhes →
                    </button>
                  </div>

                  {aberto && (
                    <div className="consultar-detalhes-painel">
                      <p>
                        <strong>Sexo:</strong> {animal.sexo || "—"}
                      </p>
                      <p>
                        <strong>Idade:</strong>{" "}
                        {animal.idade ? `${animal.idade} meses` : "—"}
                      </p>
                      <p>
                        <strong>Nascimento:</strong>{" "}
                        {formatarData(animal.dataNasc)}
                      </p>
                      <p>
                        <strong>Vacinas:</strong>{" "}
                        {animal.vacinas?.length
                          ? animal.vacinas.join(", ")
                          : "Nenhuma registrada"}
                      </p>
                      {animal.tipo === "bovino" && animal.produtividadeLeite && (
                        <p>
                          <strong>Produtividade leiteira:</strong>{" "}
                          {animal.produtividadeLeite}
                        </p>
                      )}
                      {animal.historico && (
                        <p>
                          <strong>Histórico:</strong> {animal.historico}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}

          {!carregando &&
            aba === "lotes" &&
            lotesFiltrados.map((lote) => {
              const aberto = detalheId === lote.id;
              const temDoentes = (lote.doentes || 0) > 0;
              return (
                <article key={lote.id} className="consultar-item">
                  <div className="consultar-item-topo">
                    <h3>{lote.nome || "Sem nome"}</h3>
                    <span
                      className={`consultar-badge consultar-badge--${temDoentes ? "doente" : "saudavel"}`}
                    >
                      {temDoentes && (
                        <span className="consultar-badge-icone" aria-hidden>
                          !
                        </span>
                      )}
                      {temDoentes ? "Com doentes" : "Saudável"}
                    </span>
                  </div>

                  <p className="consultar-item-tipo">
                    {rotuloTipo(lote.tipo)}
                    {lote.quantidade != null
                      ? ` · ${lote.quantidade} animais`
                      : ""}
                  </p>

                  <div className="consultar-item-rodape">
                    <span className="consultar-item-peso">
                      Vacinados: {lote.vacinados ?? 0}
                    </span>
                    <button
                      type="button"
                      className="consultar-detalhes"
                      onClick={() => setDetalheId(aberto ? null : lote.id)}
                      aria-expanded={aberto}
                    >
                      Ver detalhes →
                    </button>
                  </div>

                  {aberto && (
                    <div className="consultar-detalhes-painel">
                      <p>
                        <strong>Total:</strong> {lote.quantidade ?? 0} animais
                      </p>
                      <p>
                        <strong>Saudáveis:</strong> {lote.saudaveis ?? "—"}
                      </p>
                      <p>
                        <strong>Doentes:</strong> {lote.doentes ?? 0}
                      </p>
                      <p>
                        <strong>Mortes:</strong> {lote.mortes ?? 0}
                      </p>
                      {lote.observacoes && (
                        <p>
                          <strong>Observações:</strong> {lote.observacoes}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
        </section>
      </div>

      <BottomNav mode="produtor" />
    </div>
  );
}
