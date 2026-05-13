import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import "../CadastroAnimal/CadastroAnimal.css";

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CadastroProdutor() {
  const navigate = useNavigate();
  const t = useRef(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    local: "",
    senha: "",
    conf: "",
  });
  const [toast, setToast] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const show = (msg, err) => {
    if (t.current) window.clearTimeout(t.current);
    setToast({ msg, err });
    t.current = window.setTimeout(() => setToast(null), 2800);
  };

  const submit = (e) => {
    e.preventDefault();
    const { nome, email, telefone, cpf, local, senha, conf } = form;
    if (!nome.trim() || !email.trim() || !telefone.trim() || !cpf.trim() || !local.trim()) {
      show("Preencha todos os campos obrigatórios.", true);
      return;
    }
    if (senha.length < 6) {
      show("A senha deve ter no mínimo 6 caracteres.", true);
      return;
    }
    if (senha !== conf) {
      show("As senhas não coincidem.", true);
      return;
    }
    show("Cadastro enviado! (conecte ao Flask para persistir)", false);
  };

  return (
    <div className="agro-form-page">
      <header className="agro-form-page__header">
        <button type="button" className="agro-form-page__back" aria-label="Voltar" onClick={() => navigate(ROUTES.LOGIN)}>
          <IconBack />
        </button>
        <h1 className="agro-form-page__title">Cadastro de Produtor</h1>
      </header>

      <form className="agro-form-page__body" onSubmit={submit} noValidate>
        {[
          ["nome", "Nome Completo", "text", "Digite seu nome", true],
          ["email", "Email", "email", "seu@email.com", true],
          ["telefone", "Telefone", "tel", "(00) 00000-0000", true],
          ["cpf", "CPF", "text", "000.000.000-00", true],
          ["local", "Localização", "text", "Cidade, Estado", true],
          ["senha", "Senha", "password", "Mínimo 6 caracteres", true],
          ["conf", "Confirmar Senha", "password", "Digite a senha novamente", true],
        ].map(([key, label, type, ph, req]) => (
          <div className="field-block" key={key}>
            <label htmlFor={key}>
              {label} {req && <span className="req">*</span>}
            </label>
            <input
              id={key}
              className="agro-input"
              type={type}
              placeholder={ph}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              autoComplete={key === "senha" || key === "conf" ? "new-password" : "on"}
            />
          </div>
        ))}

        <div className="form-actions" style={{ marginTop: 16 }}>
          <button type="button" className="btn-outline-gray" onClick={() => navigate(ROUTES.LOGIN)}>
            Cancelar
          </button>
          <button type="submit" className="btn-green">
            Cadastrar
          </button>
        </div>
      </form>

      {toast && <div className={`toast-mini${toast.err ? " err" : ""}`}>{toast.msg}</div>}
    </div>
  );
}
