import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header.jsx";
import BottomNav from "../../../components/BottomNav/BottomNav.jsx";
import { getCooperativaProdutores, getLotes } from "../../../services/api.js";
import styles from "./Produtor.module.css";

export default function Produtor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produtor, setProdutor] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [carregandoLotes, setCarregandoLotes] = useState(false);
  const [lotesErro, setLotesErro] = useState("");

  useEffect(() => {
    if (!id) return;
    setProdutor(null);
    setLotes([]);
    setLotesErro("");

    async function loadProdutorDetalhes() {
      try {
        const producers = await getCooperativaProdutores();
        const current = producers.find((p) => p.id === id) || null;
        setProdutor(current);

        if (!current) {
          return;
        }

        setCarregandoLotes(true);
        const allLotes = await getLotes();
        setLotes(allLotes.filter((lote) => lote.userId === id));
      } catch (err) {
        setLotesErro(err.message || "Erro ao carregar produtor ou lotes.");
      } finally {
        setCarregandoLotes(false);
      }
    }

    loadProdutorDetalhes();
  }, [id]);

  if (!produtor) {
    return (
      <div className={`app-page ${styles.page}`}>
        <div className={styles.card}>
          <Header layout="nav" titulo="Produtor" voltarPara="/cooperativa" />
          <div className={styles.body}>
            <p>Produtor não encontrado.</p>
            <button className={styles.btn} onClick={() => navigate(-1)}>Voltar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-page ${styles.page}`}>
      <div className={styles.card}>
        <Header layout="nav" titulo="Produtor" voltarPara="/cooperativa" />

        <div className={styles.body}>
          <h2 className={styles.name}>{produtor.nome}</h2>
          <p className={styles.meta}><strong>CPF/CNPJ:</strong> {produtor.cpfCnpj || produtor.cpf}</p>
          <p className={styles.meta}><strong>Telefone:</strong> {produtor.telefone}</p>
          {produtor.local && <p className={styles.meta}><strong>Local:</strong> {produtor.local}</p>}

          <div className={styles.loteSection}>
            <div className={styles.loteSectionHeader}>
              <h3 className={styles.loteTitle}>Lotes do produtor</h3>
              {!carregandoLotes && !lotesErro && (
                <span className={styles.loteCount}>{lotes.length}</span>
              )}
            </div>

            {carregandoLotes && <p className={styles.note}>Carregando lotes...</p>}
            {!carregandoLotes && lotesErro && <p className={styles.errorText}>{lotesErro}</p>}
            {!carregandoLotes && !lotesErro && lotes.length === 0 && (
              <p className={styles.note}>Nenhum lote encontrado para este produtor.</p>
            )}
            {!carregandoLotes && !lotesErro && lotes.length > 0 && (
              <div className={styles.loteList}>
                {lotes.map((lote) => (
                  <article key={lote.id} className={styles.loteCard}>
                    <div className={styles.loteCardHeader}>
                      <div>
                        <strong className={styles.loteName}>{lote.nome}</strong>
                        <p className={styles.loteType}>{lote.tipo}</p>
                      </div>
                    </div>

                    <div className={styles.loteStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Total</span>
                        <span className={styles.statValue}>{lote.total || lote.quantidade || 0}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Saudáveis</span>
                        <span className={styles.statValue}>{lote.saudaveis || 0}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Doentes</span>
                        <span className={styles.statValue}>{lote.doentes || 0}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Vacinados</span>
                        <span className={styles.statValue}>{lote.vacinados || 0}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Mortes</span>
                        <span className={styles.statValue}>{lote.mortes || 0}</span>
                      </div>
                    </div>

                    {lote.observacoes && (
                      <div className={styles.loteObservacoes}>
                        <strong className={styles.obsLabel}>Observações:</strong>
                        <p className={styles.obsText}>{lote.observacoes}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button className={styles.btn} onClick={() => navigate(-1)}>Voltar</button>
          </div>
        </div>
      </div>
      <BottomNav mode="cooperativa" />
    </div>
  );
}
