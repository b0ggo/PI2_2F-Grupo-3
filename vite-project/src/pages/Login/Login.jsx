import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import { login } from "../../services/perfil.js";
import logo from "../../imagens/logo.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha email e senha.");
      return;
    }

    setCarregando(true);
    try {
      await login(email, senha);
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

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email ou Usuário</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
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
