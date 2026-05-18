import toast from 'react-hot-toast'
import useAuthStore from '../../features/auth/store/useAuthStore'

let lastForbiddenToastAt = 0
const FORBIDDEN_TOAST_COOLDOWN_MS = 2500

function isAuthTokenFailure(error) {
  const message = String(
    error?.response?.data?.message ||
      error?.response?.data?.title ||
      error?.message ||
      ''
  ).toLowerCase()

  return (
    message.includes('token') ||
    message.includes('jwt') ||
    message.includes('expired') ||
    message.includes('expirado') ||
    message.includes('invalid signature') ||
    message.includes('unauthorized')
  )
}

function hardRedirect(path) {
  if (typeof window === 'undefined') return
  if (window.location.pathname === path) return
  window.location.href = path
}

export function handleSessionError(error) {
  const status = error?.response?.status
  const shouldLogout = status === 401 || (status === 403 && isAuthTokenFailure(error))

  if (shouldLogout) {
    useAuthStore.getState().logout()
    toast.error('Tu sesión expiró. Inicia sesión nuevamente.')
    hardRedirect('/login')
    return
  }

  if (status === 403) {
    const now = Date.now()
    if (now - lastForbiddenToastAt >= FORBIDDEN_TOAST_COOLDOWN_MS) {
      lastForbiddenToastAt = now
      toast.error('No tienes permisos para esta acción.')
    }
  }
}
