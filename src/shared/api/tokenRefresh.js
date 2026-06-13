import axios from 'axios'
import toast from 'react-hot-toast'
import useAuthStore from '../../features/auth/store/useAuthStore'

const authBaseURL = import.meta.env.VITE_AUTH_URL || '/api/v1/Auth'

let refreshPromise = null

async function requestNewTokens(refreshToken) {
  const response = await axios.post(
    `${authBaseURL.replace(/\/$/, '')}/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  )
  const data = response.data || {}
  const token = data.token || data.Token
  const newRefreshToken = data.refreshToken || data.RefreshToken || refreshToken

  if (!token) {
    throw new Error('El backend no devolvió un token renovado')
  }

  useAuthStore.getState().setTokens(token, newRefreshToken)
  return { token, refreshToken: newRefreshToken }
}

export async function refreshAccessToken() {
  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) {
    throw new Error('No hay refresh token disponible')
  }

  if (!refreshPromise) {
    refreshPromise = requestNewTokens(refreshToken).finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

function hardRedirect(path) {
  if (typeof window === 'undefined') return
  if (window.location.pathname === path) return
  window.location.href = path
}

export function forceLogout(message = 'Tu sesión expiró por seguridad. Inicia sesión de nuevo.') {
  useAuthStore.getState().logout()
  toast.error(message)
  hardRedirect('/login')
}

export function attachTokenRefreshInterceptor(client) {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      const status = error?.response?.status

      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest._skipAuthRefresh ||
        originalRequest.url?.includes('/refresh')
      ) {
        return Promise.reject(error)
      }

      const refreshToken = useAuthStore.getState().refreshToken
      if (!refreshToken) {
        forceLogout()
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const { token } = await refreshAccessToken()
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${token}`
        return client(originalRequest)
      } catch (refreshError) {
        forceLogout()
        return Promise.reject(refreshError)
      }
    }
  )
}
