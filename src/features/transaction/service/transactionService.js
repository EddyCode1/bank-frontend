import { bankingClient } from '../../../shared/api/adminClient'
import toast from 'react-hot-toast'

/** Mensaje cuando el servidor Node (MongoDB) no responde — típico ERR_CONNECTION_REFUSED. */
function bankingUnreachableMessage() {
  const base = import.meta.env.VITE_BANKING_API_BASE || 'http://localhost:3000/SistemaBancarioAdmin/v1'
  return `No hay conexión con el servidor bancario (${base}). Arranca el API Node en Sistema-Bancario--SCRUM (pnpm dev o npm run dev) y revisa MongoDB.`
}

function resolveBankingError(error, fallback) {
  if (!error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
    return bankingUnreachableMessage()
  }
  return error.response?.data?.message || fallback
}

/**
 * El backend Node pagina con `page`; el store usa offset/limit.
 */
function offsetToPage(offset, limit) {
  const l = limit && limit > 0 ? limit : 10
  const o = offset ?? 0
  return Math.floor(o / l) + 1
}

/**
 * Contrato createDeposit del servidor Node: accountNumber, amount, currency opcional, description opcional.
 */
function mapDepositBody(depositData) {
  const accountNumber = String(depositData.accountNumber ?? depositData.accountId ?? '').trim()
  const rawAmount = depositData.amount
  const amount = typeof rawAmount === 'number' ? rawAmount : parseFloat(String(rawAmount))
  const descriptionParts = [depositData.reference, depositData.concept].filter(
    (x) => x != null && String(x).trim() !== ''
  )
  const description = descriptionParts.length ? descriptionParts.join(' — ') : undefined

  const body = {
    accountNumber,
    amount,
    currency: depositData.currency ?? 'GTQ',
  }
  if (description) body.description = description
  return body
}

export const transactionService = {
  getMyTransactions: async (filters = {}) => {
    const limit = filters.limit || 50
    const offset = filters.offset ?? 0
    try {
      const response = await bankingClient.get('/transactions/my-transactions', {
        params: {
          page: offsetToPage(offset, limit),
          limit,
          ...filters,
        },
      })
      const payload = response.data
      return {
        success: true,
        data: {
          transactions: payload.transactions ?? [],
          total: payload.pagination?.total ?? payload.transactions?.length ?? 0,
          summary: payload.summary,
          pagination: payload.pagination,
        },
      }
    } catch (error) {
      console.error('Error fetching my transactions:', error)
      return {
        success: false,
        error: resolveBankingError(error, 'Error al obtener transacciones'),
      }
    }
  },

  getTransactionById: async (id) => {
    try {
      const response = await bankingClient.get(`/transactions/${id}`)
      const payload = response.data
      const tx = payload.transaction ?? payload.data?.transaction ?? payload
      return { success: true, data: tx }
    } catch (error) {
      console.error('Error fetching transaction:', error)
      const msg = resolveBankingError(error, 'Error al obtener transacción')
      toast.error(msg)
      return {
        success: false,
        error: msg,
      }
    }
  },

  getAllTransactions: async (filters = {}) => {
    const limit = filters.limit || 50
    const offset = filters.offset ?? 0
    try {
      const response = await bankingClient.get('/transactions/all', {
        params: {
          page: offsetToPage(offset, limit),
          limit,
          ...filters,
        },
      })
      const payload = response.data
      return {
        success: true,
        data: {
          transactions: payload.transactions ?? [],
          total: payload.pagination?.total ?? payload.transactions?.length ?? 0,
          pagination: payload.pagination,
        },
      }
    } catch (error) {
      console.error('Error fetching all transactions:', error)
      return {
        success: false,
        error: resolveBankingError(error, 'Error al obtener transacciones'),
      }
    }
  },

  getHistoryMe: async (filters = {}) => {
    try {
      const response = await bankingClient.get('/transactions/history/me', {
        params: { limit: filters.limit || 50, offset: filters.offset || 0, ...filters },
      })
      const payload = response.data
      const history = payload.history ?? []
      return {
        success: true,
        data: {
          transactions: history,
          total: payload.total_records ?? history.length,
        },
      }
    } catch (error) {
      console.error('Error fetching my history:', error)
      return {
        success: false,
        error: resolveBankingError(error, 'Error al obtener historial'),
      }
    }
  },

  getHistoryByAccountId: async (accountId, filters = {}) => {
    try {
      const response = await bankingClient.get(`/transactions/history/${accountId}`, {
        params: { limit: filters.limit || 50, offset: filters.offset || 0, ...filters },
      })
      const payload = response.data
      const history = payload.history ?? []
      return {
        success: true,
        data: {
          transactions: history,
          total: payload.total_records ?? history.length,
        },
      }
    } catch (error) {
      console.error('Error fetching account history:', error)
      return {
        success: false,
        error: resolveBankingError(error, 'Error al obtener historial'),
      }
    }
  },

  createDeposit: async (depositData) => {
    try {
      const body = mapDepositBody(depositData)
      const response = await bankingClient.post('/transactions/deposit', body)
      toast.success('Depósito creado exitosamente')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error creating deposit:', error)
      const msg = resolveBankingError(error, 'Error al crear depósito')
      toast.error(msg)
      return { success: false, error: msg }
    }
  },
}
