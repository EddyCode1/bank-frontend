import adminClient, { publicClient } from '../../../shared/api/adminClient'
import { MOCK_USERS, TESTING_ADMIN_CREDENTIALS } from '../../../shared/mocks'
import useAuthStore from '../../auth/store/useAuthStore'

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
  return (
    user?.username === TESTING_ADMIN_CREDENTIALS.username ||
    user?.email === TESTING_ADMIN_CREDENTIALS.email
  )
}

export const generateAccountNumber = () =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString()

/**
 * Obtiene todos los usuarios (ADMIN).
 * Cuando la sesión es la cuenta de testing (ADMINB) se devuelven los
 * usuarios de ejemplo para poder probar el módulo sin datos reales.
 */
export const getUsers = async ({ search, page = 1, limit = 10 } = {}) => {
  if (isTestingAdmin()) {
    return {
      success: true,
      data: {
        items: MOCK_USERS,
        total: MOCK_USERS.length,
        pagination: { page: 1, limit: MOCK_USERS.length, total: MOCK_USERS.length },
      },
    }
  }

  try {
    const response = await adminClient.get('/users', {
      params: {
        search: search?.trim() || undefined,
        page,
        limit,
      },
    })
    const raw = response.data?.data ?? response.data
    const items = Array.isArray(raw) ? raw : raw?.items ?? raw?.users ?? []
    const total = Number(raw?.pagination?.total ?? raw?.total ?? items.length)
    return {
      success: true,
      data: {
        items: items.map(mapUser),
        total,
        pagination: raw?.pagination ?? { page, limit, total },
      },
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, data: { items: [], total: 0 }, error: parseBackendError(error) }
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
    return { success: false, error: parseBackendError(error) }
  }
}

/**
 * Extrae un mensaje legible de errores de FluentValidation o errores genéricos del backend.
 * FluentValidation devuelve { errors: { Campo: ["msg1", "msg2"] } }
 */
function parseBackendError(error) {
  const data = error.response?.data
  if (!data) return error.message

  // Formato FluentValidation: { errors: { Campo: ["mensaje"] } }
  if (data.errors && typeof data.errors === 'object') {
    const msgs = Object.values(data.errors).flat()
    if (msgs.length > 0) return msgs.join(' | ')
  }

  // Formato simple: { message: "..." } o { title: "..." }
  return data.message || data.title || error.message
}

/**
 * Crea un nuevo cliente (ADMIN).
 * Si el rol seleccionado es ADMIN_ROLE, asigna el rol después de crear el usuario.
 * Mapea campos del formulario al contrato CreateClientDto del backend.
 */
export const createUser = async (userData) => {
  try {
    if (userData.ingresosMensuales < 100) {
      throw new Error('Los ingresos mensuales deben ser al menos Q100')
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
    const createdUser = response.data?.data ?? response.data

    // Si el admin seleccionó rol ADMIN_ROLE, asignar el rol después de crear
    if (userData.rol === 'ADMIN_ROLE' && createdUser?.id) {
      const roleResult = await updateUserRole(createdUser.id, 'ADMIN_ROLE')
      if (!roleResult.success) {
        // Usuario creado pero sin el rol admin; se avisa pero no se falla
        console.warn('Usuario creado, pero no se pudo asignar rol admin:', roleResult.error)
        return {
          success: true,
          data: createdUser,
          warning: 'Usuario creado correctamente, pero no se pudo asignar el rol de administrador.',
        }
      }
    }

    return { success: true, data: createdUser }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: parseBackendError(error) }
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
      status: userData.status || userData.estado || undefined,
    }

    const response = await adminClient.put(`/users/${userId}`, payload)
    return { success: true, data: response.data?.data ?? response.data }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: parseBackendError(error) }
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
    return { success: false, error: parseBackendError(error) }
  }
}

/**
 * Cambia el rol de un usuario.
 * UsersController: PUT api/v1/Users/{userId}/role — body { roleName }
 * NOTA: se usa /Users/... con barra inicial para evitar concatenación incorrecta con baseURL.
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await publicClient.put(`/Users/${encodeURIComponent(userId)}/role`, {
      roleName: newRole,
    })
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: parseBackendError(error) }
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
