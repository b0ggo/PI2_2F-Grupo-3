import { useState, useEffect, useCallback } from 'react'
import { abrirDB, salvarAnimal, contarPendentes } from '../services/db'

export function useIndexedDB() {
  const [pendentes, setPendentes] = useState(0)
  const [pronto,    setPronto]    = useState(false)

  const atualizarContagem = useCallback(async () => {
    try {
      const n = await contarPendentes()
      setPendentes(n)
    } catch {
      setPendentes(0)
    }
  }, [])

  useEffect(() => {
    abrirDB()
      .then(() => {
        setPronto(true)
        atualizarContagem()
      })
      .catch((err) => console.error('[IndexedDB] Falha ao abrir:', err))
  }, [atualizarContagem])

  const salvar = useCallback(
    async (animal) => {
      await salvarAnimal(animal)
      await atualizarContagem()
    },
    [atualizarContagem]
  )

  return { pronto, pendentes, salvar, atualizarContagem }
}