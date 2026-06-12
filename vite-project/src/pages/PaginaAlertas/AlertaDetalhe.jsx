import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import { getAlertas } from "../../services/api.js";
import "./Alertas.css";

function carregarAlerta(id) {
  return getAlertas().then((list) => list.find((a) => String(a.id) === String(id)) || null);
}

export default function AlertaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    if (!id) return;
    carregarAlerta(id).then(setAlerta).catch(() => setAlerta(null));
  }, [id]);

  if (!alerta) {
    return (
      <div className="alertas-page">
        <div className="alertas-card">
          <Header layout="nav" titulo="Notificação" voltarPara="/alertas" />
          <div className="alertas-lista">
            <p className="alertas-estado">Notificação não encontrada.</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="alertas-page">
      <div className="alertas-card">
        <Header layout="nav" titulo={alerta.titulo} voltarPara="/alertas" />

        <div className="alertas-lista" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 8 }}>{alerta.tipo || "Alerta"}</div>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{alerta.detalhe}</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
