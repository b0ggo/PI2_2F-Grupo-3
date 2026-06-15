import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import { Link } from "react-router-dom";
import { getPerfil } from "../../services/perfil.js";
import { validarLoginUsuario } from "../../services/api.js";
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
  const [showAdicionarProdutor, setShowAdicionarProdutor] = useState(false);
  const [novoProdutorEmail, setNovoProdutorEmail] = useState("");
  const [novoProdutorSenha, setNovoProdutorSenha] = useState("");
  const [erroAdicionar, setErroAdicionar] = useState("");
  const [adicionando, setAdicionando] = useState(false);

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

  async function handleAdicionar() {
    setShowAdicionarProdutor(true);
  }

  async function handleSubmitAdicionar(e) {
    e.preventDefault();
    setErroAdicionar("");

    if (!novoProdutorEmail.trim() || !novoProdutorSenha) {
      setErroAdicionar("Preencha email e senha do produtor.");
      return;
    }

    setAdicionando(true);
    try {
      const result = await validarLoginUsuario(novoProdutorEmail.trim(), novoProdutorSenha);
      const perfil = result.perfil || {};
      if ((perfil.tipoConta || "").toLowerCase() !== "produtor") {
        setErroAdicionar("A conta informada não é de um produtor.");
        return;
      }

      const novoProdutor = {
        id: perfil.id || perfil.email || novoProdutorEmail.trim(),
        nome: perfil.nome || perfil.email,
        email: perfil.email || novoProdutorEmail.trim(),
        cpfCnpj: perfil.cpfCnpj || perfil.cpf || "",
        telefone: perfil.telefone || "",
        token: result.token,
      };

      const atual = load();
      const existe = atual.some((p) => p.email.toLowerCase() === novoProdutor.email.toLowerCase());
      if (existe) {
        setErroAdicionar("Produtor já cadastrado na cooperativa.");
        return;
      }

      const next = [...atual, novoProdutor];
      save(next);
      setProdutores(next);
      setShowAdicionarProdutor(false);
      setNovoProdutorEmail("");
      setNovoProdutorSenha("");
      setErroAdicionar("");
    } catch (err) {
      setErroAdicionar(err.message || "Erro ao validar login do produtor.");
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
              <Link key={p.id} className={styles.item} to={`/produtor/${p.id}`}>
                <div className={styles.info}>
                  <div className={styles.name}>{p.nome}</div>
                  <div className={styles.meta}>{p.email}</div>
                  {p.cpfCnpj && <div className={styles.meta}>{p.cpfCnpj}</div>}
                </div>
              </Link>
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
              <div className={styles.field}>
                <label htmlFor="produto-senha">Senha do produtor</label>
                <input
                  id="produto-senha"
                  type="password"
                  value={novoProdutorSenha}
                  onChange={(e) => setNovoProdutorSenha(e.target.value)}
                  placeholder="Senha do produtor"
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
