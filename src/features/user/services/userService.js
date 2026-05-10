import adminClient, { publicClient, MOCK_USERS } from '../../../shared/api/adminClient'
import useAuthStore from '../../../features/auth/store/useAuthStore'

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

export const generateAccountNumber = () =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString()

/**
 * Obtiene todos los usuarios (ADMIN).
 * Cuando la sesión es la cuenta de testing (ADMINB) se devuelven los
 * usuarios de ejemplo para poder probar el módulo sin datos reales.
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
    return { success: false, data: [], error: error.response?.data?.message || error.message }
  }
}

/**
 * Obtiene un usuario por ID (ADMIN).
 * Con la cuenta de testing devuelve el usuario mock correspondiente.
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
    console.error('Error fetching user:', error)
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

/**
 * Crea un nuevo cliente (ADMIN)
 * Mapea campos del formulario al contrato CreateClientDto del backend
 */
export const createUser = async (userData) => {
  try {
    if (userData.ingresosMensuales <= 100) {
      throw new Error('Los ingresos mensuales deben ser mayores a Q100')
    }

    const nameParts = String(userData.nombre || '').trim().split(/\s+/)
    const payload = {
      name: nameParts[0] || '',
      surname: nameParts.slice(1).join(' ') || '-',
      username: userData.username,
      dpi: userData.dpi || '',
      address: userData.direccion || '',
      phone: userData.telefono || '',
      email: userData.correo || '',
      password: userData.password,
      workName: userData.nombreTrabajo || '',
      monthlyIncome: Number(userData.ingresosMensuales) || 0,
    }

    const response = await adminClient.post('/create-client', payload)
    return { success: true, data: response.data?.data ?? response.data }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

/**
 * Actualiza un usuario existente (ADMIN)
 * Mapea campos del formulario al contrato UpdateUserDto del backend
 */
export const updateUser = async (userId, userData) => {
  try {
    const nameParts = String(userData.nombre || '').trim().split(/\s+/)
    const payload = {
      name: nameParts[0] || undefined,
      surname: nameParts.slice(1).join(' ') || undefined,
      address: userData.direccion || undefined,
      phone: userData.telefono || undefined,
      workName: userData.nombreTrabajo || undefined,
      monthlyIncome: userData.ingresosMensuales ? Number(userData.ingresosMensuales) : undefined,
    }

    const response = await adminClient.put(`/users/${userId}`, payload)
    return { success: true, data: response.data?.data ?? response.data }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

/**
 * Elimina un usuario (ADMIN)
 */
export const deleteUser = async (userId) => {
  try {
    const response = await adminClient.delete(`/users/${userId}`)
    return { success: true, data: response.data?.data ?? response.data }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

/**
 * Cambia el rol de un usuario
 * UsersController: PUT api/v1/Users/{userId}/role — body { roleName }
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await publicClient.put(`Users/${encodeURIComponent(userId)}/role`, {
      roleName: newRole,
    })
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  generateAccountNumber,
}
