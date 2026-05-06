import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Páginas públicas
import LoginPage from '../../features/auth/pages/LoginPage'
import RegisterPage from '../../features/auth/pages/RegisterPage'

// Páginas principales
import DashboardPage from '../../features/dashboard/pages/DashboardPage'
import AccountPage from '../../features/account/pages/AccountPage'
import FavoritePage from '../../features/favorite/pages/FavoritePage'
import ProductPage from '../../features/product/pages/ProductPage'
import ServicePage from '../../features/service/pages/ServicePage'
import TransactionPage from '../../features/transaction/pages/TransactionPage'

// Removed ProtectedRoute to allow open access during testing

/**
 * Configuración de rutas
 */
const router = createBrowserRouter([
  // Ruta raíz redirige al login
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  // Rutas públicas
  {
    path: '/login',
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <RegisterPage />
      </AuthLayout>
    ),
  },
  // Rutas principales (ahora sin protección)
  {
    path: '/loby',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'account',
        element: <AccountPage />,
      },
      {
        path: 'favorites',
        element: <FavoritePage />,
      },
      {
        path: 'product', // Ahora es hijo de /loby, la ruta será /loby/product
        element: <ProductPage />,
      },
      {
        path: 'services',
        element: <ServicePage />,
      },
      {
        path: 'transactions',
        element: <TransactionPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router