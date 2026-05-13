import { Link } from 'react-router-dom'
import styles from './Header.module.css'

function BackIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M19 12H5M5 12l7 7M5 12l7-7"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * @param {'nav'|'stack'|'hero'} [layout='nav']
 * @param {string} [titulo]
 * @param {string} [subtitulo]
 * @param {import('react').ReactNode} [children] — stack: slot below subtitle; hero: slot above title (e.g. avatar)
 * @param {() => void} [onVoltar]
 * @param {string} [voltarPara] — if set, back control is a Link (overrides onVoltar for navigation)
 * @param {number} [pendentes]
 * @param {import('react').ReactNode} [navMiddle] — nav layout: replaces title row (e.g. chat conversation)
 * @param {boolean} [sticky] — nav layout: sticky top bar (e.g. chat thread)
 */
export default function Header({
  titulo = 'Cadastrar Animal',
  layout = 'nav',
  subtitulo,
  children,
  onVoltar,
  voltarPara,
  pendentes = 0,
  navMiddle,
  sticky = false,
}) {
  const showBack = Boolean(onVoltar || voltarPara)

  const backControl =
    showBack &&
    (voltarPara ? (
      <Link
        to={voltarPara}
        className={styles.btnVoltar}
        title="Voltar"
        aria-label="Voltar"
      >
        <BackIcon />
      </Link>
    ) : (
      <button
        type="button"
        className={styles.btnVoltar}
        onClick={onVoltar}
        title="Voltar"
        aria-label="Voltar"
      >
        <BackIcon />
      </button>
    ))

  const badge =
    pendentes > 0 ? (
      <span className={styles.badge} title="Registros aguardando sincronização">
        ⏳ {pendentes} pendente{pendentes > 1 ? 's' : ''}
      </span>
    ) : null

  if (layout === 'hero') {
    return (
      <header className={`${styles.headerBase} ${styles.hero}`}>
        {children ? <div className={styles.heroSlot}>{children}</div> : null}
        <h1 className={styles.heroTitulo}>{titulo}</h1>
        {subtitulo ? <p className={styles.heroSub}>{subtitulo}</p> : null}
      </header>
    )
  }

  if (layout === 'stack') {
    return (
      <header className={`${styles.headerBase} ${styles.stack}`}>
        <h1 className={styles.stackTitulo}>{titulo}</h1>
        {subtitulo ? <p className={styles.stackSub}>{subtitulo}</p> : null}
        {children ? <div className={styles.stackSlot}>{children}</div> : null}
      </header>
    )
  }

  return (
    <header
      className={`${styles.headerBase} ${styles.row}${sticky ? ` ${styles.rowSticky}` : ''}`}
    >
      {backControl}
      {navMiddle ? (
        <div className={styles.navMiddle}>{navMiddle}</div>
      ) : (
        <h1 className={styles.titulo}>{titulo}</h1>
      )}
      {badge}
    </header>
  )
}
