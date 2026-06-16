import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import Header              from '../../components/Header/Header'
import BottomNav           from '../../components/BottomNav/BottomNav.jsx'
import OfflineBanner       from '../../components/OfflineBanner/OfflineBanner'
import ScanButtons         from '../../components/ScanButtons/ScanButtons'
import AnimalTypeSelector  from '../../components/AnimalTypeSelector/AnimalTypeSelector'
import IdentificacaoForm   from '../../components/IdentificacaoForm/IdentificacaoForm'
import SaudeForm           from '../../components/SaudeForm/SaudeForm'
import { QRModal, CodigoModal } from '../../components/ScanModal/ScanModal'
import BarcodeModal          from '../../components/BarcodeModal/BarcodeModal'
import Toast                    from '../../components/Toast/Toast'
import MensagemAnimalSalvo      from '../../components/MensagemAnimalSalvo/MensagemAnimalSalvo'
import MensagemAnimalCancelado  from '../../components/MensagemAnimalCancelado/MensagemAnimalCancelado'

import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useIndexedDB }    from '../../hooks/useIndexedDB'
import { postAnimal } from '../../services/api'
import { marcarComoSincronizado } from '../../services/db'
import { sincronizarPendentes } from '../../services/sync'

import { ROUTES } from '../../constants/routes.js'
import styles from './CadastrarAnimal.module.css'

const FORM_INICIAL = {
  tipo:               'bovino',
  identificacao:      '',
  raca:               '',
  outraRaca:          '',
  produtividadeLeite: '',
  idade:              '',
  peso:               '',
  sexo:               '',
  dataNasc:           '',
  status:             'saudavel',
  vacina:             '',
  outraVacina:        '',
  historico:          '',
}

export default function CadastrarAnimal({ onVoltar }) {
  const navigate = useNavigate()
  const voltar = onVoltar ?? (() => navigate(ROUTES.HOME))

  const online                          = useOnlineStatus()
  const { pronto, pendentes, salvar, atualizarContagem } = useIndexedDB()

  const [form,      setForm]      = useState(FORM_INICIAL)
  const [erros,     setErros]     = useState({})
  const [feedback, setFeedback] = useState({ visivel: false, modo: null, variante: 'success', mensagem: '' })
  const feedbackTimer = useRef(null)
  const [modalQR,       setModalQR]       = useState(false)
  const [modalBarcode,  setModalBarcode]  = useState(false)
  const [modalCod,      setModalCod]      = useState(false)

  useEffect(() => {
    if (!online || !pronto) return
    sincronizarPendentes()
      .then((n) => {
        if (n > 0) {
          atualizarContagem()
          exibirFeedback('scan', {
            mensagem: `${n} registro${n > 1 ? 's' : ''} sincronizado${n > 1 ? 's' : ''}!`,
            variante: 'success',
          })
        }
      })
      .catch(() => {})
  }, [online, pronto, atualizarContagem])

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

  function exibirFeedback(modo, opcoes = {}) {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)

    setFeedback({ visivel: false, modo: null, variante: 'success', mensagem: '' })

    requestAnimationFrame(() => {
      setFeedback({
        visivel: true,
        modo,
        variante: opcoes.variante ?? 'success',
        mensagem: opcoes.mensagem ?? '',
      })
    })

    feedbackTimer.current = setTimeout(() => {
      setFeedback((f) => ({ ...f, visivel: false }))
    }, 3200)
  }

  function handleCancelar() {
    setForm(FORM_INICIAL)
    setErros({})
    exibirFeedback('cancelado')
  }

  function validar() {
    const novosErros = {}
    if (!form.identificacao.trim())
      novosErros.identificacao = 'Identificação é obrigatória.'
    if (!form.raca)
      novosErros.raca = 'Selecione uma raça.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  async function handleSalvar() {
    if (!validar()) return

    const racaFinal =
      form.raca === '__outra__'
        ? form.outraRaca.trim() || 'Outra'
        : form.raca

    const vacinaFinal =
      form.vacina === '__outra__'
        ? form.outraVacina.trim() || 'Outra'
        : form.vacina

    const animal = {
      tipo:          form.tipo,
      identificacao: form.identificacao.trim(),
      raca:          racaFinal,
      idade:         form.idade    || null,
      peso:          form.peso     || null,
      sexo:          form.sexo     || null,
      dataNasc:      form.dataNasc || null,
      status:        form.status,
      vacinas:       vacinaFinal ? [vacinaFinal] : [],
      historico:     form.historico.trim(),
      sincronizado:  false,
      timestamp:     new Date().toISOString(),
    }

    if (form.tipo === 'bovino' && form.produtividadeLeite.trim()) {
      animal.produtividadeLeite = form.produtividadeLeite.trim()
    }

    try {
      const id = await salvar(animal)
      if (online) {
        try {
          await postAnimal(animal)
          await marcarComoSincronizado(id)
          await atualizarContagem()
          exibirFeedback('salvo', { variante: 'success' })
        } catch {
          exibirFeedback('salvo', { variante: 'offline' })
        }
      } else {
        exibirFeedback('salvo', { variante: 'offline' })
      }
      setForm(FORM_INICIAL)
    } catch {
      exibirFeedback('salvo', { variante: 'error' })
    }
  }

  function onScanLeitura(decoded) {
    handleChange('identificacao', decoded)
    exibirFeedback('scan', { mensagem: 'Código lido com sucesso!', variante: 'success' })
  }

  function onCodigoAplicado(codigo) {
    handleChange('identificacao', codigo)
    exibirFeedback('scan', { mensagem: 'Código aplicado!', variante: 'success' })
  }

  return (
    <>
      <div className={`app-page ${styles.page}`}>
      <div className={styles.card}>
        <Header onVoltar={voltar} pendentes={pendentes} />

        <div className={styles.body}>
          <OfflineBanner visivel={!online} />

          <ScanButtons
            onQR={()        => setModalQR(true)}
            onBarcode={()   => setModalBarcode(true)}
            onCodigo={()    => setModalCod(true)}
          />

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
            >
              Cancelar
            </button>
            <button
              type="button"
              className={styles.btnSalvar}
              onClick={handleSalvar}
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
              Salvar Animal
            </button>
          </div>
        </div>
      </div>
      </div>

      <QRModal
        aberto={modalQR}
        onFechar={() => setModalQR(false)}
        onLeitura={onScanLeitura}
      />
      <BarcodeModal
        aberto={modalBarcode}
        onFechar={() => setModalBarcode(false)}
        onLeitura={onScanLeitura}
      />
      <CodigoModal
        aberto={modalCod}
        onFechar={() => setModalCod(false)}
        onAplicar={onCodigoAplicado}
      />
      {feedback.modo === 'salvo' && (
        <MensagemAnimalSalvo visivel={feedback.visivel} variante={feedback.variante} />
      )}
      {feedback.modo === 'cancelado' && (
        <MensagemAnimalCancelado visivel={feedback.visivel} />
      )}
      {feedback.modo === 'scan' && (
        <Toast
          mensagem={feedback.mensagem}
          tipo={feedback.variante}
          visivel={feedback.visivel}
        />
      )}
      <BottomNav mode="produtor" />
    </>
  )
}