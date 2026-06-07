import { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import Header from "../../components/Header/Header.jsx";
import { getAlertas } from "../../services/api.js";
import "./Alertas.css";

export default function Alertas() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getAlertas()
      .then(setItens)
      .catch(() => setItens([]))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="alertas-page">
      <div className="alertas-card-shell">
        <Header
          layout="stack"
          titulo="Alertas"
          subtitulo="Vacinas e compromissos que precisam da sua atenção."
        />

        {carregando && (
          <p className="alertas-card-detail" style={{ padding: "16px 20px" }}>
            Carregando alertas…
          </p>
        )}

        {!carregando && itens.length === 0 && (
          <p className="alertas-card-detail" style={{ padding: "16px 20px" }}>
            Nenhum alerta no momento.
          </p>
        )}

        <ul className="alertas-list">
          {itens.map((item) => (
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
      </div>

      <BottomNav />
    </div>
  );
}
