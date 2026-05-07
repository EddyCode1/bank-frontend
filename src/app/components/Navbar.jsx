import useAuthStore from '../../features/auth/store/useAuthStore'

/**
 * Barra superior institucional
 */
const Navbar = ({ isSidebarOpen = true, onToggleSidebar }) => {
  const { user } = useAuthStore()

  return (
    <header className="border-b border-[var(--border)] bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--primary)] transition hover:bg-[var(--surface)]"
            aria-label={isSidebarOpen ? 'Ocultar menú lateral' : 'Mostrar menú lateral'}
            title={isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--secondary)]">
              Banca digital
            </p>
            <h2 className="text-lg font-semibold text-[var(--text)] sm:text-xl">
              Bienvenido, {user?.nombre || 'Usuario'}
            </h2>
          </div>
        </div>

        <div className="hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted)] sm:block">
          Sesión protegida
        </div>
      </div>
    </header>
  )
}

export default Navbar
