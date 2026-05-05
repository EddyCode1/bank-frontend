import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

/**
 * Layout principal con Sidebar
 * Usado en rutas protegidas
 */
const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Página */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
