import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import { Link } from "react-router-dom";
import { getPerfil } from "../../services/perfil.js";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import { ROUTES } from "../../constants/routes.js";
import styles from "./Cooperativa.module.css";

const STORAGE_KEY = "cooperativa:produtores";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function Cooperativa() {
  const navigate = useNavigate();
  const [produtores, setProdutores] = useState([]);

  useEffect(() => {
    let mounted = true;
    getPerfil().then((p) => {
      if (!mounted) return;
      if ((p.tipoConta || "").toLowerCase() !== "cooperativa") {
        navigate(ROUTES.HOME);
      }
    }).catch(() => {
      navigate(ROUTES.HOME);
    });
    return () => { mounted = false };
  }, [navigate]);

  useEffect(() => {
    setProdutores(load());
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem('bottomNavMode', 'cooperativa'); } catch(e) {}
  }, []);

  function handleRemover(id) {
    if (!window.confirm("Remover produtor?")) return;
    const next = produtores.filter((p) => p.id !== id);
    setProdutores(next);
    save(next);
  }

  function handleAdicionar() {
    navigate(ROUTES.CADASTRO_PRODUTOR);
  }

  return (
    <div className={`app-page ${styles.page}`}>
      <div className={styles.card}>
        <Header titulo="Produtores" voltarPara={ROUTES.HOME} />

        <div className={styles.body}>
          <div className={styles.toolbar}>
            <button className={styles.btn} onClick={handleAdicionar}>Adicionar Produtor</button>
          </div>

          <div className={styles.list}>
            {produtores.length === 0 && (
              <p className={styles.empty}>Nenhum produtor cadastrado.</p>
            )}

            {produtores.map((p) => (
              <Link key={p.id} className={styles.item} to={`/produtor/${p.id}`}>
                <div className={styles.info}>
                  <div className={styles.name}>{p.nome}</div>
                  <div className={styles.meta}>{p.cpfCnpj || p.cpf} • {p.telefone}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNav mode="cooperativa" />
    </div>
  );
}
