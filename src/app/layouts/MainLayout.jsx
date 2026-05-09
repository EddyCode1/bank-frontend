import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

import ProfileButton from '../../features/account/components/ProfileButton'
import useAuthStore from '../../features/auth/store/useAuthStore'
import { useNavigate } from 'react-router-dom'

/**
 * Layout principal con Sidebar
 * Usado en rutas protegidas
 */
const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname])

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Página */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Botón de perfil fijo con menú */}
        {(() => {
          const navigate = useNavigate();
          const user = useAuthStore.getState().user;
          const logout = useAuthStore.getState().logout;
          return (
            <ProfileButton
              imageUrl={user?.profilePicture}
              email={user?.email}
              onEditProfile={() => navigate('/loby/profile')}
              onLogout={() => {
                logout();
                navigate('/login');
              }}
              onChangePhoto={() => navigate('/loby/profile?editPhoto=1')}
            />
          );
        })()}
      </div>
    </div>
  )
}

export default MainLayout
