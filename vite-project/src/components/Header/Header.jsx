import styles from './Header.module.css'

export default function Header({ onVoltar, pendentes = 0 }) {
  return (
    <header className={styles.header}>
      <button
        className={styles.btnVoltar}
        onClick={onVoltar}
        title="Voltar"
        aria-label="Voltar"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path
            d="M19 12H5M5 12l7 7M5 12l7-7"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span className={styles.titulo}>Cadastrar Animal</span>

      {pendentes > 0 && (
        <span className={styles.badge} title="Registros aguardando sincronização">
          ⏳ {pendentes} pendente{pendentes > 1 ? 's' : ''}
        </span>
      )}
    </header>
  )
}