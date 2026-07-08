import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Header from '../../components/Header/Header'
import BottomNav from '../../components/BottomNav/BottomNav.jsx'
import AnimalTypeSelector from '../../components/AnimalTypeSelector/AnimalTypeSelector'
import IdentificacaoForm from '../../components/IdentificacaoForm/IdentificacaoForm'
import SaudeForm from '../../components/SaudeForm/SaudeForm'
import Toast from '../../components/Toast/Toast'

import { getAnimal, putAnimal } from '../../services/api'
import { ROUTES } from '../../constants/routes.js'
import {
  FORM_ANIMAL_INICIAL,
  animalParaForm,
  formParaAnimal,
  validarFormAnimal,
} from '../../utils/animalForm'
import styles from '../CadastrarAnimal/CadastrarAnimal.module.css'

export default function EditarAnimal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const feedbackTimer = useRef(null)

  const [form, setForm] = useState(FORM_ANIMAL_INICIAL)
  const [erros, setErros] = useState({})
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [feedback, setFeedback] = useState({ visivel: false, mensagem: '', variante: 'success' })

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    getAnimal(id)
      .then((animal) => {
        if (!ativo) return
        setForm(animalParaForm(animal))
      })
      .catch(() => {
        if (!ativo) return
        exibirFeedback('Animal não encontrado.', 'error')
        navigate(ROUTES.CONSULTAR, { replace: true })
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => { ativo = false }
  }, [id, navigate])

  function exibirFeedback(mensagem, variante = 'success') {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    setFeedback({ visivel: false, mensagem: '', variante: 'success' })
    requestAnimationFrame(() => {
      setFeedback({ visivel: true, mensagem, variante })
    })
    feedbackTimer.current = setTimeout(() => {
      setFeedback((f) => ({ ...f, visivel: false }))
    }, 3200)
  }

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: undefined }))
  }

  function handleTipo(novoTipo) {
    setForm((prev) => ({
      ...prev,
      tipo: novoTipo,
      raca: '',
      outraRaca: '',
      produtividadeLeite: novoTipo === 'bovino' ? prev.produtividadeLeite : '',
      vacina: '',
      outraVacina: '',
    }))
  }

  function handleCancelar() {
    navigate(ROUTES.CONSULTAR)
  }

  async function handleSalvar() {
    const novosErros = validarFormAnimal(form)
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) return

    setSalvando(true)
    try {
      await putAnimal(id, formParaAnimal(form))
      navigate(ROUTES.CONSULTAR, { state: { atualizado: true, aba: 'animais' } })
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao salvar alterações.'
      exibirFeedback(msg, 'error')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className={`app-page ${styles.page}`}>
        <div className={styles.card}>
          <Header titulo="Editar Animal" voltarPara={ROUTES.CONSULTAR} />
          <div className={styles.body}>
            <p className={styles.hint}>Carregando dados do animal…</p>
          </div>
        </div>
        <BottomNav mode="produtor" />
      </div>
    )
  }

  return (
    <>
      <div className={`app-page ${styles.page}`}>
        <div className={styles.card}>
          <Header titulo="Editar Animal" voltarPara={ROUTES.CONSULTAR} />

          <div className={styles.body}>
            <p className={styles.sectionLabel}>Tipo de Animal</p>
            <AnimalTypeSelector
              tipoSelecionado={form.tipo}
              onChange={handleTipo}
            />
            <p className={styles.hint}>
              Selecione o tipo para filtrar as raças disponíveis.
            </p>

            <hr className={styles.divider} />

            <IdentificacaoForm
              tipo={form.tipo}
              valores={form}
              onChange={handleChange}
              erros={erros}
            />

            <hr className={styles.divider} />

            <p className={styles.sectionLabel}>Saúde</p>
            <SaudeForm
              tipo={form.tipo}
              valores={form}
              onChange={handleChange}
            />

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.btnCancelar}
                onClick={handleCancelar}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.btnSalvar}
                onClick={handleSalvar}
                disabled={salvando}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {salvando ? 'Salvando…' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast
        mensagem={feedback.mensagem}
        tipo={feedback.variante}
        visivel={feedback.visivel}
      />
      <BottomNav mode="produtor" />
    </>
  )
}
