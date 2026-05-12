import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";
import "./BottomNav.css";

function Icon({ d, size = 22, color = "currentColor", strokeWidth = 2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

const TABS = [
  { to: ROUTES.HOME, end: true, label: "Início", icon: ICONS.home },
  { to: ROUTES.CONSULTAR, label: "Buscar", icon: ICONS.search },
  { to: ROUTES.NOTIFICACAO, label: "Alertas", icon: ICONS.bell },
  { to: ROUTES.CHAT, label: "Chat", icon: ICONS.chat },
  { to: ROUTES.PERFIL, label: "Perfil", icon: ICONS.user },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Menu principal">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}
        >
          {({ isActive }) => (
            <>
              <Icon
                d={t.icon}
                size={20}
                color={isActive ? "#16a34a" : "#9ca3af"}
              />
              {t.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
