import adminClient from '../../../shared/api/adminClient'
import { MOCK_USERS } from '../../../shared/api/adminClient'
import useAuthStore from '../../../features/auth/store/useAuthStore'
import toast from 'react-hot-toast'

/**
 * Adapta la respuesta del backend (name, surname, phone, role) al modelo
 * que usan las vistas (nombre, telefono, rol, cuentas).
 */
function mapUser(raw) {
  if (!raw) return null
  return {
    ...raw,
    nombre: [raw.name, raw.surname].filter(Boolean).join(' ') || raw.nombre || '',
    telefono: raw.phone || raw.telefono || '',
    rol: raw.role || raw.rol || 'USER_ROLE',
    cuentas: raw.cuentas || [],
  }
}

/** Detecta si la sesión activa corresponde a la cuenta de testing */
function isTestingAdmin() {
  const user = useAuthStore.getState().getUser()
  return user?.username === 'ADMINB' || user?.email === 'admin@bank.com'
}

/**
 * Obtener lista de usuarios
 */
export const getUsers = async () => {
  if (isTestingAdmin()) {
    return { success: true, data: MOCK_USERS }
  }
  try {
    const response = await adminClient.get('/users')
    const raw = response.data?.data ?? response.data
    const items = Array.isArray(raw) ? raw : (raw?.items ?? [])
    return { success: true, data: items.map(mapUser) }
  } catch (error) {
    console.error('Error fetching users:', error)
    toast.error(error.response?.data?.message || 'Error al obtener usuarios')
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

/**
 * Obtener detalle de un usuario por ID
 */
export const getUserById = async (userId) => {
  if (isTestingAdmin()) {
    const mockUser = MOCK_USERS.find((u) => u.id === userId)
    if (mockUser) return { success: true, data: mockUser }
  }
  try {
    const response = await adminClient.get(`/users/${userId}`)
    return { success: true, data: mapUser(response.data?.data ?? response.data) }
  } catch (error) {
    console.error('Error fetching user detail:', error)
    toast.error(error.response?.data?.message || 'Error al obtener detalle del usuario')
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

/**
 * Obtener lista de cuentas
 */
export const getAccounts = async () => {
  try {
    const response = await adminClient.get('/accounts')
    return { success: true, data: response.data?.data ?? response.data ?? [] }
  } catch (error) {
    console.error('Error fetching accounts:', error)
    toast.error(error.response?.data?.message || 'Error al obtener cuentas')
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

/**
 * Obtener detalle de una cuenta por ID
 */
export const getAccountById = async (accountId) => {
  try {
    const response = await adminClient.get(`/accounts/${accountId}`)
    return { success: true, data: response.data?.data ?? response.data ?? {} }
  } catch (error) {
    console.error('Error fetching account detail:', error)
    toast.error(error.response?.data?.message || 'Error al obtener detalle de la cuenta')
    return { success: false, error: error.response?.data?.message || error.message }
  }
}
