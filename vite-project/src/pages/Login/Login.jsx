import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-root">
    <div className="container">
      <div className="card">

        <div className="logo">
          
          <h1>AgroGestor</h1>
          <p>Gestão Rural Simplificada</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <label>Email ou Usuário</label>
          <input type="text" placeholder="Digite seu email" />

          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha" />

          <a href="#" className="forgot">Esqueci minha senha</a>

          <Link to={ROUTES.HOME} className="btn-primary">
            Entrar
          </Link>
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
