import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import "./CadastrarLotes.css";

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

const ICON_BACK = "M19 12H5 M12 5l-7 7 7 7";
const ICON_CHECK = "M20 6L9 17l-5-5";
const ICON_LEAF =
  "M2 22c1.25-1.67 3-4 8-4s6.75 2.33 8 4 M12 13c2-2 4-5 4-9a4 4 0 0 0-8 0c0 4 2 7 4 9z";

const INITIAL = {
  tipo: "Suínos",
  nome: "",
  quantidade: "",
  doentes: "",
  vacinados: "",
  mortes: "",
  observacoes: "",
};

function parseNonNegInt(raw, label) {
  const t = raw.trim();
  if (t === "") return { ok: true, value: 0 };
  if (!/^\d+$/.test(t)) {
    return {
      ok: false,
      error: `${label} deve ser um número inteiro maior ou igual a zero.`,
    };
  }
  const n = Number(t);
  if (n < 0 || !Number.isSafeInteger(n)) {
    return { ok: false, error: `${label} inválido.` };
  }
  return { ok: true, value: n };
}

function parsePositiveInt(raw, label) {
  const t = raw.trim();
  if (t === "") {
    return { ok: false, error: `${label} é obrigatório.` };
  }
  if (!/^\d+$/.test(t)) {
    return {
      ok: false,
      error: `${label} deve ser um número inteiro positivo.`,
    };
  }
  const n = Number(t);
  if (n < 1 || !Number.isSafeInteger(n)) {
    return { ok: false, error: `${label} deve ser pelo menos 1.` };
  }
  return { ok: true, value: n };
}

function salvarLoteNoServidor(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const obs = (payload.observacoes || "").toLowerCase();
      if (obs.includes("simular erro")) {
        reject(
          new Error(
            "Não foi possível salvar o lote no servidor. Verifique sua conexão e tente novamente.",
          ),
        );
        return;
      }
      resolve({ id: Date.now(), ...payload });
    }, 700);
  });
}

export default function CadastrarLotes() {
  const navigate = useNavigate();

  const goHome = () => navigate(ROUTES.HOME);
  const toastTimerRef = useRef(null);

  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const total = parseInt(form.quantidade, 10) || 0;
  const doentes = parseInt(form.doentes, 10) || 0;
  const mortes = parseInt(form.mortes, 10) || 0;
  const saudaveis = Math.max(0, total - doentes - mortes);

  const validate = () => {
    if (!form.nome.trim()) {
      return "Informe o nome do lote.";
    }
    const q = parsePositiveInt(form.quantidade, "Quantidade de animais");
    if (!q.ok) return q.error;

    const d = parseNonNegInt(form.doentes, "Doentes");
    if (!d.ok) return d.error;
    const v = parseNonNegInt(form.vacinados, "Vacinados");
    if (!v.ok) return v.error;
    const m = parseNonNegInt(form.mortes, "Mortes");
    if (!m.ok) return m.error;

    if (d.value + m.value > q.value) {
      return "A soma de doentes e mortes não pode ser maior que a quantidade total de animais.";
    }

    return null;
  };

  const showToast = (message, variant) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setFeedback({ message, variant });
    toastTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
      toastTimerRef.current = null;
    }, 3200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const err = validate();
    if (err) {
      showToast(err, "error");
      return;
    }

    const q = parsePositiveInt(form.quantidade, "Quantidade").value;
    const d = parseNonNegInt(form.doentes, "Doentes").value;
    const v = parseNonNegInt(form.vacinados, "Vacinados").value;
    const m = parseNonNegInt(form.mortes, "Mortes").value;
    const payload = {
      tipo: form.tipo,
      nome: form.nome.trim(),
      quantidade: q,
      doentes: d,
      vacinados: v,
      mortes: m,
      observacoes: form.observacoes.trim(),
      total: q,
      saudaveis: Math.max(0, q - d - m),
    };

    setSubmitting(true);
    try {
      await salvarLoteNoServidor(payload);
      setForm(INITIAL);
      showToast("Lote salvo com sucesso", "success");
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao salvar o lote. Tente novamente.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = form.nome.trim() !== "" && form.quantidade.trim() !== "";

  return (
    <div className="cadastro-page">
      <header className="cadastro-header">
        <button
          type="button"
          className="cadastro-header__back"
          onClick={goHome}
          aria-label="Voltar"
        >
          <Icon d={ICON_BACK} size={20} color="#fff" />
        </button>
        <h1 className="cadastro-header__title">Cadastrar Lote</h1>
      </header>

      <form className="cadastro-body" onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label className="field-label">
            Tipo de Lote <span>*</span>
          </label>
          <div className="tipo-selector">
            {["Suínos", "Frangos"].map((tipo) => (
              <button
                key={tipo}
                type="button"
                className={`tipo-btn ${form.tipo === tipo ? "active" : ""}`}
                onClick={() => set("tipo", tipo)}
              >
                <span className="tipo-btn__dot" />
                {tipo}
              </button>
            ))}
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">
            Nome do Lote <span>*</span>
          </label>
          <input
            className={`field-input ${form.nome ? "filled" : ""}`}
            placeholder="Ex: Lote A - Janeiro 2026"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            name="nome"
            autoComplete="off"
          />
        </div>

        <div className="field-group">
          <label className="field-label">
            Quantidade de Animais <span>*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            className={`field-input ${form.quantidade ? "filled" : ""}`}
            placeholder="Ex: 100"
            value={form.quantidade}
            onChange={(e) => set("quantidade", e.target.value)}
            name="quantidade"
          />
        </div>

        <div className="field-trio">
          {[
            ["Doentes", "doentes"],
            ["Vacinados", "vacinados"],
            ["Mortes", "mortes"],
          ].map(([label, key]) => (
            <div key={key} className="field-group" style={{ marginBottom: 0 }}>
              <label className="field-label">{label}</label>
              <input
                type="text"
                inputMode="numeric"
                className="field-input"
                placeholder="0"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                name={key}
              />
            </div>
          ))}
        </div>

        <div className="field-group">
          <label className="field-label">Observações</label>
          <textarea
            className="field-textarea"
            placeholder="Informações adicionais sobre o lote… "
            rows={3}
            value={form.observacoes}
            onChange={(e) => set("observacoes", e.target.value)}
            name="observacoes"
          />
        </div>

        <div className="resumo-card">
          <p className="resumo-card__title">
            <Icon d={ICON_LEAF} size={16} color="#166534" />
            Resumo do Lote
          </p>
          <div className="resumo-card__row">
            <span className="resumo-card__item">
              Total: <strong>{total}</strong>
            </span>
            <span className="resumo-card__item">
              Saudáveis: <strong>{saudaveis}</strong>
            </span>
            {doentes > 0 && (
              <span className="resumo-card__item">
                Doentes: <strong>{doentes}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="cadastro-actions">
          <button type="button" className="btn-cancel" onClick={goHome}>
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-save"
            disabled={!canSubmit || submitting}
          >
            {submitting ? (
              "Salvando…"
            ) : (
              <>
                <Icon d={ICON_CHECK} size={16} color="#fff" /> Salvar
              </>
            )}
          </button>
        </div>
      </form>

      {feedback && (
        <div
          className="toast"
          role="status"
          style={
            feedback.variant === "error"
              ? { background: "#991b1b", whiteSpace: "normal" }
              : undefined
          }
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
