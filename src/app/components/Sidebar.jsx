import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../features/auth/store/useAuthStore'

/**
 * Sidebar: Menú de navegación
 */
const Sidebar = () => {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 p-4" style={{ background: 'var(--surface)' }}>
      <nav className="space-y-2">
        <Link
          to="/loby"
          className="block w-full px-3 py-2 rounded transition font-medium"
          style={{
            color: 'var(--text)',
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--gris-claro-fondo)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          Dashboard
        </Link>
        <Link
          to="/loby/account"
          className="block w-full px-3 py-2 rounded transition font-medium"
          style={{
            color: 'var(--text)',
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--gris-claro-fondo)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          Mi Cuenta
        </Link>
        <Link
          to="/loby/products"
          className="block w-full px-3 py-2 rounded transition font-medium"
          style={{
            color: 'var(--text)',
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--gris-claro-fondo)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          Productos
        </Link>
        <Link
          to="/loby/services"
          className="block w-full px-3 py-2 rounded transition font-medium"
          style={{
            color: 'var(--text)',
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--gris-claro-fondo)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          Servicios
        </Link>
        <Link
          to="/loby/transactions"
          className="block w-full px-3 py-2 rounded transition font-medium"
          style={{
            color: 'var(--text)',
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--gris-claro-fondo)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          Transacciones
        </Link>
        <Link
          to="/loby/favorites"
          className="block w-full px-3 py-2 rounded transition font-medium"
          style={{
            color: 'var(--text)',
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--gris-claro-fondo)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          Favoritos
        </Link>

        {/* Admin Section */}
        {user?.rol === 'ADMIN_ROLE' || user?.rol === 'admin' ? (
          <>
            <div style={{ borderTop: '1px solid var(--gris-medio)', margin: '16px 0', paddingTop: '16px' }}>
              <p className="text-xs uppercase font-semibold px-3 mb-2" style={{ color: 'var(--muted)' }}>Administración</p>
              <Link
                to="/loby/users"
                className="block w-full px-3 py-2 rounded transition font-medium flex items-center gap-2"
                style={{
                  color: 'var(--primary)',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(44, 74, 122, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Usuarios
              </Link>
            </div>
          </>
        ) : null}
      </nav>

      <div className="mt-8">
        <button 
          onClick={handleLogout} 
          className="w-full px-3 py-2 rounded transition text-white font-medium hover:opacity-80"
          style={{
            background: 'var(--naranja-principal)'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
