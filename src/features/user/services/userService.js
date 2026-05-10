import adminClient from '../../../shared/api/adminClient'

/**
 * Genera un número de cuenta aleatorio de 10 dígitos
 */
export const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString()
}

/**
 * Obtiene todos los usuarios (ADMIN)
 */
export const getUsers = async () => {
  try {
    const response = await adminClient.get('/users')
    // Manejar diferentes estructuras de respuesta del backend
    const data = response.data.data || response.data.users || response.data || []
    return {
      success: true,
      data: Array.isArray(data) ? data : []
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || error.message
    }
  }
}

/**
 * Obtiene un usuario por ID (ADMIN)
 */
export const getUserById = async (userId) => {
  const response = await adminClient.get(`/users/${userId}`)
  return response.data
}

/**
 * Crea un nuevo usuario/cliente (ADMIN)
 * @param {Object} userData - Datos del nuevo usuario
 * @param {string} userData.nombre - Nombre completo
 * @param {string} userData.username - Nombre de usuario (único)
 * @param {string} userData.numeroCuenta - Número de cuenta (generado automáticamente)
 * @param {string} userData.dpi - DPI (13 dígitos)
 * @param {string} userData.direccion - Dirección
 * @param {string} userData.telefono - Teléfono/celular (8 dígitos)
 * @param {string} userData.correo - Email
 * @param {string} userData.password - Contraseña
 * @param {string} userData.nombreTrabajo - Nombre del trabajo
 * @param {number} userData.ingresosMensuales - Ingresos (> Q100)
 */
export const createUser = async (userData) => {
  try {
    // Validar ingresos mínimos
    if (userData.ingresosMensuales <= 100) {
      throw new Error('Los ingresos mensuales deben ser mayores a Q100')
    }

    // Generar número de cuenta si no viene
    if (!userData.numeroCuenta) {
      userData.numeroCuenta = generateAccountNumber()
    }

    // Asegurar rol de usuario por defecto
    if (!userData.rol) {
      userData.rol = 'USER_ROLE'
    }

    const response = await adminClient.post('/users', userData)
    return {
      success: true,
      data: response.data.data || response.data
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}

/**
 * Actualiza un usuario existente (ADMIN)
 * No permite editar DPI ni password
 */
export const updateUser = async (userId, userData) => {
  try {
    // Filtrar campos no editables
    // eslint-disable-next-line no-unused-vars
    const { dpi, password, numeroCuenta, ...editableData } = userData

    const response = await adminClient.put(`/users/${userId}`, editableData)
    return {
      success: true,
      data: response.data.data || response.data
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}

/**
 * Elimina un usuario (ADMIN)
 */
export const deleteUser = async (userId) => {
  try {
    const response = await adminClient.delete(`/users/${userId}`)
    return {
      success: true,
      data: response.data.data || response.data
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}

/**
 * Cambia el rol de un usuario (ADMIN)
 */
export const updateUserRole = async (userId, newRole) => {
  const response = await adminClient.put(`/users/${userId}/role`, { rol: newRole })
  return response.data
}

/**
 * Obtiene las cuentas de un usuario con más movimientos (ADMIN)
 */
export const getUserAccountsWithMovements = async (userId) => {
  const response = await adminClient.get(`/users/${userId}/accounts-movements`)
  return response.data
}

/**
 * Obtiene los últimos 5 movimientos de un usuario (ADMIN)
 */
export const getUserLastMovements = async (userId, limit = 5) => {
  const response = await adminClient.get(`/users/${userId}/last-movements?limit=${limit}`)
  return response.data
}

/**
 * Realiza un depósito a una cuenta (ADMIN)
 * @param {string} accountNumber - Número de cuenta destino
 * @param {number} amount - Monto a depositar
 * @param {string} description - Descripción del depósito
 */
export const createDeposit = async (accountNumber, amount, description = 'Depósito administrativo') => {
  const response = await adminClient.post('/deposits', {
    numeroCuenta: accountNumber,
    monto: amount,
    descripcion: description,
  })
  return response.data
}

/**
 * Revierte un depósito (ADMIN)
 * Solo disponible dentro de 1 minuto
 */
export const reverseDeposit = async (depositId) => {
  const response = await adminClient.post(`/deposits/${depositId}/reverse`)
  return response.data
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  generateAccountNumber,
  getUserAccountsWithMovements,
  getUserLastMovements,
  createDeposit,
  reverseDeposit,
}
