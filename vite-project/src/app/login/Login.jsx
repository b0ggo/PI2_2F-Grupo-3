import React from "react";
import "./Login.css";

export default function Login() {
  return (
    <div className="container">
      <div className="card">
        
        <div className="logo">
          <div className="icon">🏠</div>
          <h1>AgroManager</h1>
          <p>Gestão Rural Simplificada</p>
        </div>

        <form>
          <label>Enviar e-mail ou usuário</label>
          <input type="text" placeholder="Digite seu e-mail" />

          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha" />

          <a href="#" className="forgot">Esqueci minha senha</a>

          <button type="submit" className="btn-primary">Entrar</button>
        </form>

        <p className="no-account">Não tem conta?</p>

        <button className="btn-outline">Cadastro de Produtor</button>
        <button className="btn-outline">Cadastro de Empresa/Cooperativa</button>

      </div>
    </div>
  );
}