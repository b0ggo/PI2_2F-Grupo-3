import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import { ROUTES } from "../../constants/routes.js";
import { getPerfil, savePerfil, PERFIL_VAZIO, resolveUserMode } from "../../services/perfil.js";
import "./EditarPerfil.css";

const MAX_FOTO_BYTES = 500 * 1024;

export default function EditarPerfil() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dados, setDados] = useState(PERFIL_VAZIO);
  const [modo, setModo] = useState("produtor");
  const [salvando, setSalvando] = useState(false);
  const [erroFoto, setErroFoto] = useState("");

  useEffect(() => {
    getPerfil().then((perfil) => {
      setDados(perfil);
      setModo(resolveUserMode(perfil));
    });
  }, []);

  function atualizarCampo(campo, valor) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleFotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErroFoto("");

    if (!file.type.startsWith("image/")) {
      setErroFoto("Selecione um arquivo de imagem.");
      return;
    }

    if (file.size > MAX_FOTO_BYTES) {
      setErroFoto("A imagem deve ter no máximo 500 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => atualizarCampo("fotoPerfil", ev.target.result);
    reader.readAsDataURL(file);
  }

  function removerFoto() {
    atualizarCampo("fotoPerfil", "");
    setErroFoto("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

          <div className="editar-perfil-foto">
            <div className="editar-perfil-foto-preview">
              {dados.fotoPerfil ? (
                <img src={dados.fotoPerfil} alt="" />
              ) : (
                <span>?</span>
              )}
            </div>
            <div className="editar-perfil-foto-actions">
              <button
                type="button"
                className="editar-perfil-foto-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Escolher foto
              </button>
              {dados.fotoPerfil && (
                <button
                  type="button"
                  className="editar-perfil-foto-remove"
                  onClick={removerFoto}
                >
                  Remover
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFotoChange}
              />
              {erroFoto && <p className="editar-perfil-foto-erro">{erroFoto}</p>}
            </div>
          </div>

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

      <BottomNav mode={modo === "cooperativa" ? "cooperativa" : "produtor"} />
    </div>
  );
}
