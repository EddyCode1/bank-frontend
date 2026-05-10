import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../features/auth/store/useAuthStore'
import LogoEmblem from './LogoEmblem'

/**
 * Sidebar limpio y funcional — estilo bancario profesional
 */
const menuItems = [
  { to: '/loby', label: 'Panel general', icon: '▦' },
  { to: '/loby/account', label: 'Cuentas', icon: '◉' },
  { to: '/loby/profile', label: 'Mi perfil', icon: '◇' },
  { to: '/loby/transactions', label: 'Transacciones', icon: '⇄' },
  { to: '/loby/products', label: 'Productos', icon: '◫' },
  { to: '/loby/services', label: 'Servicios', icon: '◌' },
  { to: '/loby/favorites', label: 'Favoritos', icon: '★' },
]

const Sidebar = ({ isOpen = true, onClose }) => {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = user?.rol === 'ADMIN_ROLE' || user?.rol === 'admin'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-[var(--border)] bg-white shadow-xl transition-[transform,width,padding,border-color] duration-300 ease-in-out',
          'w-72 max-w-[85vw] shrink-0 lg:relative lg:z-0 lg:max-w-none lg:shadow-md',
          isOpen
            ? 'translate-x-0 border-r lg:w-72 lg:min-w-[18rem]'
            : '-translate-x-full border-transparent lg:translate-x-0 lg:w-0 lg:min-w-0 lg:max-w-0 lg:border-0 lg:p-0 lg:shadow-none',
        ].join(' ')}
        aria-hidden={!isOpen}
      >
        {/* Header fijo */}
        <div
          className={`shrink-0 border-b border-[var(--border)] p-5 ${!isOpen ? 'lg:hidden' : ''}`}
        >
          <div className="flex items-center gap-3">
            <LogoEmblem size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                Banco del Quetzal
              </p>
              <h2 className="mt-0.5 text-base font-bold text-[var(--text)]">Mesa financiera</h2>
            </div>
          </div>
          {user?.nombre && (
            <div className="mt-3 rounded-lg bg-[var(--bg)] px-3 py-2">
              <p className="truncate text-xs text-[var(--muted)]">
                👋 Hola, <span className="font-semibold text-[var(--text)]">{user.nombre}</span>
              </p>
            </div>
          )}
        </div>

        {/* Navegación con scroll */}
        <nav className={`flex-1 space-y-1 overflow-y-auto p-4 ${!isOpen ? 'lg:hidden' : ''}`}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Menú principal
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.to === '/loby'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'text-[var(--text)] hover:bg-[var(--bg)]'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Administración */}
          {isAdmin && (
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Administración
              </p>
              <NavLink
                to="/loby/users"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--primary)] text-white shadow-sm'
                      : 'text-[var(--primary)] hover:bg-[var(--primary)]/5'
                  }`
                }
              >
                <span className="text-base">◎</span>
                <span>Usuarios</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Botón de cerrar sesión fijo en el bottom */}
        <div className={`shrink-0 border-t border-[var(--border)] p-4 ${!isOpen ? 'lg:hidden' : ''}`}>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--danger)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 active:scale-[0.98]"
          >
            <span className="text-base">⏻</span>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
