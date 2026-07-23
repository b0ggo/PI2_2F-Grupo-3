import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Toast from '../components/Toast/Toast.jsx'

const ToastContext = createContext(null)

const DURACAO_MS = 4500

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: 'success' })
  const timer = useRef(null)

  const showToast = useCallback((mensagem, tipo = 'success') => {
    if (timer.current) clearTimeout(timer.current)

    const prefix = tipo === 'success' ? '✓ ' : tipo === 'error' ? '✗ ' : ''
    setToast({ visivel: false, mensagem: '', tipo: 'success' })

    requestAnimationFrame(() => {
      setToast({ visivel: true, mensagem: `${prefix}${mensagem}`, tipo })
    })

    timer.current = setTimeout(() => {
      setToast((t) => ({ ...t, visivel: false }))
    }, DURACAO_MS)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} visivel={toast.visivel} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast deve ser usado dentro de ToastProvider')
  }
  return ctx
}
