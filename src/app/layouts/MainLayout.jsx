import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

import ProfileButton from '../../features/account/components/ProfileButton'
import useAuthStore from '../../features/auth/store/useAuthStore'

/**
 * Layout principal con Sidebar
 * Usado en rutas protegidas
 */
const MainLayout = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  useEffect(() => {
    queueMicrotask(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      }
    })
  }, [location.pathname])

  return (
    <div className="flex h-screen min-h-0 w-full bg-[var(--bg)] overflow-hidden">
      {/* Sidebar: en desktop ocupa 0 o 18rem; el resto lo llena el main con flex-1 min-w-0 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-300 ease-in-out">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Página */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        <ProfileButton
          imageUrl={user?.profilePicture}
          email={user?.email}
          onEditProfile={() => navigate('/loby/profile')}
          onLogout={() => {
            logout()
            navigate('/login')
          }}
          onChangePhoto={() => navigate('/loby/profile?editPhoto=1')}
        />
      </div>
    </div>
  )
}

export default MainLayout
