import axios from 'axios'
import useAuthStore from '../../features/auth/store/useAuthStore'

const apiBase = (import.meta.env.VITE_API_BASE || 'http://localhost:5025/api/v1').replace(/\/$/, '')

// Servidor Node (Sistema Bancario): transacciones, depósitos, etc. (no el Auth .NET)
const bankingApiBase = (
  import.meta.env.VITE_BANKING_API_BASE || 'http://localhost:3000/SistemaBancarioAdmin/v1'
).replace(/\/$/, '')

// Datos de ejemplo para testing (cuando el backend no tiene usuarios aún)
const MOCK_USERS = [
  {
    id: 'user-001',
    nombre: 'Juan García López',
    username: 'jgarcia',
    email: 'juan.garcia@banco.com',
    telefono: '+34 600 111 111',
    rol: 'USER_ROLE',
    direccion: 'Calle Principal 123',
    ciudad: 'Madrid',
    pais: 'España',
    cuentas: [
      { id: 'account-001', numero: '1234567890', tipo: 'Ahorros', saldo: 5000.50, estado: 'active' },
      { id: 'account-002', numero: '0987654321', tipo: 'Corriente', saldo: 2150.75, estado: 'active' },
    ],
  },
  {
    id: 'user-002',
    nombre: 'María Rodríguez Pérez',
    username: 'mrodriguez',
    email: 'maria.rodriguez@banco.com',
    telefono: '+34 600 222 222',
    rol: 'USER_ROLE',
    direccion: 'Avenida Segunda 456',
    ciudad: 'Barcelona',
    pais: 'España',
    cuentas: [
      { id: 'account-003', numero: '5555555555', tipo: 'Ahorros', saldo: 8900.00, estado: 'active' },
    ],
  },
  {
    id: 'user-003',
    nombre: 'Carlos Martínez Sánchez',
    username: 'cmartinez',
    email: 'carlos.martinez@banco.com',
    telefono: '+34 600 333 333',
    rol: 'USER_ROLE',
    direccion: 'Plaza Mayor 789',
    ciudad: 'Valencia',
    pais: 'España',
    cuentas: [
      { id: 'account-004', numero: '3333333333', tipo: 'Corriente', saldo: 3200.25, estado: 'active' },
      { id: 'account-005', numero: '4444444444', tipo: 'Inversión', saldo: 15000.00, estado: 'active' },
      { id: 'account-006', numero: '6666666666', tipo: 'Ahorros', saldo: 1500.00, estado: 'inactive' },
    ],
  },
  {
    id: 'user-004',
    nombre: 'Ana Fernández López',
    username: 'afernandez',
    email: 'ana.fernandez@banco.com',
    telefono: '+34 600 444 444',
    rol: 'USER_ROLE',
    direccion: undefined,
    ciudad: undefined,
    pais: undefined,
    cuentas: [
      { id: 'account-007', numero: '7777777777', tipo: 'Ahorros', saldo: 4500.75, estado: 'active' },
    ],
  },
  {
    id: 'user-005',
    nombre: 'Pedro González López',
    username: 'pgonzalez',
    email: 'pedro.gonzalez@banco.com',
    telefono: '+34 600 555 555',
    rol: 'USER_ROLE',
    direccion: undefined,
    ciudad: undefined,
    pais: undefined,
    cuentas: [],
  },
]

// AdminController → api/v1/admin
const adminClient = axios.create({
  baseURL: `${apiBase}/admin`,
  headers: { 'Content-Type': 'application/json' },
})

// Rutas bajo api/v1 no prefijadas con /admin (UsersController, etc.)
export const publicClient = axios.create({
  baseURL: apiBase,
  headers: { 'Content-Type': 'application/json' },
})

/** Cliente para el backend Node (MongoDB): /transactions, /accounts, etc. */
export const bankingClient = axios.create({
  baseURL: bankingApiBase,
  headers: { 'Content-Type': 'application/json' },
})

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
      // Fallback de usuarios mock cuando el backend devuelve 404
      if (error.config?.url?.includes('/users') && error.response?.status === 404) {
        const urlParts = error.config.url.split('/')
        const lastSegment = urlParts[urlParts.length - 1]
        const isListRequest = lastSegment === 'users' || lastSegment === ''

        if (!isListRequest) {
          // GET /users/:id  →  buscar en mock
          const mockUser = MOCK_USERS.find((u) => u.id === lastSegment)
          if (mockUser) {
            return Promise.resolve({ status: 200, data: { data: mockUser } })
          }
        } else {
          // GET /users  →  devolver lista mock completa
          return Promise.resolve({ status: 200, data: { data: MOCK_USERS } })
        }
      }

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
export { MOCK_USERS }
