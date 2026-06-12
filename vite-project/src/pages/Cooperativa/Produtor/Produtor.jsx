import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header.jsx";
import BottomNav from "../../../components/BottomNav/BottomNav.jsx";
import styles from "./Produtor.module.css";

function loadProdutor(id) {
  try {
    const list = JSON.parse(localStorage.getItem("cooperativa:produtores") || "[]");
    return list.find((p) => p.id === id) || null;
  } catch {
    return null;
  }
}

export default function Produtor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produtor, setProdutor] = useState(null);

  useEffect(() => {
    if (!id) return;
    setProdutor(loadProdutor(id));
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

          <div className={styles.actions}>
            <button className={styles.btn} onClick={() => navigate(-1)}>Voltar</button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
