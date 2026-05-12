import { RACAS } from '../../data/racas'
import styles from './IdentificacaoForm.module.css'

export default function IdentificacaoForm({ tipo, valores, onChange, erros = {} }) {
  const racas        = RACAS[tipo] || []
  const mostrarOutra = valores.raca === '__outra__'

  return (
    <div className={styles.wrapper}>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="campo-id">
          Identificação <span className={styles.obrigatorio}>*</span>
        </label>
        <input
          id="campo-id"
          className={[styles.input, erros.identificacao ? styles.invalido : ''].join(' ')}
          type="text"
          placeholder="Ex: BR-001234"
          maxLength={20}
          value={valores.identificacao}
          onChange={(e) => onChange('identificacao', e.target.value)}
        />
        <div className={styles.charCount}>{valores.identificacao.length}/20</div>
        {erros.identificacao && (
          <p className={styles.erro} role="alert">{erros.identificacao}</p>
        )}
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="campo-raca">
          Raça <span className={styles.obrigatorio}>*</span>
        </label>
        <div className={styles.selectWrap}>
          <select
            id="campo-raca"
            className={[styles.select, erros.raca ? styles.invalido : ''].join(' ')}
            value={valores.raca}
            onChange={(e) => onChange('raca', e.target.value)}
          >
            <option value="">Selecione a raça</option>
            {racas.map((r) => (
              <option key={r} value={r === 'Outra' ? '__outra__' : r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        {erros.raca && (
          <p className={styles.erro} role="alert">{erros.raca}</p>
        )}
      </div>

      {mostrarOutra && (
        <div className={styles.campo}>
          <label className={styles.label} htmlFor="campo-outra-raca">
            Especifique a raça
          </label>
          <input
            id="campo-outra-raca"
            className={styles.input}
            type="text"
            placeholder="Digite o nome da raça"
            maxLength={50}
            value={valores.outraRaca}
            onChange={(e) => onChange('outraRaca', e.target.value)}
          />
        </div>
      )}

      <div className={styles.linha2}>
        <div className={styles.campo}>
          <label className={styles.label} htmlFor="campo-idade">Idade (meses)</label>
          <input
            id="campo-idade"
            className={styles.input}
            type="number"
            placeholder="Ex: 12"
            min="0"
            max="360"
            value={valores.idade}
            onChange={(e) => onChange('idade', e.target.value)}
          />
        </div>
        <div className={styles.campo}>
          <label className={styles.label} htmlFor="campo-peso">Peso (kg)</label>
          <input
            id="campo-peso"
            className={styles.input}
            type="number"
            placeholder="Ex: 450"
            min="0"
            step="0.1"
            value={valores.peso}
            onChange={(e) => onChange('peso', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="campo-sexo">Sexo</label>
        <div className={styles.selectWrap}>
          <select
            id="campo-sexo"
            className={styles.select}
            value={valores.sexo}
            onChange={(e) => onChange('sexo', e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="macho">Macho</option>
            <option value="femea">Fêmea</option>
          </select>
        </div>
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="campo-nasc">Data de Nascimento</label>
        <input
          id="campo-nasc"
          className={styles.input}
          type="date"
          value={valores.dataNasc}
          onChange={(e) => onChange('dataNasc', e.target.value)}
        />
      </div>

    </div>
  )
}