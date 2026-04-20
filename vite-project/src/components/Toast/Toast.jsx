import styles from './Toast.module.css'

export default function Toast({ mensagem, tipo = 'success', visivel }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        styles.toast,
        styles[tipo],
        visivel ? styles.visivel : '',
      ].join(' ')}
    >
      {mensagem}
    </div>
  )
}