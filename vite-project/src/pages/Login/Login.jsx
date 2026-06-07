import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import { verificarLogin } from "../../services/perfil.js";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha email e senha.");
      return;
    }

    const valido = await verificarLogin(email, senha);
    if (!valido) {
      setErro("Email ou senha incorretos. Cadastre-se primeiro.");
      return;
    }

    navigate(ROUTES.HOME);
  }

  return (
    <div className="login-root">
      <div className="container">
        <div className="card">

          <div className="logo">
            <div className="logo-placeholder"></div>
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

            <a href="#" className="forgot">Esqueci minha senha</a>

            <button type="submit" className="btn-primary">
              Entrar
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
