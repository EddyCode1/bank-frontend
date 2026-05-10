import { Navigate } from 'react-router-dom'
import useAuthStore from '../../features/auth/store/useAuthStore'

/**
 * Componente para proteger rutas según autenticación y rol
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, token, isAuthenticated } = useAuthStore()

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />
  }

  // Si requiere rol específico y el usuario no lo tiene, redirigir
  if (requiredRole) {
    const userRole = user?.rol || user?.role || ''
    const hasRequiredRole = 
      userRole === requiredRole || 
      (requiredRole === 'ADMIN_ROLE' && (userRole === 'ADMIN' || userRole === 'ADMIN_ROLE'))

    if (!hasRequiredRole) {
      // Si es admin intentando acceder a ruta de usuario, permitir (admin puede todo)
      const isAdmin = userRole === 'ADMIN' || userRole === 'ADMIN_ROLE'
      if (!isAdmin) {
        return <Navigate to="/loby" replace />
      }
    }
  }

  return children
}

export default ProtectedRoute
