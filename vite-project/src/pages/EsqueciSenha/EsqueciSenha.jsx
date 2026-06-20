import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import { redefinirSenha } from "../../services/api.js";
const LOGO_SRC = "/logo.svg";
import "./EsqueciSenha.css";

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [conf, setConf] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!email.trim()) {
      setErro("Informe seu email.");
      return;
    }
    if (senha.length < 6) {
      setErro("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (senha !== conf) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      await redefinirSenha(email.trim(), senha);
      setSucesso("Senha redefinida com sucesso! Redirecionando para o login…");
      window.setTimeout(() => navigate(ROUTES.LOGIN), 2200);
    } catch (err) {
      setErro(err.message || "Não foi possível redefinir a senha.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="esqueci-senha-page">
      <div className="esqueci-senha-container">
        <div className="esqueci-senha-card">
          <div className="esqueci-senha-logo">
            <img src={LOGO_SRC} alt="Logo AgroGestor" className="esqueci-senha-logo-img" />
            <h1>Recuperar senha</h1>
            <p>Informe seu email e defina uma nova senha</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email-recuperar">Email</label>
            <input
              id="email-recuperar"
              type="email"
              placeholder="Digite seu email cadastrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <label htmlFor="nova-senha">Nova senha</label>
            <input
              id="nova-senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="new-password"
            />

            <label htmlFor="conf-senha">Confirmar nova senha</label>
            <input
              id="conf-senha"
              type="password"
              placeholder="Digite a senha novamente"
              value={conf}
              onChange={(e) => setConf(e.target.value)}
              autoComplete="new-password"
            />

            {erro && <p className="esqueci-senha-erro">{erro}</p>}
            {sucesso && <p className="esqueci-senha-sucesso">{sucesso}</p>}

            <button
              type="submit"
              className="esqueci-senha-btn"
              disabled={carregando || Boolean(sucesso)}
            >
              {carregando ? "Salvando…" : "Redefinir senha"}
            </button>
          </form>

          <Link to={ROUTES.LOGIN} className="esqueci-senha-voltar">
            ← Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
