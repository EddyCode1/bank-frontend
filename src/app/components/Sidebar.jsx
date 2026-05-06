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
    <aside className="w-56 p-4" style={{backgroundColor: '#F5F7FA', borderRight: '1px solid #E0E7FF', minHeight: '100vh'}}>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4" style={{color: '#1E293B'}}>Menú</h2>
        <nav className="space-y-2">
          <Link
            to="/loby"
            className="block px-4 py-2 rounded-lg transition"
            style={{color: '#2C4A7A'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E0E7FF'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Dashboard
          </Link>
          <Link
            to="/loby/account"
            className="block px-4 py-2 rounded-lg transition"
            style={{color: '#2C4A7A'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E0E7FF'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Mi Cuenta
          </Link>
          <Link
            to="/loby/favorites"
            className="block px-4 py-2 rounded-lg transition"
            style={{color: '#2C4A7A'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E0E7FF'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Favoritos
          </Link>
          <Link
            to="/loby/product"
            className="block px-4 py-2 rounded-lg transition font-medium"
            style={{color: '#1FA187', backgroundColor: '#DCF3EE'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1FA187' || (e.target.style.color = '#FFFFFF')}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#DCF3EE' || (e.target.style.color = '#1FA187')}
          >
           Productos
          </Link>
          <Link
            to="/loby/services"
            className="block px-4 py-2 rounded-lg transition"
            style={{color: '#2C4A7A'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E0E7FF'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Servicios
          </Link>
          <Link
            to="/loby/transactions"
            className="block px-4 py-2 rounded-lg transition"
            style={{color: '#2C4A7A'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E0E7FF'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Transacciones
          </Link>
        </nav>
      </div>
      <div className="mt-auto pt-4" style={{borderTop: '1px solid #E0E7FF'}}>
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-white rounded-lg transition font-medium"
          style={{backgroundColor: '#EF4444'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#EF4444'}
        >
         Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
