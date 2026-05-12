import { VACINAS } from '../../data/vacinas'
import styles from './SaudeForm.module.css'

const STATUS = [
  { id: 'saudavel',   label: 'Saudável' },
  { id: 'tratamento', label: 'Em Tratamento' },
  { id: 'quarentena', label: 'Quarentena' },
]

export default function SaudeForm({ tipo, valores, onChange }) {
  const vacinasList = VACINAS[tipo] || []

  function toggleVacina(vacina) {
    const atual = valores.vacinas || []
    const novo  = atual.includes(vacina)
      ? atual.filter((v) => v !== vacina)
      : [...atual, vacina]
    onChange('vacinas', novo)
  }

  return (
    <div className={styles.wrapper}>

      <div className={styles.campo}>
        <span className={styles.label}>Status Atual</span>
        <div className={styles.statusRow} role="radiogroup" aria-label="Status de saúde">
          {STATUS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={valores.status === opt.id}
              className={[
                styles.statusOpt,
                valores.status === opt.id ? styles[`sel_${opt.id}`] : '',
              ].join(' ')}
              onClick={() => onChange('status', opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.campo}>
        <span className={styles.label}>Vacinas Aplicadas</span>
        <div className={styles.tags}>
          {vacinasList.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={(valores.vacinas || []).includes(v)}
              className={[
                styles.tag,
                (valores.vacinas || []).includes(v) ? styles.tagSel : '',
              ].join(' ')}
              onClick={() => toggleVacina(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="campo-historico">
          Histórico de Saúde
        </label>
        <textarea
          id="campo-historico"
          className={styles.textarea}
          placeholder="Observações sobre a saúde do animal, doenças anteriores, tratamentos..."
          maxLength={500}
          value={valores.historico}
          onChange={(e) => onChange('historico', e.target.value)}
        />
        <div className={styles.charCount}>
          {(valores.historico || '').length}/500
        </div>
      </div>

    </div>
  )
}