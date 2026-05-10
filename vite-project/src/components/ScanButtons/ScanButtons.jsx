import styles from './ScanButtons.module.css'

export default function ScanButtons({ onQR, onCodigo }) {
  return (
    <div className={styles.row}>
      <button type="button" className={styles.btn} onClick={onQR}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3"  y="3"  width="7" height="7" rx="1" stroke="#1a7a3c" strokeWidth="2" />
          <rect x="14" y="3"  width="7" height="7" rx="1" stroke="#1a7a3c" strokeWidth="2" />
          <rect x="3"  y="14" width="7" height="7" rx="1" stroke="#1a7a3c" strokeWidth="2" />
          <path d="M14 14h2v2h-2zM18 14h3M14 18h3M18 18h3"
                stroke="#1a7a3c" strokeWidth="2" strokeLinecap="round" />
        </svg>
        QR Code
      </button>

      <button type="button" className={styles.btn} onClick={onCodigo}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 9V5a2 2 0 012-2h4M15 3h4a2 2 0 012 2v4M3 15v4a2 2 0 002 2h4M15 21h4a2 2 0 002-2v-4"
                stroke="#1a7a3c" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" stroke="#1a7a3c" strokeWidth="2" />
        </svg>
        Código
      </button>
    </div>
  )
}