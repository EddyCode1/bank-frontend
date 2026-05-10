import useAuthStore from '../../features/auth/store/useAuthStore'
import LogoEmblem from './LogoEmblem'

/**
 * Barra superior limpia y profesional
 */
const Navbar = ({ isSidebarOpen = true, onToggleSidebar }) => {
  const { user } = useAuthStore()

  return (
    <header className="border-b border-[var(--border)] bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-[var(--primary)] transition-colors hover:bg-[var(--bg)] active:scale-95"
            aria-label={isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
          >
            <span className="text-sm font-bold">{isSidebarOpen ? '◀' : '▶'}</span>
          </button>

          <LogoEmblem size="sm" />

          <div className="hidden h-6 w-px bg-[var(--border)] sm:block" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
              Banco del Quetzal
            </p>
            <h2 className="truncate text-base font-semibold text-[var(--text)] sm:text-lg">
              Bienvenido, {user?.nombre || 'Usuario'}
            </h2>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-[var(--muted)]">Sesión protegida</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar
