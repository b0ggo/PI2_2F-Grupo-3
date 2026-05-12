import './index.css'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import './styles/globals.css'
import App from './App'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[SW] Registrado com sucesso. Scope:', reg.scope)
      })
      .catch((err) => {
        console.warn('[SW] Falha ao registrar:', err)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)