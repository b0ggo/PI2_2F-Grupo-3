import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import { ROUTES } from "../../constants/routes.js";
import "./EditarPerfil.css";

export default function EditarPerfil() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [cpf, setCpf] = useState("");

  function salvarPerfil() {
    localStorage.setItem(
      "perfilUsuario",
      JSON.stringify({
        nome,
        email,
        telefone,
        localizacao,
        cpf,
      })
    );

    navigate(ROUTES.PERFIL);
  }

  return (
    <div className="editar-perfil-page">
      <div className="editar-perfil-card">
        <Header
          titulo="Editar Perfil"
          voltarPara={ROUTES.PERFIL}
        />

        <div className="editar-perfil-body">

          <label>Nome Completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />

          <label>Telefone</label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Digite seu telefone"
          />

          <label>Localização</label>
          <input
            type="text"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            placeholder="Cidade / Estado"
          />

          <label>CPF/CNPJ</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite seu CPF ou CNPJ"
          />

          <button
            type="button"
            className="editar-perfil-btn"
            onClick={salvarPerfil}
          >
            Salvar Alterações
          </button>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}