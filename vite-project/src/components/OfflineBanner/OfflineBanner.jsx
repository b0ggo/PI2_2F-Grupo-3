import styles from './OfflineBanner.module.css'

export default function OfflineBanner({ visivel }) {
  if (!visivel) return null

  return (
    <div className={styles.banner} role="alert">
      <span className={styles.dot} />
      <span>
        Modo offline — dados salvos localmente e sincronizados ao reconectar.
      </span>
    </div>
  )
}