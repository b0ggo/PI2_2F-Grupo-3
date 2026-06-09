import "./Alertas.css";

export default function Alertas() {
  const alertas = [
    {
      id: 1,
      titulo: "Vacina Próxima",
      descricao: "Febre Aftosa para BR-001234 vence em 5 dias",
      data: "19/03/2026",
      urgente: true,
      ativo: true,
      icone: "💉",
    },
    {
      id: 2,
      titulo: "Vacina Próxima",
      descricao: "Brucelose para Lote A vence em 15 dias",
      data: "18/03/2026",
      urgente: false,
      ativo: true,
      icone: "💉",
    },
    {
      id: 3,
      titulo: "Animal Doente",
      descricao: "BR-001235 apresenta sintomas - verificar",
      data: "17/03/2026",
      urgente: true,
      ativo: true,
      icone: "⚠️",
    },
    {
      id: 4,
      titulo: "Lote Cadastrado",
      descricao: "Lote B - Fevereiro foi cadastrado com sucesso",
      data: "16/03/2026",
      urgente: false,
      ativo: false,
      icone: "ℹ️",
    },
    {
      id: 5,
      titulo: "Vacina Aplicada",
      descricao: "Peste Suína aplicada no Lote A",
      data: "14/03/2026",
      urgente: false,
      ativo: false,
      icone: "💉",
    },
  ];

  return (
    <div className="alertas-page">
      <div className="alertas-header">
        <div className="titulo-area">
          <h2>Notificações</h2>
          <span className="badge">3 novas</span>
        </div>

        <div className="tabs">
          <button className="tab ativa">Todas</button>
          <button className="tab">Não Lidas</button>
        </div>
      </div>

      <div className="marcar">
        ✓ Marcar todas como lidas
      </div>

      <div className="lista-alertas">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className={`card-alerta ${
              alerta.ativo ? "ativo" : "inativo"
            }`}
          >
            <div className="icone-alerta">
              {alerta.icone}
            </div>

            <div className="conteudo-alerta">
              <div className="linha-titulo">
                <h3>{alerta.titulo}</h3>

                {alerta.urgente && (
                  <span className="urgente">
                    Urgente
                  </span>
                )}
              </div>

              <p>{alerta.descricao}</p>

              <span className="data">
                {alerta.data}
              </span>
            </div>

            {alerta.ativo && (
              <div className="ponto-verde"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}