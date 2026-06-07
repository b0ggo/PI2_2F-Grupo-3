import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import { ROUTES } from "../../constants/routes.js";
import { getStats } from "../../services/api.js";
import { getPerfil, PERFIL_VAZIO, fazerLogout } from "../../services/perfil.js";
import "./Perfil.css";

function Icon({ children, size = 18, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export default function Perfil() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dados, setDados] = useState(PERFIL_VAZIO);
  const [stats, setStats] = useState({ animais: 0, lotes: 0, vacinas: 0 });

  useEffect(() => {
    getPerfil().then(setDados);
    getStats().then(setStats).catch(() => {});
  }, [location.key]);

  function exibir(valor) {
    return valor || "Não informado";
  }

  return (
    <div className="perfil-container">
      <div className="perfil-hero-wrap">
        <Header
          layout="hero"
          titulo={dados.nome || "Nome não informado"}
          subtitulo={dados.email || "Email não informado"}
        >
          <div className="perfil-avatar">
            <Icon size={36}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </Icon>
          </div>
        </Header>
      </div>

      <div className="perfil-sheet">
        <div className="tipo-conta">
          <span>Tipo de Conta:</span>
          <div className="badge">{exibir(dados.tipoConta)}</div>
        </div>
      </div>

      <div className="card-info">
        <h3>Informações Pessoais</h3>

        <div className="info-item">
          <Icon className="icon">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </Icon>
          <div className="info-item-content">
            <span>Nome</span>
            <p>{exibir(dados.nome)}</p>
          </div>
        </div>

        <div className="linha" />

        <div className="info-item">
          <Icon className="icon">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
          </Icon>
          <div className="info-item-content">
            <span>Email</span>
            <p>{exibir(dados.email)}</p>
          </div>
        </div>

        <div className="linha" />

        <div className="info-item">
          <Icon className="icon">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </Icon>
          <div className="info-item-content">
            <span>Telefone</span>
            <p>{exibir(dados.telefone)}</p>
          </div>
        </div>

        <div className="linha" />

        <div className="info-item">
          <Icon className="icon">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </Icon>
          <div className="info-item-content">
            <span>Localização</span>
            <p>{exibir(dados.localizacao)}</p>
          </div>
        </div>

        <div className="linha" />

        <div className="info-item">
          <Icon className="icon">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </Icon>
          <div className="info-item-content">
            <span>CPF/CNPJ</span>
            <p>{exibir(dados.cpfCnpj)}</p>
          </div>
        </div>

      </div>

      <div className="menu-card">
        <button
          type="button"
          className="menu-item"
          onClick={() => navigate(ROUTES.EDITAR_PERFIL)}
        >
          <div className="menu-left">
            <Icon size={20}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </Icon>

            <span>Editar Perfil</span>
          </div>

          <Icon size={18}>
            <polyline points="9 18 15 12 9 6" />
          </Icon>
        </button>
      </div>

      <div className="estatisticas">
        <h3>Estatísticas</h3>

        <div className="stats-grid">
          <div className="stat-card">
            <h2>{stats.animais}</h2>
            <p>Animais</p>
          </div>

          <div className="stat-card">
            <h2>{stats.lotes}</h2>
            <p>Lotes</p>
          </div>

          <div className="stat-card">
            <h2>{stats.vacinas}</h2>
            <p>Vacinas</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn-sair"
        onClick={async () => {
          await fazerLogout();
          navigate(ROUTES.LOGIN);
        }}
      >
        <Icon size={18}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </Icon>
        Sair da Conta
      </button>

      <BottomNav />
    </div>
  );
}
