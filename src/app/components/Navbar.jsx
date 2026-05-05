import useAuthStore from '../../features/auth/store/useAuthStore'

/**
 * Componente Navbar - Barra superior
 */
const Navbar = ({ isSidebarOpen = true, onToggleSidebar }) => {
  const { user } = useAuthStore()

  return (
    <header className="px-6 py-4 flex items-center justify-between" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--gris-medio)' }}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl border transition hover:opacity-80"
          aria-label={isSidebarOpen ? 'Ocultar menú lateral' : 'Mostrar menú lateral'}
          title={isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
          style={{
            border: '1px solid var(--gris-medio)',
            background: 'var(--surface)',
            color: 'var(--text)'
          }}
        >
          {isSidebarOpen ? '⟨' : '⟩'}
        </button>

        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
            Bienvenido, {user?.nombre || 'Usuario'}
          </h2>
        </div>
      </div>
    </header>
  )
}

export default Navbar
