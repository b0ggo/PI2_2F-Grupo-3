import { useEffect, useState } from 'react'
import styles from './Toast.module.css'

export default function Toast({ mensagem, tipo = 'success', visivel }) {
  const [ativo, setAtivo] = useState(false)

  useEffect(() => {
    if (!visivel) {
      setAtivo(false)
      return
    }

    const frame = requestAnimationFrame(() => setAtivo(true))
    return () => cancelAnimationFrame(frame)
  }, [visivel])

  if (!visivel && !ativo) return null

  const tipoClasse = styles[tipo] ?? styles.success

  return (
    <div
      role="status"
      aria-live="polite"
      className={[styles.toast, tipoClasse, ativo ? styles.visivel : ''].join(' ')}
    >
      {mensagem}
    </div>
  )
}
