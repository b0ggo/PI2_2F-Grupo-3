import { useCallback, useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getPesoHistorico } from '../../services/api.js'
import styles from './PesoChart.module.css'

function formatarData(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    const [y, m, day] = String(iso).slice(0, 10).split('-')
    return day && m && y ? `${day}/${m}/${y}` : '—'
  }
  return d.toLocaleDateString('pt-BR')
}

export default function PesoChart({ animalId, pesoAtual, refreshKey = 0 }) {
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(() => {
    if (!animalId) return
    setCarregando(true)
    setErro('')
    getPesoHistorico(animalId)
      .then((lista) => {
        const pontos = lista.map((item) => ({
          data: formatarData(item.registradoEm),
          peso: Number.parseFloat(item.peso),
          registradoEm: item.registradoEm,
        })).filter((p) => !Number.isNaN(p.peso))
        setDados(pontos)
      })
      .catch(() => {
        setDados([])
        setErro('Não foi possível carregar o histórico de peso.')
      })
      .finally(() => setCarregando(false))
  }, [animalId])

  useEffect(() => {
    carregar()
  }, [carregar, refreshKey, pesoAtual])

  if (carregando) {
    return <p className={styles.estado}>Carregando histórico de peso…</p>
  }

  if (erro) {
    return <p className={styles.estadoErro}>{erro}</p>
  }

  if (dados.length === 0) {
    return (
      <p className={styles.estado}>
        Nenhum registro de peso ainda. Informe o peso ao cadastrar ou editar o animal.
      </p>
    )
  }

  return (
    <div className={styles.chartWrap}>
      <h4 className={styles.titulo}>Evolução do peso (kg)</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={dados} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="data" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11 }} width={42} unit=" kg" />
          <Tooltip
            formatter={(value) => [`${value} kg`, 'Peso']}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="peso"
            stroke="#16a34a"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#16a34a' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
