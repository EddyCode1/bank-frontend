import adminClient from '../../../shared/api/adminClient'
import toast from 'react-hot-toast'

/**
 * Obtener lista de usuarios
 */
export const getUsers = async () => {
  try {
    const response = await adminClient.get('/users')
    return {
      success: true,
      data: response.data.data || response.data || [],
    }
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
  try {
    const response = await adminClient.get(`/users/${userId}`)
    return {
      success: true,
      data: response.data.data || response.data || {},
    }
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
    return {
      success: true,
      data: response.data.data || response.data || [],
    }
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
    return {
      success: true,
      data: response.data.data || response.data || {},
    }
  } catch (error) {
    console.error('Error fetching account detail:', error)
    toast.error(error.response?.data?.message || 'Error al obtener detalle de la cuenta')
    return { success: false, error: error.response?.data?.message || error.message }
  }
}
