import React, { useState } from "react";
import "./AnimalCadastro.css";

export default function AnimalCadastro() {
  const [tipo, setTipo] = useState("");

  return (
    <div className="container">

      <div className="header">
        <span className="back">←</span>
        <h2>Animal Cadastral</h2>
      </div>

      <div className="content">

        <div className="top-buttons">
          <button className="btn-top">📷 Código QR</button>
          <button className="btn-top">🔢 Código</button>
        </div>

        {/* 🔥 TIPO DE ANIMAL */}
        <p className="label-center">Tipo de Animal *</p>

        <div className="tipo-container">
          {["Suíno", "Vaca", "Garoto"].map((item) => (
            <button
              key={item}
              className={`tipo-btn ${tipo === item ? "ativo" : ""}`}
              onClick={() => setTipo(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* resto continua igual */}
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

        <div className="row">
          <input className="input" placeholder="Ex: 12" />
          <input className="input" placeholder="Ex: 450" />
        </div>

        <p className="label-center">Histórico de Saúde</p>
        <textarea
          className="input textarea"
          placeholder="Observações sobre a saúde do animal..."
        ></textarea>

        <div className="actions">
          <button className="cancel">Cancelar</button>
          <button className="save">Salvar</button>
        </div>

        

      </div>
    </div>
  );
}