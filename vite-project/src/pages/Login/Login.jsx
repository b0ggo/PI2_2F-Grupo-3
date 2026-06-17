import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import { login, setLoginTipoConta as setLoginTipoContaStorage } from "../../services/perfil.js";
import logo from "../../imagens/logo.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [loginTipoConta, setLoginTipoConta] = useState("produtor");

  const emailPlaceholder = loginTipoConta === "cooperativa"
    ? "Email da empresa ou cooperativa"
    : "Digite seu email";

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha email e senha.");
      return;
    }

    setCarregando(true);
    try {
      const result = await login(email, senha);
      const tipoConta = (result.perfil?.tipoConta || "").toLowerCase();
      const modo = tipoConta === "produtor" ? "produtor" : "cooperativa";
      setLoginTipoContaStorage(modo);
      navigate(ROUTES.HOME);
    } catch (err) {
      setErro(err.message || "Email ou senha incorretos.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-root">
      <div className="container">
        <div className="card">

          <div className="logo">
            <img
              src={logo}
              alt="Logo"
              className="logo-img"
            />
            <p>Gestão Rural Simplificada</p>
          </div>

          <div className="login-mode-toggle">
            <div className="login-mode-label">Entrar como</div>
            <button
              type="button"
              className={loginTipoConta === "produtor" ? "active" : ""}
              onClick={() => setLoginTipoConta("produtor")}
            >
              Produtor
            </button>
            <button
              type="button"
              className={loginTipoConta === "cooperativa" ? "active" : ""}
              onClick={() => setLoginTipoConta("cooperativa")}
            >
              Empresa / Cooperativa
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email ou Usuário</label>
            <input
              id="email"
              type="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />

            {erro && <p className="login-erro">{erro}</p>}

            <Link to={ROUTES.ESQUECI_SENHA} className="forgot">
              Esqueci minha senha
            </Link>

            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="no-account">Não tem conta?</p>

          <Link to={ROUTES.CADASTRO_PRODUTOR} className="btn-outline">
            Cadastro de Produtor
          </Link>

          <Link to={ROUTES.CADASTRO_EMPRESA} className="btn-outline">
            Cadastro de Empresa/Cooperativa
          </Link>

        </div>
      </div>
    </div>
  );
}
