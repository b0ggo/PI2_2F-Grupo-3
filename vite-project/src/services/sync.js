import { buscarPendentes, marcarComoSincronizado } from './db'
import { postAnimal } from './api'

export async function sincronizarPendentes(onProgresso) {
  const pendentes = await buscarPendentes()
  if (!pendentes.length) return 0

  let sincronizados = 0

  for (const animal of pendentes) {
    try {
      await postAnimal(animal)
      await marcarComoSincronizado(animal.id)
      sincronizados++
      if (onProgresso) onProgresso(sincronizados, pendentes.length)
    } catch (err) {
      console.warn(`[sync] Falha no animal id=${animal.id}:`, err.message)
    }
  }

  return sincronizados
}