import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput/PasswordInput.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { ROUTES } from "../../constants/routes.js";
import { registrar, fazerLogout } from "../../services/perfil.js";
import {
  validarNome,
  validarEmail,
  validarTelefone,
  validarCnpj,
  validarSenha,
  obterEstados,
  validarEstado,
  validarMunicipio,
  formatarTelefone,
  formatarCNPJ,
} from "../../services/validations.js";
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
  const { showToast } = useToast();
  const [form, setForm] = useState({
    nome: "",
    tipo: TIPOS[0],
    cnpj: "",
    email: "",
    telefone: "",
    estado: "",
    municipio: "",
    senha: "",
    conf: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validateForm = () => {
    const newErrors = {};

    if (!validarNome(form.nome)) {
      newErrors.nome = "O nome deve conter pelo menos 2 palavras";
    }

    if (form.tipo === TIPOS[0]) {
      newErrors.tipo = "Selecione um tipo de empresa";
    }

    if (!validarCnpj(form.cnpj)) {
      newErrors.cnpj = "CNPJ inválido. Deve ter 14 dígitos válidos";
    }

    if (!validarEmail(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!validarTelefone(form.telefone)) {
      newErrors.telefone = "Telefone deve ter no mínimo 10 dígitos";
    }

    if (!validarEstado(form.estado)) {
      newErrors.estado = "Selecione um estado válido";
    }

    if (!validarMunicipio(form.municipio)) {
      newErrors.municipio = "Município inválido";
    }

    if (!validarSenha(form.senha)) {
      newErrors.senha =
        "Senha deve ter pelo menos 1 letra, 1 número e 1 caractere especial (!@#$%^&*)";
    }

    if (form.senha !== form.conf) {
      newErrors.conf = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("Por favor, corrija os erros no formulário", "error");
      return;
    }

    try {
      await registrar({
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        localizacao: `${form.municipio.trim()}, ${form.estado}`,
        cpfCnpj: form.cnpj.trim(),
        tipoConta: form.tipo,
        senha: form.senha,
      });
      await fazerLogout();
      showToast("Cadastro realizado com sucesso!", "success");
      navigate(ROUTES.LOGIN);
    } catch (err) {
      showToast(err.message || "Erro ao cadastrar.", "error");
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
          <input
            id="nome"
            className={`${styles.input} ${errors.nome ? styles.inputError : ""}`}
            placeholder="Digite o nome da empresa"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
          />
          {errors.nome && <span className={styles.errorMsg}>{errors.nome}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="tipo">
            Tipo de Empresa <span className={styles.req}>*</span>
          </label>
          <select
            id="tipo"
            className={`${styles.select} ${errors.tipo ? styles.inputError : ""}`}
            value={form.tipo}
            onChange={(e) => set("tipo", e.target.value)}
          >
            {TIPOS.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
          {errors.tipo && <span className={styles.errorMsg}>{errors.tipo}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="cnpj">
            CNPJ <span className={styles.req}>*</span>
          </label>
          <input
            id="cnpj"
            className={`${styles.input} ${errors.cnpj ? styles.inputError : ""}`}
            placeholder="00.000.000/0000-00"
            value={form.cnpj}
            onChange={(e) => set("cnpj", formatarCNPJ(e.target.value))}
          />
          {errors.cnpj && <span className={styles.errorMsg}>{errors.cnpj}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="email">
            Email <span className={styles.req}>*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            placeholder="empresa@email.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="tel">
            Telefone <span className={styles.req}>*</span>
          </label>
          <input
            id="tel"
            className={`${styles.input} ${errors.telefone ? styles.inputError : ""}`}
            placeholder="(00) 00000-0000"
            value={form.telefone}
            onChange={(e) => set("telefone", formatarTelefone(e.target.value))}
          />
          {errors.telefone && <span className={styles.errorMsg}>{errors.telefone}</span>}
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
          <PasswordInput
            id="senha"
            className={`${styles.input} ${errors.senha ? styles.inputError : ""}`}
            placeholder="Mínimo 1 letra, 1 número e 1 caractere especial"
            value={form.senha}
            onChange={(e) => set("senha", e.target.value)}
            autoComplete="new-password"
            invalid={Boolean(errors.senha)}
          />
          {errors.senha && <span className={styles.errorMsg}>{errors.senha}</span>}
        </div>

        <div className={styles.fieldBlock}>
          <label htmlFor="conf">
            Confirmar Senha <span className={styles.req}>*</span>
          </label>
          <PasswordInput
            id="conf"
            className={`${styles.input} ${errors.conf ? styles.inputError : ""}`}
            placeholder="Digite a senha novamente"
            value={form.conf}
            onChange={(e) => set("conf", e.target.value)}
            autoComplete="new-password"
            invalid={Boolean(errors.conf)}
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
    </div>
  );
}
