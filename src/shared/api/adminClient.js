import axios from 'axios'
import useAuthStore from '../../features/auth/store/useAuthStore'

const apiBase = (import.meta.env.VITE_API_BASE || 'http://localhost:5025/api/v1').replace(/\/$/, '')

/** Servidor Node (Sistema Bancario): transacciones, depósitos, cuentas, etc. */
const bankingApiBase = (
  import.meta.env.VITE_BANKING_API_BASE || 'http://localhost:3000/SistemaBancarioAdmin/v1'
).replace(/\/$/, '')

/** AdminController (.NET) → api/v1/admin */
const adminClient = axios.create({
  baseURL: `${apiBase}/admin`,
  headers: { 'Content-Type': 'application/json' },
})

/** Rutas bajo api/v1 no prefijadas con /admin (UsersController, etc.) */
export const publicClient = axios.create({
  baseURL: apiBase,
  headers: { 'Content-Type': 'application/json' },
})

/** Cliente para el backend Node (MongoDB): /transactions, /accounts, etc. */
export const bankingClient = axios.create({
  baseURL: bankingApiBase,
  headers: { 'Content-Type': 'application/json' },
})

/** Interceptor compartido para agregar token y manejar 401 */
function attachInterceptors(client) {
  client.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type']
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
}

attachInterceptors(adminClient)
attachInterceptors(publicClient)
attachInterceptors(bankingClient)

export default adminClient
