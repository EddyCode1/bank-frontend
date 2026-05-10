import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../features/auth/store/useAuthStore'

/**
 * Sidebar principal con navegación bancaria y bloque de administración si aplica.
 */
const menuItems = [
  { to: '/loby', label: 'Panel general', icon: '▦' },
  { to: '/loby/account', label: 'Cuentas', icon: '◉' },
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
        className={`fixed inset-0 z-30 bg-[var(--text)]/30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-[var(--border)] bg-white p-5 shadow-xl transition-transform lg:static lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 border-b border-[var(--border)] pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--secondary)]">
            Visual Banco
          </p>
          <h2 className="mt-2 text-xl font-bold text-[var(--text)]">Mesa financiera</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {user?.nombre ? `Bienvenido, ${user.nombre}` : 'Bienvenido'}
          </p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.to === '/loby'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'text-[var(--text)] hover:bg-[var(--surface)]'
                }`
              }
            >
              <span className="inline-flex w-5 justify-center text-xs">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {isAdmin ? (
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Administración
              </p>
              <NavLink
                to="/loby/users"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[var(--primary)] text-white shadow-sm'
                      : 'text-[var(--primary)] hover:bg-[var(--surface)]'
                  }`
                }
              >
                <span className="inline-flex w-5 justify-center text-xs">◎</span>
                <span>Usuarios</span>
              </NavLink>
            </div>
          ) : null}
        </nav>

        <div className="mt-8 border-t border-[var(--border)] pt-5">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl bg-[var(--danger)] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#DC2626]"
          >
            Cerrar sesión segura
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
