import axios from 'axios'
import useAuthStore from '../../features/auth/store/useAuthStore'
import { handleSessionError } from './sessionErrorHandler'

const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || '/api/v1/Auth',
  headers: { 'Content-Type': 'application/json' },
})

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

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    handleSessionError(error)
    return Promise.reject(error)
  }
)

export default authClient
