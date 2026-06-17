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
 * @param {import('react').ReactNode} [children] — stack: espaço abaixo do subtítulo; hero: espaço acima do título (ex: avatar)
 * @param {() => void} [onVoltar]
 * @param {string} [voltarPara] — se definido, controle de volta é um Link (substitui onVoltar para navegação)
 * @param {number} [pendentes]
 * @param {import('react').ReactNode} [navMiddle] — layout nav: substitui linha de título (ex: conversa do chat)
 * @param {boolean} [sticky] — layout nav: barra de topo fixa (ex: thread do chat)
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

  const backRow = showBack ? (
    <div className={styles.headerBackRow}>{backControl}</div>
  ) : null

  const badge =
    pendentes > 0 ? (
      <span className={styles.badge} title="Registros aguardando sincronização">
        ⏳ {pendentes} pendente{pendentes > 1 ? 's' : ''}
      </span>
    ) : null

  if (layout === 'hero') {
    return (
      <header className={`${styles.headerBase} ${styles.hero}`}>
        {backRow}
        {children ? <div className={styles.heroSlot}>{children}</div> : null}
        <h1 className={styles.heroTitulo}>{titulo}</h1>
        {subtitulo ? <p className={styles.heroSub}>{subtitulo}</p> : null}
      </header>
    )
  }

  if (layout === 'stack') {
    return (
      <header className={`${styles.headerBase} ${styles.stack}`}>
        {backRow}
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
