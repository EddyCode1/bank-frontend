import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../features/auth/store/useAuthStore'
import { getUserRole, isAdminRole } from '../../shared/auth/roles'

/**
 * Componente para proteger rutas según autenticación y rol
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, token, isAuthenticated } = useAuthStore()
  const location = useLocation()

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />
  }

  // Si requiere rol específico y el usuario no lo tiene, redirigir
  if (requiredRole) {
    const userRole = getUserRole(user)
    const hasRequiredRole =
      (Array.isArray(requiredRole) && requiredRole.includes(userRole)) ||
      userRole === requiredRole

    if (!hasRequiredRole) {
      // Si es admin intentando acceder a ruta de usuario, permitir (admin puede todo)
      const isAdmin = isAdminRole(userRole)
      if (!isAdmin) {
        return (
          <Navigate
            to="/loby/forbidden"
            replace
            state={{
              from: location.pathname,
              requiredRole: Array.isArray(requiredRole) ? requiredRole.join(', ') : requiredRole,
            }}
          />
        )
      }
    }
  }

  return children
}

export default ProtectedRoute
