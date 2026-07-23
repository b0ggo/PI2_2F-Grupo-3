import { useState } from 'react'
import styles from './PasswordInput.module.css'

function IconEye({ aberto }) {
  if (aberto) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  className = '',
  invalid = false,
}) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className={styles.wrap}>
      <input
        id={id}
        className={[styles.input, invalid ? styles.invalid : '', className].filter(Boolean).join(' ')}
        type={visivel ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        tabIndex={-1}
      >
        <IconEye aberto={visivel} />
      </button>
    </div>
  )
}
