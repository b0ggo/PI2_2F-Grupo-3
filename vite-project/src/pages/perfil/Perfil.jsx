import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import { ROUTES } from "../../constants/routes.js";
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

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-avatar">
          <Icon size={36}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </Icon>
        </div>

        <h2>João Silva</h2>
        <p>joao.silva@email.com</p>
      </div>

      <div className="tipo-conta">
        <span>Tipo de Conta:</span>
        <div className="badge">Produtor Rural</div>
      </div>

      <div className="card-info">
        <h3>Informações Pessoais</h3>

        <div className="info-item">
          <Icon className="icon">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
          </Icon>
          <div>
            <span>Email</span>
            <input type="email" placeholder="Digite seu email" />
          </div>
        </div>

        <div className="linha" />

        <div className="info-item">
          <Icon className="icon">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </Icon>
          <div>
            <span>Telefone</span>
            <input type="text" placeholder="Digite seu telefone" />
          </div>
        </div>

        <div className="linha" />

        <div className="info-item">
          <Icon className="icon">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </Icon>
          <div>
            <span>Localização</span>
            <input type="text" placeholder="Digite sua localização" />
          </div>
        </div>

        <div className="linha" />

        <div className="info-item">
          <Icon className="icon">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </Icon>
          <div>
            <span>CPF/CNPJ</span>
            <input type="text" placeholder="Digite seu CPF ou CNPJ" />
          </div>
        </div>
      </div>

      <div className="menu-card">
        <button type="button" className="menu-item">
          <div className="menu-left">
            <Icon size={16}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </Icon>
            <span>Editar Perfil</span>
          </div>
          <Icon size={14}>
            <polyline points="9 18 15 12 9 6" />
          </Icon>
        </button>

        <button type="button" className="menu-item">
          <div className="menu-left">
            <Icon size={16}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </Icon>
            <span>Notificações por Email</span>
          </div>
          <Icon size={14}>
            <polyline points="9 18 15 12 9 6" />
          </Icon>
        </button>

        <button type="button" className="menu-item">
          <div className="menu-left">
            <Icon size={16}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </Icon>
            <span>Alterar Telefone</span>
          </div>
          <Icon size={14}>
            <polyline points="9 18 15 12 9 6" />
          </Icon>
        </button>
      </div>

      <div className="estatisticas">
        <h3>Estatísticas</h3>

        <div className="stats-grid">
          <div className="stat-card verde">
            <h2>245</h2>
            <p>Animais</p>
          </div>

          <div className="stat-card azul">
            <h2>12</h2>
            <p>Lotes</p>
          </div>

          <div className="stat-card roxo">
            <h2>156</h2>
            <p>Vacinas</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn-sair"
        onClick={() => navigate(ROUTES.LOGIN)}
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
