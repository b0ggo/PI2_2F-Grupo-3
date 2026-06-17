import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import { Link } from "react-router-dom";
import { getPerfil, setLoginTipoConta, resolveUserMode } from "../../services/perfil.js";
import {
  associateProducerByEmail,
  getCooperativaProdutores,
  removeCooperativaProdutor,
} from "../../services/api.js";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import { ROUTES } from "../../constants/routes.js";
import styles from "./Cooperativa.module.css";

export default function Cooperativa() {
  const navigate = useNavigate();
  const [produtores, setProdutores] = useState([]);
  const [showAdicionarProdutor, setShowAdicionarProdutor] = useState(false);
  const [novoProdutorEmail, setNovoProdutorEmail] = useState("");
  const [erroAdicionar, setErroAdicionar] = useState("");
  const [adicionando, setAdicionando] = useState(false);
  const [removendoId, setRemovendoId] = useState(null);

  useEffect(() => {
    let mounted = true;
    getPerfil().then((p) => {
      if (!mounted) return;
      const modo = resolveUserMode(p);
      if (modo !== "cooperativa") {
        navigate(ROUTES.HOME);
        return;
      }
      setLoginTipoConta("cooperativa");
    }).catch(() => {
      navigate(ROUTES.HOME);
    });
    return () => { mounted = false };
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    async function loadProdutores() {
      try {
        const items = await getCooperativaProdutores();
        if (!mounted) return;
        setProdutores(items);
      } catch (err) {
        if (!mounted) return;
        setErroAdicionar("Não foi possível carregar produtores.");
      }
    }

    loadProdutores();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem('bottomNavMode', 'cooperativa'); } catch(e) {}
  }, []);

  async function handleAdicionar() {
    setShowAdicionarProdutor(true);
  }

  async function handleRemover(produtor) {
    if (!window.confirm("Tem certeza que deseja remover este produtor?")) return;
    setErroAdicionar("");
    setRemovendoId(produtor.id);

    try {
      await removeCooperativaProdutor(produtor.id);
      setProdutores((current) => current.filter((p) => p.id !== produtor.id));
    } catch (err) {
      setErroAdicionar(err.message || "Erro ao remover produtor.");
    } finally {
      setRemovendoId(null);
    }
  }

  async function handleSubmitAdicionar(e) {
    e.preventDefault();
    setErroAdicionar("");

    if (!novoProdutorEmail.trim()) {
      setErroAdicionar("Preencha o email do produtor.");
      return;
    }

    setAdicionando(true);
    try {
      await associateProducerByEmail({ email: novoProdutorEmail.trim() });
      const items = await getCooperativaProdutores();
      setProdutores(items);
      setShowAdicionarProdutor(false);
      setNovoProdutorEmail("");
      setErroAdicionar("");
    } catch (err) {
      setErroAdicionar(err.message || "Erro ao adicionar produtor.");
    } finally {
      setAdicionando(false);
    }
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
              <div key={p.id} className={styles.item}>
                <Link className={styles.itemLink} to={`/produtor/${p.id}`}>
                  <div className={styles.info}>
                    <div className={styles.name}>{p.nome}</div>
                    <div className={styles.meta}>{p.email}</div>
                    {p.cpfCnpj && <div className={styles.meta}>{p.cpfCnpj}</div>}
                  </div>
                </Link>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemover(p)}
                  disabled={removendoId === p.id}
                >
                  {removendoId === p.id ? "Removendo..." : "Remover"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdicionarProdutor && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <h2>Adicionar Produtor</h2>
            <form onSubmit={handleSubmitAdicionar}>
              <div className={styles.field}>
                <label htmlFor="produto-email">Email do produtor</label>
                <input
                  id="produto-email"
                  type="email"
                  value={novoProdutorEmail}
                  onChange={(e) => setNovoProdutorEmail(e.target.value)}
                  placeholder="email@produtor.com"
                />
              </div>
              {erroAdicionar && <p className={styles.errorText}>{erroAdicionar}</p>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowAdicionarProdutor(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={adicionando}>
                  {adicionando ? "Adicionando..." : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav mode="cooperativa" />
    </div>
  );
}
