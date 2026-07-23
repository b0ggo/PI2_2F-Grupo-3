export function calcularIdadeMeses(dataNasc) {
  if (!dataNasc) return null
  const nasc = new Date(`${dataNasc}T00:00:00`)
  if (Number.isNaN(nasc.getTime())) return null
  const hoje = new Date()
  let meses = (hoje.getFullYear() - nasc.getFullYear()) * 12 + (hoje.getMonth() - nasc.getMonth())
  if (hoje.getDate() < nasc.getDate()) meses -= 1
  return meses >= 0 ? meses : null
}

export function formatarIdade(dataNasc, idadeMeses = null) {
  const meses = idadeMeses ?? calcularIdadeMeses(dataNasc)
  if (meses == null) return '—'
  if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
  const anos = Math.floor(meses / 12)
  const resto = meses % 12
  if (resto === 0) return `${anos} ${anos === 1 ? 'ano' : 'anos'}`
  return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${resto} ${resto === 1 ? 'mês' : 'meses'}`
}
