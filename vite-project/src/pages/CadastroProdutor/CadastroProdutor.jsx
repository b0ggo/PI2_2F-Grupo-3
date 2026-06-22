import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import { registrar, fazerLogout } from "../../services/perfil.js";
import {
  validarNome,
  validarEmail,
  validarTelefone,
  validarCpf,
  validarSenha,
  obterEstados,
  validarEstado,
  validarMunicipio,
  formatarTelefone,
  formatarCPF,
} from "../../services/validations.js";
import styles from "./CadastroProdutor.module.css";

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
    estado: "",
    municipio: "",
    senha: "",
    conf: "",
  });
  const [errors, setErrors] = useState({});
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

  const formatCPF = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const show = (msg, err) => {
    if (t.current) window.clearTimeout(t.current);
    setToast({ msg, err });
    t.current = window.setTimeout(() => setToast(null), 2800);
  };

  const validarFormulario = () => {
    const novoErros = {};

    if (!validarNome(form.nome)) {
      novoErros.nome = "O nome deve conter pelo menos 2 palavras";
    }

    if (!validarEmail(form.email)) {
      novoErros.email = "Email inválido";
    }

    if (!validarTelefone(form.telefone)) {
      novoErros.telefone = "Telefone deve ter no mínimo 10 dígitos";
    }

    if (!validarCpf(form.cpf)) {
      novoErros.cpf = "CPF inválido. Deve ter 11 dígitos válidos";
    }

    if (!validarEstado(form.estado)) {
      novoErros.estado = "Selecione um estado válido";
    }

    if (!validarMunicipio(form.municipio)) {
      novoErros.municipio = "Município inválido";
    }

    if (!validarSenha(form.senha)) {
      novoErros.senha =
        "Senha deve ter pelo menos 1 letra, 1 número e 1 caractere especial (!@#$%^&*)";
    }

    if (form.senha !== form.conf) {
      novoErros.conf = "As senhas não coincidem";
    }

    setErrors(novoErros);
    return Object.keys(novoErros).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      show("Por favor, corrija os erros no formulário", true);
      return;
    }

    try {
      await registrar({
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        localizacao: `${form.municipio.trim()}, ${form.estado}`,
        cpfCnpj: form.cpf.trim(),
        tipoConta: "Produtor",
        senha: form.senha,
      });
      await fazerLogout();
      show("Cadastro realizado com sucesso! Faça login para acessar sua conta.", false);
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
        <h1 className={styles.title}>Cadastro de Produtor</h1>
      </header>

      <form className={styles.body} onSubmit={submit} noValidate>
        <div className={styles.fieldBlock}>
          <label htmlFor="nome">
            Nome Completo <span className={styles.req}>*</span>
          </label>
          <input
            id="nome"
            className={`${styles.input} ${errors.nome ? styles.inputError : ""}`}
            type="text"
            placeholder="Digite seu nome completo"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
          />
          {errors.nome && <span className={styles.errorMsg}>{errors.nome}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="email">
            Email <span className={styles.req}>*</span>
          </label>
          <input
            id="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="telefone">
            Telefone <span className={styles.req}>*</span>
          </label>
          <input
            id="telefone"
            className={`${styles.input} ${errors.telefone ? styles.inputError : ""}`}
            type="tel"
            placeholder="(00) 00000-0000"
            value={form.telefone}
            onChange={(e) => {
              const value = e.target.value;
              set("telefone", formatarTelefone(value));
            }}
          />
          {errors.telefone && <span className={styles.errorMsg}>{errors.telefone}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="cpf">
            CPF <span className={styles.req}>*</span>
          </label>
          <input
            id="cpf"
            className={`${styles.input} ${errors.cpf ? styles.inputError : ""}`}
            type="text"
            placeholder="000.000.000-00"
            value={form.cpf}
            onChange={(e) => {
              const value = e.target.value;
              set("cpf", formatarCPF(value));
            }}
          />
          {errors.cpf && <span className={styles.errorMsg}>{errors.cpf}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="estado">
            Estado <span className={styles.req}>*</span>
          </label>
          <select
            id="estado"
            className={`${styles.select} ${errors.estado ? styles.inputError : ""}`}
            value={form.estado}
            onChange={(e) => set("estado", e.target.value)}
          >
            <option value="">Selecione um estado</option>
            {obterEstados().map((estado) => (
              <option key={estado.code} value={estado.code}>
                {estado.name} ({estado.code})
              </option>
            ))}
          </select>
          {errors.estado && <span className={styles.errorMsg}>{errors.estado}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="municipio">
            Município <span className={styles.req}>*</span>
          </label>
          <input
            id="municipio"
            className={`${styles.input} ${errors.municipio ? styles.inputError : ""}`}
            type="text"
            placeholder="Digite o município"
            value={form.municipio}
            onChange={(e) => set("municipio", e.target.value)}
          />
          {errors.municipio && <span className={styles.errorMsg}>{errors.municipio}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="senha">
            Senha <span className={styles.req}>*</span>
          </label>
          <input
            id="senha"
            className={`${styles.input} ${errors.senha ? styles.inputError : ""}`}
            type="password"
            placeholder="Mínimo 1 letra, 1 número e 1 caractere especial"
            value={form.senha}
            onChange={(e) => set("senha", e.target.value)}
            autoComplete="new-password"
          />
          {errors.senha && <span className={styles.errorMsg}>{errors.senha}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="conf">
            Confirmar Senha <span className={styles.req}>*</span>
          </label>
          <input
            id="conf"
            className={`${styles.input} ${errors.conf ? styles.inputError : ""}`}
            type="password"
            placeholder="Digite a senha novamente"
            value={form.conf}
            onChange={(e) => set("conf", e.target.value)}
            autoComplete="new-password"
          />
          {errors.conf && <span className={styles.errorMsg}>{errors.conf}</span>}
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
