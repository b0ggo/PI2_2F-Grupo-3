import { VACINAS } from '../../data/vacinas'
import styles from './SaudeForm.module.css'

const STATUS = [
  { id: 'saudavel',   label: 'Saudável' },
  { id: 'tratamento', label: 'Em Tratamento' },
  { id: 'quarentena', label: 'Quarentena' },
]

export default function SaudeForm({ tipo, valores, onChange }) {
  const vacinasList = VACINAS[tipo] || []
  const mostrarOutra = valores.vacina === '__outra__'

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
        <label className={styles.label} htmlFor="campo-vacina">
          Vacina Aplicada
        </label>
        <div className={styles.selectWrap}>
          <select
            id="campo-vacina"
            className={styles.select}
            value={valores.vacina}
            onChange={(e) => onChange('vacina', e.target.value)}
          >
            <option value="">Selecione a vacina</option>
            {vacinasList.map((v) => (
              <option key={v} value={v === 'Outra' ? '__outra__' : v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mostrarOutra && (
        <div className={styles.campo}>
          <label className={styles.label} htmlFor="campo-outra-vacina">
            Especifique a vacina
          </label>
          <input
            id="campo-outra-vacina"
            className={styles.input}
            type="text"
            placeholder="Digite o nome da vacina"
            maxLength={80}
            value={valores.outraVacina}
            onChange={(e) => onChange('outraVacina', e.target.value)}
          />
        </div>
      )}

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
