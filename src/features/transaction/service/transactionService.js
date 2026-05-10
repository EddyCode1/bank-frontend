import { publicClient } from '../../../shared/api/adminClient'
import toast from 'react-hot-toast'

export const transactionService = {
  // Obtener mis transacciones con filtros (paginación, tipo, fechas)
  getMyTransactions: async (filters = {}) => {
    try {
      const response = await publicClient.get('/transactions/my-transactions', {
        params: {
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          ...filters
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error fetching my transactions:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener transacciones' 
      }
    }
  },

  // Obtener una transacción por ID
  getTransactionById: async (id) => {
    try {
      const response = await publicClient.get(`/transactions/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error fetching transaction:', error)
      toast.error(error.response?.data?.message || 'Error al obtener transacción')
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener transacción' 
      }
    }
  },

  // Obtener todas las transacciones (ADMIN)
  getAllTransactions: async (filters = {}) => {
    try {
      const response = await publicClient.get('/transactions/all', {
        params: {
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          ...filters
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error fetching all transactions:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener transacciones' 
      }
    }
  },

  // Obtener historial del usuario (depósitos y transferencias)
  getHistoryMe: async (filters = {}) => {
    try {
      const response = await publicClient.get('/transactions/history/me', {
        params: {
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          ...filters
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error fetching my history:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener historial' 
      }
    }
  },

  // Obtener historial de una cuenta (ADMIN)
  getHistoryByAccountId: async (accountId, filters = {}) => {
    try {
      const response = await publicClient.get(`/transactions/history/${accountId}`, {
        params: {
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          ...filters
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error fetching account history:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener historial' 
      }
    }
  },

  // Crear un depósito
  createDeposit: async (depositData) => {
    try {
      const response = await publicClient.post('/transactions/deposit', depositData)
      toast.success('Depósito creado exitosamente')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error creating deposit:', error)
      toast.error(error.response?.data?.message || 'Error al crear depósito')
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear depósito' 
      }
    }
  }
}
