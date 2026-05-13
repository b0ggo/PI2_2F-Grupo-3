import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import "../CadastroAnimal/CadastroAnimal.css";

const TIPOS = ["Selecione o tipo", "Cooperativa", "Fornecedor", "Veterinária", "Indústria"];

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CadastroEmpresa() {
  const navigate = useNavigate();
  const timer = useRef(null);
  const [form, setForm] = useState({
    nome: "",
    tipo: TIPOS[0],
    cnpj: "",
    email: "",
    telefone: "",
    local: "",
    senha: "",
    conf: "",
  });
  const [toast, setToast] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const show = (msg, err) => {
    if (timer.current) window.clearTimeout(timer.current);
    setToast({ msg, err });
    timer.current = window.setTimeout(() => setToast(null), 2800);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.nome.trim() || form.tipo === TIPOS[0] || !form.cnpj.trim() || !form.email.trim()) {
      show("Preencha nome, tipo, CNPJ e email.", true);
      return;
    }
    if (form.senha.length < 6) {
      show("A senha deve ter no mínimo 6 caracteres.", true);
      return;
    }
    if (form.senha !== form.conf) {
      show("As senhas não coincidem.", true);
      return;
    }
    show("Cadastro da empresa enviado! (integração Flask)", false);
  };

  return (
    <div className="agro-form-page">
      <header className="agro-form-page__header">
        <button type="button" className="agro-form-page__back" aria-label="Voltar" onClick={() => navigate(ROUTES.LOGIN)}>
          <IconBack />
        </button>
        <h1 className="agro-form-page__title">Cadastro de Empresa</h1>
      </header>

      <form className="agro-form-page__body" onSubmit={submit} noValidate>
        <div className="field-block">
          <label htmlFor="nome">
            Nome da Empresa <span className="req">*</span>
          </label>
          <input id="nome" className="agro-input" placeholder="Digite o nome da empresa" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
        </div>
        <div className="field-block">
          <label htmlFor="tipo">
            Tipo de Empresa <span className="req">*</span>
          </label>
          <select id="tipo" className="agro-select" value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
            {TIPOS.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <div className="field-block">
          <label htmlFor="cnpj">
            CNPJ <span className="req">*</span>
          </label>
          <input id="cnpj" className="agro-input" placeholder="00.000.000/0000-00" value={form.cnpj} onChange={(e) => set("cnpj", e.target.value)} />
        </div>
        <div className="field-block">
          <label htmlFor="email">
            Email <span className="req">*</span>
          </label>
          <input id="email" type="email" className="agro-input" placeholder="empresa@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="field-block">
          <label htmlFor="tel">
            Telefone <span className="req">*</span>
          </label>
          <input id="tel" className="agro-input" placeholder="(00) 0000-0000" value={form.telefone} onChange={(e) => set("telefone", e.target.value)} />
        </div>
        <div className="field-block">
          <label htmlFor="loc">
            Localização <span className="req">*</span>
          </label>
          <input id="loc" className="agro-input" placeholder="Cidade, Estado" value={form.local} onChange={(e) => set("local", e.target.value)} />
        </div>
        <div className="field-block">
          <label htmlFor="senha">
            Senha <span className="req">*</span>
          </label>
          <input id="senha" type="password" className="agro-input" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={(e) => set("senha", e.target.value)} autoComplete="new-password" />
        </div>
        <div className="field-block">
          <label htmlFor="conf">
            Confirmar Senha <span className="req">*</span>
          </label>
          <input id="conf" type="password" className="agro-input" placeholder="Digite a senha novamente" value={form.conf} onChange={(e) => set("conf", e.target.value)} autoComplete="new-password" />
        </div>

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
