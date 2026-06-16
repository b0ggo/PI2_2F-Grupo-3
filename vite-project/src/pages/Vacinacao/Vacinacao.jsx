import { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import { ROUTES } from "../../constants/routes.js";
import { VACINAS } from "../../data/vacinas.js";
import { getAnimais, getLotes, getVacinacoes, postVacinacao } from "../../services/api.js";
import "./Vacinacao.css";

const TODAS_VACINAS = [...new Set(Object.values(VACINAS).flat())];

function formatarData(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function diasAte(iso) {
  if (!iso) return null;
  const alvo = new Date(iso);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  alvo.setHours(0, 0, 0, 0);
  return Math.ceil((alvo - hoje) / (1000 * 60 * 60 * 24));
}

export default function Vacinacao() {
  const [aba, setAba] = useState("registrar");
  const [alvos, setAlvos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [form, setForm] = useState({
    alvo: "",
    tipoVacina: "",
    outraVacina: "",
    dataAplicacao: "",
    proximaDose: "",
    observacoes: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    Promise.all([getAnimais(), getLotes()])
      .then(([animais, lotes]) => {
        const lista = [
          ...animais.map((a) => ({
            key: `animal:${a.id}`,
            alvoTipo: "animal",
            alvoId: a.id,
            label: a.identificacao,
          })),
          ...lotes.map((l) => ({
            key: `lote:${l.id}`,
            alvoTipo: "lote",
            alvoId: l.id,
            label: l.nome,
          })),
        ];
        setAlvos(lista);
      })
      .catch(() => setAlvos([]));
  }, []);

  useEffect(() => {
    if (aba === "historico") {
      getVacinacoes()
        .then(setHistorico)
        .catch(() => setHistorico([]));
    }
  }, [aba, salvando]);

  async function registrar() {
    const selecionado = alvos.find((a) => a.key === form.alvo);
    const tipoVacinaFinal =
      form.tipoVacina === "__outra__"
        ? form.outraVacina.trim() || "Outra"
        : form.tipoVacina;

    if (!selecionado || !tipoVacinaFinal) {
      setFeedback("Selecione animal/lote e tipo de vacina.");
      return;
    }

    setSalvando(true);
    setFeedback("");
    try {
      await postVacinacao({
        alvoTipo: selecionado.alvoTipo,
        alvoId: selecionado.alvoId,
        alvoLabel: selecionado.label,
        tipoVacina: tipoVacinaFinal,
        dataAplicacao: form.dataAplicacao,
        proximaDose: form.proximaDose,
        observacoes: form.observacoes,
      });
      setForm({
        alvo: "",
        tipoVacina: "",
        outraVacina: "",
        dataAplicacao: "",
        proximaDose: "",
        observacoes: "",
      });
      setFeedback("Vacina registrada com sucesso!");
    } catch (err) {
      setFeedback(err.message || "Erro ao registrar vacina.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="vacina-page">
      <div className="vacina-card">
        <Header titulo="Vacinação" voltarPara={ROUTES.HOME} />

        <div className="vacina-abas" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={aba === "registrar"}
            className={aba === "registrar" ? "vacina-aba vacina-aba--ativa" : "vacina-aba"}
            onClick={() => setAba("registrar")}
          >
            Registrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={aba === "historico"}
            className={aba === "historico" ? "vacina-aba vacina-aba--ativa" : "vacina-aba"}
            onClick={() => setAba("historico")}
          >
            Histórico
          </button>
        </div>

      {aba === "registrar" && (
        <section className="vacina-corpo">
          <label>Animal/Lote *</label>
          <select
            value={form.alvo}
            onChange={(e) => setForm((f) => ({ ...f, alvo: e.target.value }))}
          >
            <option value="">Selecione o animal ou lote</option>
            {alvos.map((a) => (
              <option key={a.key} value={a.key}>{a.label}</option>
            ))}
          </select>

          <label>Tipo de Vacina *</label>
          <select
            value={form.tipoVacina}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                tipoVacina: e.target.value,
                outraVacina: e.target.value === "__outra__" ? f.outraVacina : "",
              }))
            }
          >
            <option value="">Selecione a vacina</option>
            {TODAS_VACINAS.map((v) => (
              <option key={v} value={v === "Outra" ? "__outra__" : v}>
                {v}
              </option>
            ))}
          </select>

          {form.tipoVacina === "__outra__" && (
            <>
              <label>Especifique a vacina</label>
              <input
                type="text"
                placeholder="Digite o nome da vacina"
                maxLength={80}
                value={form.outraVacina}
                onChange={(e) => setForm((f) => ({ ...f, outraVacina: e.target.value }))}
              />
            </>
          )}

          <div className="datas">
            <div>
              <label>Data de Aplicação</label>
              <input
                type="date"
                value={form.dataAplicacao}
                onChange={(e) => setForm((f) => ({ ...f, dataAplicacao: e.target.value }))}
              />
            </div>
            <div>
              <label>Próxima Dose</label>
              <input
                type="date"
                value={form.proximaDose}
                onChange={(e) => setForm((f) => ({ ...f, proximaDose: e.target.value }))}
              />
            </div>
          </div>

          <label>Observações</label>
          <textarea
            placeholder="Informações adicionais sobre a vacinação..."
            value={form.observacoes}
            onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
          />

          {feedback && <p style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>{feedback}</p>}

          <button
            type="button"
            className="vacina-btn-primario"
            onClick={registrar}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Registrar Vacina"}
          </button>
        </section>
      )}

      {aba === "historico" && (
        <section className="vacina-corpo vacina-corpo--lista">
          {historico.length === 0 && (
            <p style={{ color: "#6b7280", fontSize: 14 }}>Nenhuma vacinação registrada.</p>
          )}
          {historico.map((item) => {
            const dias = diasAte(item.proximaDose);
            const urgente = dias !== null && dias <= 30;
            return (
              <div
                key={item.id}
                className={`vacina-hist-card${urgente ? " vacina-hist-card--alerta" : ""}`}
              >
                {urgente && <span className="vacina-tag">Urgente</span>}
                <h3>{item.tipoVacina}</h3>
                <p>{item.alvoLabel}</p>
                <p>Aplicada em: {formatarData(item.dataAplicacao)}</p>
                {item.proximaDose && (
                  <p className={urgente ? "vacina-hist-alerta" : undefined}>
                    Próxima dose: {formatarData(item.proximaDose)}
                    {dias !== null && ` (em ${dias} dias)`}
                  </p>
                )}
              </div>
            );
          })}
        </section>
      )}
      </div>

      <BottomNav mode="produtor" />
    </div>
  );
}
