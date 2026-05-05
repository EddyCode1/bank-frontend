import useAuthStore from '../../features/auth/store/useAuthStore'

/**
 * Componente Navbar - Barra superior simplificada
 */
const Navbar = ({ isSidebarOpen = true, onToggleSidebar }) => {
  const { user } = useAuthStore()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl border bg-white text-gray-700 hover:bg-gray-50 transition"
          aria-label={isSidebarOpen ? 'Ocultar menú lateral' : 'Mostrar menú lateral'}
          title={isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
        >
          {isSidebarOpen ? '⟨' : '⟩'}
        </button>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Bienvenido, {user?.nombre || 'Usuario'}
          </h2>
        </div>
      </div>

    </header>
  )
}

export default Navbar
