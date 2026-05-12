import { useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import { ROUTES } from "../../constants/routes.js";
import "./Vacinacao.css";

export default function Vacinacao() {
  const [aba, setAba] = useState("registrar");

  return (
    <div className="pagina">

      <header className="topo">
        <Link to={ROUTES.HOME} className="voltar" aria-label="Voltar ao início">
          ←
        </Link>
        <h2>Vacinação</h2>
      </header>

      <div className="abas">

        <button
          type="button"
          className={aba === "registrar" ? "ativa" : ""}
          onClick={() => setAba("registrar")}
        >
          Registrar
        </button>

        <button
          type="button"
          className={aba === "historico" ? "ativa" : ""}
          onClick={() => setAba("historico")}
        >
          Histórico
        </button>

      </div>

      {aba === "registrar" && (

        <section className="formulario">

          <label>Animal/Lote *</label>

          <select>
            <option>Selecione o animal ou lote</option>
            <option>Lote A</option>
            <option>Bovino 01</option>
          </select>

          <label>Tipo de Vacina *</label>

          <select>
            <option>Selecione a vacina</option>
            <option>Febre Aftosa</option>
            <option>Brucelose</option>
            <option>Peste Suína</option>
          </select>

          <div className="datas">

            <div>
              <label>Data de Aplicação</label>
              <input type="date" />
            </div>

            <div>
              <label>Próxima Dose</label>
              <input type="date" />
            </div>

          </div>

          <label>Observações</label>

          <textarea
            placeholder="Informações adicionais sobre a vacinação..."
          />

          <button type="button" className="botao">
            Registrar Vacina
          </button>

        </section>

      )}

      {aba === "historico" && (

        <section>

          <div className="card urgente">

            <span className="tag">
              Urgente
            </span>

            <h3>Febre Aftosa</h3>

            <p>BR-001234</p>

            <p>
              Aplicada em: 14/10/2025
            </p>

            <p className="alerta">
              Próxima dose: 14/04/2026
              (em -11 dias)
            </p>

          </div>

          <div className="card">

            <h3>Brucelose</h3>

            <p>BR-001235</p>

            <p>
              Aplicada em: 19/08/2025
            </p>

            <p>
              Próxima dose: 19/08/2026
            </p>

          </div>

          <div className="card urgente">

            <span className="tag">
              Urgente
            </span>

            <h3>Peste Suína</h3>

            <p>Lote A - Janeiro</p>

            <p>
              Aplicada em: 09/11/2025
            </p>

            <p className="alerta">
              Próxima dose: 09/02/2026
              (em -75 dias)
            </p>

          </div>

        </section>

      )}

      <BottomNav />
    </div>
  );
}
