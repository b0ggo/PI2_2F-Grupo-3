import { useEffect, useRef } from 'react'
import styles from './ScanModal.module.css'

function BtnFechar({ onClick }) {
  return (
    <button className={styles.btnFechar} onClick={onClick} aria-label="Fechar">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M18 6L6 18M6 6l12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

export function QRModal({ aberto, onFechar, onLeitura }) {
  const scannerRef = useRef(null)

  useEffect(() => {
    if (!aberto) return

    let cancelled = false

    const timer = setTimeout(async () => {
      if (cancelled) return
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        const scanner = new Html5Qrcode('ag-qr-container')
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decoded) => {
            onLeitura(decoded.trim().substring(0, 20))
            fechar()
          },
          () => {}
        )
      } catch {
        const el = document.getElementById('ag-qr-container')
        if (el)
          el.innerHTML =
            '<p class="ag-qr-fallback">Câmera não disponível neste ambiente.<br/>Use a opção "Código" para inserir manualmente.</p>'
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [aberto])

  function fechar() {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {})
      scannerRef.current = null
    }
    onFechar()
  }

  if (!aberto) return null

  return (
    <div className={styles.overlay} onClick={fechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitulo}>Escanear QR Code</span>
          <BtnFechar onClick={fechar} />
        </div>
        <div id="ag-qr-container" className={styles.qrContainer} />
        <p className={styles.hint}>Aponte a câmera para o QR Code do animal.</p>
      </div>
    </div>
  )
}

export function CodigoModal({ aberto, onFechar, onAplicar }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (aberto) setTimeout(() => inputRef.current?.focus(), 100)
  }, [aberto])

  function aplicar() {
    const val = inputRef.current?.value.trim()
    if (!val) return
    onAplicar(val.substring(0, 20))
    inputRef.current.value = ''
    onFechar()
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') aplicar()
  }

  if (!aberto) return null

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitulo}>Inserir Código</span>
          <BtnFechar onClick={onFechar} />
        </div>
        <p className={styles.hint}>
          Digite ou cole o código de identificação do animal:
        </p>
        <input
          ref={inputRef}
          className={styles.inputCodigo}
          type="text"
          placeholder="Ex: BR-001234"
          maxLength={20}
          onKeyDown={onKeyDown}
        />
        <button className={styles.btnAplicar} onClick={aplicar}>
          Aplicar Código
        </button>
      </div>
    </div>
  )
}