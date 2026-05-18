import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Feature exports (usando barrel exports)
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
  ResendVerificationPage,
  ForbiddenPage,
} from '../../features/auth'
import { DashboardPage } from '../../features/dashboard'
import { AccountPage, ProfilePage } from '../../features/account'
import { FavoritePage } from '../../features/favorite'
import { ProductPage } from '../../features/product'
import { ServicePage } from '../../features/service'
import { TransactionPage } from '../../features/transaction'
import { UsersPage, UserDetailPage } from '../../features/user'
import ProtectedRoute from './ProtectedRoute'

/**
 * Configuración de rutas de la aplicación
 */
const router = createBrowserRouter([
  // Ruta raíz redirige al dashboard
  {
    path: '/',
    element: <Navigate to="/loby" replace />,
  },
  // Rutas públicas (autenticación)
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
  {
    path: '/forgot-password',
    element: (
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <AuthLayout>
        <ResetPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <AuthLayout>
        <VerifyEmailPage />
      </AuthLayout>
    ),
  },
  {
    path: '/resend-verification',
    element: (
      <AuthLayout>
        <ResendVerificationPage />
      </AuthLayout>
    ),
  },
  // Rutas protegidas (requieren autenticación)
  {
    path: '/loby',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
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
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'favorites',
        element: <FavoritePage />,
      },
      {
        path: 'products',
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
      {
        path: 'users',
        element: (
          <ProtectedRoute requiredRole="ADMIN_ROLE">
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/:userId',
        element: (
          <ProtectedRoute requiredRole="ADMIN_ROLE">
            <UserDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'forbidden',
        element: <ForbiddenPage />,
      },
    ],
  },
  // Cualquier otra ruta redirige al inicio
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router
