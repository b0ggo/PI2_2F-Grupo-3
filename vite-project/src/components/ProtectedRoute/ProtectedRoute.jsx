import { Navigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { estaLogado } from '../../services/perfil.js'

export default function ProtectedRoute({ children }) {
  if (!estaLogado()) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  return children
}
