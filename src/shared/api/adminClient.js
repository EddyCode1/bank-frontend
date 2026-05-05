import axios from 'axios'
import useAuthStore from '../../features/auth/store/useAuthStore'

// DATOS MOCK PARA DESARROLLO
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
    ]
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
    ]
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
    ]
  },
  {
    id: 'user-004',
    nombre: 'Ana Fernández López',
    username: 'afernandez',
    email: 'ana.fernandez@banco.com',
    telefono: '+34 600 444 444',
    rol: 'USER_ROLE',
    cuentas: [
      { id: 'account-007', numero: '7777777777', tipo: 'Ahorros', saldo: 4500.75, estado: 'active' },
    ]
  },
  {
    id: 'user-005',
    nombre: 'Pedro González López',
    username: 'pgonzalez',
    email: 'pedro.gonzalez@banco.com',
    telefono: '+34 600 555 555',
    rol: 'USER_ROLE',
    cuentas: []
  },
]

const adminClient = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requests
adminClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Si es FormData, no establecer Content-Type (axios lo hace automáticamente)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para responses - MOCK PARA TESTING
adminClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // MOCK DE USUARIOS
    if (error.config.url.includes('/users') && error.response?.status === 404) {
      const urlParts = error.config.url.split('/')
      const userId = urlParts[urlParts.length - 1]
      
      if (userId && userId !== 'users') {
        // GET /users/:id
        const user = MOCK_USERS.find(u => u.id === userId)
        if (user) {
          return Promise.resolve({
            status: 200,
            data: { data: user }
          })
        }
      } else {
        // GET /users
        return Promise.resolve({
          status: 200,
          data: { data: MOCK_USERS }
        })
      }
    }
    
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default adminClient
export { MOCK_USERS }