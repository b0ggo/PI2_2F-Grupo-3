import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AnimalCadastro.css";

export default function AnimalCadastro() {
  const [tipo, setTipo] = useState("");
  const navigate = useNavigate();

  return (
    <div className="container">

      <div className="header">
        <Link to="/login" className="back">←</Link>
        <h2>Animal Cadastral</h2>
      </div>

      <div className="content">

        <div className="top-buttons">
          <button type="button" className="btn-top">📷 Código QR</button>
          <button type="button" className="btn-top">🔢 Código</button>
        </div>

        <p className="label-center">Tipo de Animal *</p>

        <div className="tipo-container">
          {["Suíno", "Vaca", "Garoto"].map((item) => (
            <button
              key={item}
              type="button"
              className={`tipo-btn ${tipo === item ? "ativo" : ""}`}
              onClick={() => setTipo(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="label-center">Identificação *</p>
        <input className="input" placeholder="Ex: BR 001234" />

        <p className="label-center">Raça *</p>
        <input className="input" />

        <div className="row-label">
          <p>Idade (meses)</p>
          <p>Peso (kg)</p>
        </div>

        <div className="row">
          <input className="input" placeholder="Ex: 12" />
          <input className="input" placeholder="Ex: 450" />
        </div>

        <p className="label-center">Histórico de Saúde</p>
        <textarea
          className="input textarea"
          placeholder="Observações sobre a saúde do animal..."
        />

        <div className="actions">
          <button type="button" className="cancel" onClick={() => navigate("/login")}>
            Cancelar
          </button>
          <button type="button" className="save">Salvar</button>
        </div>

      </div>
    </div>
  );
}
