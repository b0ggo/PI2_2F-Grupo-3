import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import { registrar, fazerLogout } from "../../services/perfil.js";
import styles from "./CadastroEmpresa.module.css";

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

  const formatTelefone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (!digits) return "";
    if (digits.length < 3) return `(${digits}`;
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    if (rest.length <= 4) return `(${ddd}) ${rest}`;
    if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
  };

  const formatCpfCnpj = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 11) {
      const filtered = digits.slice(0, 11);
      if (filtered.length <= 3) return filtered;
      if (filtered.length <= 6) return `${filtered.slice(0, 3)}.${filtered.slice(3)}`;
      if (filtered.length <= 9) return `${filtered.slice(0, 3)}.${filtered.slice(3, 6)}.${filtered.slice(6)}`;
      return `${filtered.slice(0, 3)}.${filtered.slice(3, 6)}.${filtered.slice(6, 9)}-${filtered.slice(9)}`;
    }

    const filtered = digits.slice(0, 14);
    if (filtered.length <= 2) return filtered;
    if (filtered.length <= 5) return `${filtered.slice(0, 2)}.${filtered.slice(2)}`;
    if (filtered.length <= 8) return `${filtered.slice(0, 2)}.${filtered.slice(2, 5)}.${filtered.slice(5)}`;
    if (filtered.length <= 12) return `${filtered.slice(0, 2)}.${filtered.slice(2, 5)}.${filtered.slice(5, 8)}/${filtered.slice(8)}`;
    return `${filtered.slice(0, 2)}.${filtered.slice(2, 5)}.${filtered.slice(5, 8)}/${filtered.slice(8, 12)}-${filtered.slice(12)}`;
  };

  const show = (msg, err) => {
    if (timer.current) window.clearTimeout(timer.current);
    setToast({ msg, err });
    timer.current = window.setTimeout(() => setToast(null), 2800);
  };

  const submit = async (e) => {
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

    try {
      await registrar({
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        localizacao: form.local.trim(),
        cpfCnpj: form.cnpj.trim(),
        tipoConta: form.tipo,
        senha: form.senha,
      });
      await fazerLogout();
      show("Cadastro da empresa realizado! Faça login para acessar sua conta.", false);
      navigate(ROUTES.LOGIN);
    } catch (err) {
      show(err.message || "Erro ao cadastrar.", true);
    }
  };

  return (
    <div className={`app-page ${styles.page}`}>
      <header className={styles.header}>
        <button type="button" className={styles.back} aria-label="Voltar" onClick={() => navigate(ROUTES.LOGIN)}>
          <IconBack />
        </button>
        <h1 className={styles.title}>Cadastro de Empresa</h1>
      </header>

      <form className={styles.body} onSubmit={submit} noValidate>
        <div className={styles.fieldBlock}>
          <label htmlFor="nome">
            Nome da Empresa <span className={styles.req}>*</span>
          </label>
          <input id="nome" className={styles.input} placeholder="Digite o nome da empresa" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="tipo">
            Tipo de Empresa <span className={styles.req}>*</span>
          </label>
          <select id="tipo" className={styles.select} value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
            {TIPOS.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="cnpj">
            CPF/CNPJ <span className={styles.req}>*</span>
          </label>
          <input id="cnpj" className={styles.input} placeholder="CPF ou CNPJ" value={form.cnpj} onChange={(e) => set("cnpj", formatCpfCnpj(e.target.value))} />
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="email">
            Email <span className={styles.req}>*</span>
          </label>
          <input id="email" type="email" className={styles.input} placeholder="empresa@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="tel">
            Telefone <span className={styles.req}>*</span>
          </label>
          <input id="tel" className={styles.input} placeholder="(00) 0000-0000" value={form.telefone} onChange={(e) => set("telefone", formatTelefone(e.target.value))} />
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="loc">
            Localização <span className={styles.req}>*</span>
          </label>
          <input id="loc" className={styles.input} placeholder="Cidade, Estado" value={form.local} onChange={(e) => set("local", e.target.value)} />
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="senha">
            Senha <span className={styles.req}>*</span>
          </label>
          <input id="senha" type="password" className={styles.input} placeholder="Mínimo 6 caracteres" value={form.senha} onChange={(e) => set("senha", e.target.value)} autoComplete="new-password" />
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="conf">
            Confirmar Senha <span className={styles.req}>*</span>
          </label>
          <input id="conf" type="password" className={styles.input} placeholder="Digite a senha novamente" value={form.conf} onChange={(e) => set("conf", e.target.value)} autoComplete="new-password" />
        </div>

        <div className={styles.formActions} style={{ marginTop: 16 }}>
          <button type="button" className={styles.btnOutlineGray} onClick={() => navigate(ROUTES.LOGIN)}>
            Cancelar
          </button>
          <button type="submit" className={styles.btnGreen}>
            Cadastrar
          </button>
        </div>
      </form>

      {toast && (
        <div className={`${styles.toast}${toast.err ? ` ${styles.toastError}` : ""}`}>{toast.msg}</div>
      )}
    </div>
  );
}
