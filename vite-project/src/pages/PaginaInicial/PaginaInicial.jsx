import { Link, useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import { ROUTES } from "../../constants/routes.js";
import "./PaginaInicial.css";

function Svg({ children, size = 22, stroke = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const ICON_BG = "var(--color-primary-soft)";
const ICON_STROKE = "var(--color-primary)";

const MENU = [
  {
    to: ROUTES.CADASTRO_ANIMAL,
    title: "Cadastrar Animal",
    desc: "Registrar novos animais",
    badge: null,
    icon: (
      <Svg stroke={ICON_STROKE}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </Svg>
    ),
  },
  {
    to: ROUTES.CADASTRO_LOTES,
    title: "Cadastrar Lote",
    desc: "Criar e gerenciar lotes",
    badge: null,
    icon: (
      <Svg stroke={ICON_STROKE}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </Svg>
    ),
  },
  {
    to: ROUTES.VACINACAO,
    title: "Vacinação",
    desc: "Registrar vacinas aplicadas",
    badge: null,
    icon: (
      <Svg stroke={ICON_STROKE}>
        <path d="m18 2 4 4" />
        <path d="m17 7 3-3" />
        <path d="M19 9 8 20l-4 1 1-4L16 5" />
        <path d="m9 11 6 6" />
      </Svg>
    ),
  },
  {
    to: ROUTES.NOTIFICACAO,
    title: "Notificações",
    desc: "Ver alertas e lembretes",
    badge: 3,
    icon: (
      <Svg stroke={ICON_STROKE}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </Svg>
    ),
  },
  {
    to: ROUTES.CHAT,
    title: "Chat",
    desc: "Conversar com empresas",
    badge: 2,
    icon: (
      <Svg stroke={ICON_STROKE}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </Svg>
    ),
  },
  {
    to: ROUTES.PERFIL,
    title: "Meu Perfil",
    desc: "Dados da conta",
    badge: null,
    icon: (
      <Svg stroke={ICON_STROKE}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </Svg>
    ),
  },
];

export default function PaginaInicial() {
  const navigate = useNavigate();

  return (
    <div className="home-app">
      <div className="home-app__hero">
        <Header layout="hero" titulo="Bem-vindo!" subtitulo="Produtor Rural" />
      </div>

      <div className="home-app__alert">
        <span className="home-app__alert-icon" aria-hidden>
          <Svg size={20} stroke="currentColor">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </Svg>
        </span>
        <div className="home-app__alert-body">
          <p className="home-app__alert-text">3 vacinas próximas do vencimento</p>
          <button
            type="button"
            className="home-app__alert-link"
            onClick={() => navigate(ROUTES.NOTIFICACAO)}
          >
            Ver detalhes
          </button>
        </div>
      </div>

      <nav className="home-app__menu" aria-label="Atalhos do produtor">
        {MENU.map((item) => (
          <Link key={item.to} to={item.to} className="home-menu-card">
            <div
              className="home-menu-card__icon"
              style={{ background: ICON_BG }}
            >
              {item.icon}
            </div>
            <div className="home-menu-card__content">
              <p className="home-menu-card__title">{item.title}</p>
              <p className="home-menu-card__desc">{item.desc}</p>
            </div>
            {item.badge != null && (
              <span className="home-menu-card__badge">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      <h2 className="home-app__resumo-title">Resumo</h2>
      <div className="home-app__resumo-row">
        <div className="home-stat home-stat--animais">
          <div className="home-stat__label">Animais</div>
          <div className="home-stat__value">245</div>
        </div>
        <div className="home-stat home-stat--lotes">
          <div className="home-stat__label">Lotes</div>
          <div className="home-stat__value">12</div>
        </div>
        <div className="home-stat home-stat--vac">
          <div className="home-stat__label">Vacinados</div>
          <div className="home-stat__value">89%</div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
