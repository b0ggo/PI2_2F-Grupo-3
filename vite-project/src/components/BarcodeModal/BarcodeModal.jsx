import { useCallback, useEffect, useRef } from 'react'
import styles from '../ScanModal/ScanModal.module.css'

const CONTAINER_ID = 'ag-barcode-container'

const BARCODE_FORMATS = [
  'CODABAR',
  'CODE_39',
  'CODE_93',
  'CODE_128',
  'ITF',
  'EAN_13',
  'EAN_8',
  'UPC_A',
  'UPC_E',
  'UPC_EAN_EXTENSION',
]

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

export default function BarcodeModal({ aberto, onFechar, onLeitura }) {
  const scannerRef = useRef(null)
  const onLeituraRef = useRef(onLeitura)
  const onFecharRef = useRef(onFechar)

  useEffect(() => {
    onLeituraRef.current = onLeitura
  }, [onLeitura])

  useEffect(() => {
    onFecharRef.current = onFechar
  }, [onFechar])

  const fechar = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {})
      scannerRef.current = null
    }
    onFecharRef.current()
  }, [])

  useEffect(() => {
    if (!aberto) return

    let cancelled = false

    const timer = setTimeout(async () => {
      if (cancelled) return
      try {
        const mountEl = document.getElementById(CONTAINER_ID)
        if (mountEl) mountEl.innerHTML = ''

        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
          'html5-qrcode'
        )

        const formatsToSupport = BARCODE_FORMATS.map(
          (name) => Html5QrcodeSupportedFormats[name]
        )

        const scanner = new Html5Qrcode(CONTAINER_ID, { formatsToSupport })
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 280, height: 120 } },
          (decoded) => {
            onLeituraRef.current(decoded.trim().substring(0, 20))
            fechar()
          },
          () => {}
        )
      } catch {
        const el = document.getElementById(CONTAINER_ID)
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
  }, [aberto, fechar])

  if (!aberto) return null

  return (
    <div className={styles.overlay} onClick={fechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitulo}>Escanear Código de Barras</span>
          <BtnFechar onClick={fechar} />
        </div>
        <div id={CONTAINER_ID} className={styles.qrContainer} />
        <p className={styles.hint}>
          Aponte a câmera para o código de barras do brinco do animal.
        </p>
      </div>
    </div>
  )
}
