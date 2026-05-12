import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-root">
    <div className="container">
      <div className="card">

        <div className="logo">
          <div className="icon">🏠</div>
          <h1>AgroManager</h1>
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

        <button type="button" className="btn-outline">Cadastro de Produtor</button>
        <button type="button" className="btn-outline">Cadastro de Empresa/Cooperativa</button>

      </div>
    </div>
    </div>
  );
}
