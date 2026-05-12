import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import "./Alertas.css";

const ITENS = [
  {
    id: 1,
    titulo: "Febre Aftosa — BR-001234",
    detalhe: "Próxima dose em 11 dias",
    urgente: true,
  },
  {
    id: 2,
    titulo: "Peste Suína — Lote A",
    detalhe: "Reforço vencido há 75 dias",
    urgente: true,
  },
  {
    id: 3,
    titulo: "Brucelose — BR-001235",
    detalhe: "Próxima dose em agosto/2026",
    urgente: false,
  },
];

export default function Alertas() {
  return (
    <div className="alertas-page">
      <header className="alertas-header">
        <h1 className="alertas-title">Alertas</h1>
        <p className="alertas-sub">
          Vacinas e compromissos que precisam da sua atenção.
        </p>
      </header>

      <ul className="alertas-list">
        {ITENS.map((item) => (
          <li
            key={item.id}
            className={`alertas-card${item.urgente ? " alertas-card--urgente" : ""}`}
          >
            {item.urgente && (
              <span className="alertas-tag">Urgente</span>
            )}
            <h2 className="alertas-card-title">{item.titulo}</h2>
            <p className="alertas-card-detail">{item.detalhe}</p>
          </li>
        ))}
      </ul>

      <BottomNav />
    </div>
  );
}
