import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../features/auth/store/useAuthStore'

/**
 * Sidebar simplificado: solo botones para probar vistas.
 */
const Sidebar = () => {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 p-4">
      <div className="mt-4">
        <button onClick={handleLogout} className="w-full px-3 py-2 bg-red-500 text-white rounded">Cerrar Sesión</button>
      </div>
    </aside>
  )
}

export default Sidebar
