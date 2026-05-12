import { TIPOS_ANIMAL } from '../../data/racas'
import styles from './AnimalTypeSelector.module.css'

export default function AnimalTypeSelector({ tipoSelecionado, onChange }) {
  return (
    <div className={styles.grid} role="radiogroup" aria-label="Tipo de animal">
      {TIPOS_ANIMAL.map((tipo) => (
        <button
          key={tipo.id}
          type="button"
          role="radio"
          aria-checked={tipoSelecionado === tipo.id}
          className={[
            styles.card,
            tipoSelecionado === tipo.id ? styles.selecionado : '',
          ].join(' ')}
          onClick={() => onChange(tipo.id)}
        >
          <span className={styles.icone} aria-hidden="true">
            {tipo.icon}
          </span>
          <span className={styles.nome}>{tipo.label}</span>
        </button>
      ))}
    </div>
  )
}