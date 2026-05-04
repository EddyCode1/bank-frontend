import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../shared/stores/useAuthStore'

/**
 * Sidebar simplificado: solo botones para probar vistas.
 */
const Sidebar = () => {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 p-4">
      <nav className="flex flex-col gap-2">
        <Link to="/loby" className="block px-3 py-2 bg-gray-100 rounded">Dashboard</Link>
        <Link to="/loby/account" className="block px-3 py-2 bg-gray-100 rounded">Account</Link>
        <Link to="/loby/favorites" className="block px-3 py-2 bg-gray-100 rounded">Favorites</Link>
        <Link to="/loby/products" className="block px-3 py-2 bg-gray-100 rounded">Products</Link>
        <Link to="/loby/services" className="block px-3 py-2 bg-gray-100 rounded">Services</Link>
        <Link to="/loby/transactions" className="block px-3 py-2 bg-gray-100 rounded">Transactions</Link>
        <Link to="/loby/profile" className="block px-3 py-2 bg-gray-100 rounded">Profile</Link>
      </nav>

      <div className="mt-4">
        <button onClick={handleLogout} className="w-full px-3 py-2 bg-red-500 text-white rounded">Cerrar Sesión</button>
      </div>
    </aside>
  )
}

export default Sidebar
