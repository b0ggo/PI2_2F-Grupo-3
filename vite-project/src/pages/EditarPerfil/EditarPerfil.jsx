import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import { ROUTES } from "../../constants/routes.js";
import { getPerfil, savePerfil, PERFIL_VAZIO } from "../../services/perfil.js";
import "./EditarPerfil.css";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(PERFIL_VAZIO);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    getPerfil().then(setDados);
  }, []);

  function atualizarCampo(campo, valor) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }

  async function salvarPerfil() {
    setSalvando(true);
    try {
      await savePerfil(dados);
      navigate(ROUTES.PERFIL);
    } finally {
      setSalvando(false);
    }
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
            value={dados.nome}
            onChange={(e) => atualizarCampo("nome", e.target.value)}
            placeholder="Digite seu nome"
          />

          <label>Email</label>
          <input
            type="email"
            value={dados.email}
            onChange={(e) => atualizarCampo("email", e.target.value)}
            placeholder="Digite seu email"
          />

          <label>Telefone</label>
          <input
            type="tel"
            value={dados.telefone}
            onChange={(e) => atualizarCampo("telefone", e.target.value)}
            placeholder="Digite seu telefone"
          />

          <label>Localização</label>
          <input
            type="text"
            value={dados.localizacao}
            onChange={(e) => atualizarCampo("localizacao", e.target.value)}
            placeholder="Cidade / Estado"
          />

          <label>CPF/CNPJ</label>
          <input
            type="text"
            value={dados.cpfCnpj}
            onChange={(e) => atualizarCampo("cpfCnpj", e.target.value)}
            placeholder="Digite seu CPF ou CNPJ"
          />

          <button
            type="button"
            className="editar-perfil-btn"
            onClick={salvarPerfil}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>

        </div>
      </div>

      <BottomNav mode="produtor" />
    </div>
  );
}
