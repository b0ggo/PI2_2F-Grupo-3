import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Header              from '../../components/Header/Header'
import OfflineBanner       from '../../components/OfflineBanner/OfflineBanner'
import ScanButtons         from '../../components/ScanButtons/ScanButtons'
import AnimalTypeSelector  from '../../components/AnimalTypeSelector/AnimalTypeSelector'
import IdentificacaoForm   from '../../components/IdentificacaoForm/IdentificacaoForm'
import SaudeForm           from '../../components/SaudeForm/SaudeForm'
import { QRModal, CodigoModal } from '../../components/ScanModal/ScanModal'
import Toast               from '../../components/Toast/Toast'

import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useIndexedDB }    from '../../hooks/useIndexedDB'
import { sincronizarPendentes } from '../../services/sync'

import { ROUTES } from '../../constants/routes.js'
import styles from './CadastrarAnimal.module.css'

const FORM_INICIAL = {
  tipo:          'bovino',
  identificacao: '',
  raca:          '',
  outraRaca:     '',
  idade:         '',
  peso:          '',
  sexo:          '',
  dataNasc:      '',
  status:        'saudavel',
  vacinas:       [],
  historico:     '',
}

export default function CadastrarAnimal({ onVoltar }) {
  const navigate = useNavigate()
  const voltar = onVoltar ?? (() => navigate(ROUTES.HOME))

  const online                          = useOnlineStatus()
  const { pronto, pendentes, salvar, atualizarContagem } = useIndexedDB()

  const [form,      setForm]      = useState(FORM_INICIAL)
  const [erros,     setErros]     = useState({})
  const [toast,     setToast]     = useState({ visivel: false, mensagem: '', tipo: 'success' })
  const [modalQR,   setModalQR]   = useState(false)
  const [modalCod,  setModalCod]  = useState(false)

  useEffect(() => {
    if (!online || !pronto) return
    sincronizarPendentes()
      .then((n) => {
        if (n > 0) {
          atualizarContagem()
          exibirToast(`${n} registro${n > 1 ? 's' : ''} sincronizado${n > 1 ? 's' : ''}!`, 'success')
        }
      })
      .catch(() => {})
  }, [online, pronto, atualizarContagem])

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: undefined }))
  }

  function handleTipo(novoTipo) {
    setForm((prev) => ({ ...prev, tipo: novoTipo, raca: '', outraRaca: '', vacinas: [] }))
  }

  function exibirToast(mensagem, tipo = 'success') {
    setToast({ visivel: true, mensagem, tipo })
    setTimeout(() => setToast((t) => ({ ...t, visivel: false })), 3200)
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

    const animal = {
      tipo:          form.tipo,
      identificacao: form.identificacao.trim(),
      raca:          racaFinal,
      idade:         form.idade    || null,
      peso:          form.peso     || null,
      sexo:          form.sexo     || null,
      dataNasc:      form.dataNasc || null,
      status:        form.status,
      vacinas:       form.vacinas,
      historico:     form.historico.trim(),
      sincronizado:  online,
      timestamp:     new Date().toISOString(),
    }

    try {
      await salvar(animal)
      if (online) {
        exibirToast('Animal cadastrado com sucesso!', 'success')
      } else {
        exibirToast('Salvo offline — sincronizará ao reconectar.', 'offline')
      }
      setForm(FORM_INICIAL)
    } catch {
      exibirToast('Erro ao salvar. Tente novamente.', 'error')
    }
  }

  function onQRLeitura(decoded) {
    handleChange('identificacao', decoded)
    exibirToast('Código lido com sucesso!', 'success')
  }

  function onCodigoAplicado(codigo) {
    handleChange('identificacao', codigo)
    exibirToast('Código aplicado!', 'success')
  }

  return (
    <>
      <div className={styles.page}>
      <div className={styles.card}>
        <Header onVoltar={voltar} pendentes={pendentes} />

        <div className={styles.body}>
          <OfflineBanner visivel={!online} />

          <ScanButtons
            onQR={()     => setModalQR(true)}
            onCodigo={()  => setModalCod(true)}
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

          <p className={styles.sectionLabel}>Identificação</p>
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
              onClick={() => setForm(FORM_INICIAL)}
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
        onLeitura={onQRLeitura}
      />
      <CodigoModal
        aberto={modalCod}
        onFechar={() => setModalCod(false)}
        onAplicar={onCodigoAplicado}
      />
      <Toast
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        visivel={toast.visivel}
      />
    </>
  )
}