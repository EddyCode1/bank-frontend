import axios from 'axios'
import useAuthStore from '../../features/auth/store/useAuthStore'

// Instancia cliente para autenticación
const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requests (agregar token)
authClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para responses (manejar 401)
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = useAuthStore.getState().refreshToken
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_AUTH_URL}/refresh`,
            { refreshToken }
          )

          useAuthStore.getState().setTokens(
            response.data.token,
            response.data.refreshToken
          )

          originalRequest.headers.Authorization = `Bearer ${response.data.token}`
          return authClient(originalRequest)
        }
      } catch {
        // Durante pruebas no forzamos redirección automática al login
        // para evitar que vistas públicas que hacen requests se redirijan.
        useAuthStore.getState().logout()
        // Nota: no hacemos `window.location.href = '/login'` aquí
      }
    }

    return Promise.reject(error)
  }
)

export default authClient
