import { bankingClient } from '../../../shared/api/adminClient'

const defaultBankingBase = import.meta.env.VITE_BANKING_API_BASE || 'http://localhost:3000/SistemaBancarioAdmin/v1'

function resolveBankingError(error, fallback) {
  if (!error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
    return `No hay conexión con el servidor bancario (${defaultBankingBase}). Arranca el API Node y vuelve a intentarlo.`
  }
  return error.response?.data?.message || error.response?.data?.error || fallback || error.message
}

function mapAccount(raw) {
  if (!raw) return null
  return {
    id: raw.id || raw._id || raw.accountId,
    accountNumber: raw.accountNumber || raw.numeroCuenta || raw.numero || raw.account_number,
    type: raw.type || raw.accountType || raw.tipo || 'Corriente',
    currency: raw.currency || raw.moneda || raw.currencyCode || 'GTQ',
    status:
      raw.status || raw.estado || (raw.isActive === false ? 'inactive' : raw.isActive === true ? 'active' : 'active'),
    balance: Number(raw.balance ?? raw.saldo ?? raw.amount ?? 0),
    ownerId: raw.userId || raw.ownerId || raw.usuarioId || raw.customerId,
    ownerName: raw.owner?.nombre || raw.owner?.name || raw.owner?.username || raw.ownerName || raw.username || raw.email || '',
    dailyLimit: Number(raw.dailyLimit ?? raw.limiteDiario ?? raw.daily_limit ?? 0),
    monthlyLimit: Number(raw.monthlyLimit ?? raw.limiteMensual ?? raw.monthly_limit ?? 0),
    createdAt: raw.createdAt || raw.created_at || raw.createdOn,
    raw,
  }
}

function normalizeListing(payload) {
  const data = payload?.data ?? payload
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.accounts)
    ? data.accounts
    : Array.isArray(data?.rows)
    ? data.rows
    : []
  const total = Number(data?.pagination?.total ?? data?.total ?? items.length)
  return { items: items.map(mapAccount), total, pagination: data?.pagination ?? null }
}

function buildParams(filters = {}) {
  const params = {}
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value
    }
  })
  return params
}

export const accountService = {
  getMyAccounts: async (filters = {}) => {
    try {
      const response = await bankingClient.get('/accounts/me', {
        params: buildParams(filters),
      })
      return { success: true, data: normalizeListing(response.data) }
    } catch (error) {
      console.error('Error fetching my accounts:', error)
      return { success: false, error: resolveBankingError(error, 'Error al obtener mis cuentas') }
    }
  },

  getMyInfo: async () => {
    try {
      const response = await bankingClient.get('/accounts/my-info')
      const payload = response.data
      return {
        success: true,
        data: {
          summary: payload.summary || {
            totalAccounts: payload.totalAccounts ?? payload.accounts?.length ?? 0,
            totalBalance: Number(payload.totalBalance ?? payload.balance ?? 0),
          },
          profile: payload.profile ?? payload.user ?? payload.accountHolder,
        },
      }
    } catch (error) {
      // Fallback simple
      if (error.response?.status === 404) {
        const result = await accountService.getMyAccounts({ limit: 50 })
        if (!result.success) return result
        const totalBalance = result.data.items.reduce((sum, account) => sum + Number(account.balance ?? 0), 0)
        return {
          success: true,
          data: {
            summary: {
              totalAccounts: result.data.items.length,
              totalBalance,
            },
            profile: null,
          },
        }
      }
      console.error('Error fetching my account info:', error)
      return { success: false, error: resolveBankingError(error, 'Error al obtener mi información de cuentas') }
    }
  },

  getAccounts: async (filters = {}) => {
    try {
      const response = await bankingClient.get('/accounts/all', {
        params: buildParams(filters),
      })
      return { success: true, data: normalizeListing(response.data) }
    } catch (error) {
      console.error('Error fetching accounts:', error)
      return { success: false, error: resolveBankingError(error, 'Error al obtener cuentas') }
    }
  },

  getAccountById: async (accountId) => {
    try {
      const response = await bankingClient.get(`/accounts/${encodeURIComponent(accountId)}`)
      return { success: true, data: mapAccount(response.data?.data ?? response.data) }
    } catch (error) {
      console.error('Error fetching account by id:', error)
      return { success: false, error: resolveBankingError(error, 'Error al obtener cuenta') }
    }
  },

  createAccount: async (accountData) => {
    try {
      const payload = {
        accountNumber: accountData.accountNumber,
        type: accountData.type,
        currency: accountData.currency,
        estado: accountData.status,
        saldo: accountData.balance !== undefined ? Number(accountData.balance) : undefined,
        ownerId: accountData.ownerId,
        usuarioId: accountData.ownerId,
        dailyLimit: accountData.dailyLimit,
        monthlyLimit: accountData.monthlyLimit,
      }
      const response = await bankingClient.post('/accounts', payload)
      return { success: true, data: mapAccount(response.data?.data ?? response.data) }
    } catch (error) {
      console.error('Error creating account:', error)
      return { success: false, error: resolveBankingError(error, 'Error al crear la cuenta') }
    }
  },

  updateAccount: async (accountId, accountData) => {
    try {
      const payload = {
        type: accountData.type,
        currency: accountData.currency,
        estado: accountData.status,
        dailyLimit: accountData.dailyLimit,
        monthlyLimit: accountData.monthlyLimit,
        saldo: accountData.balance !== undefined ? Number(accountData.balance) : undefined,
      }
      const response = await bankingClient.put(`/accounts/${encodeURIComponent(accountId)}`, payload)
      return { success: true, data: mapAccount(response.data?.data ?? response.data) }
    } catch (error) {
      console.error('Error updating account:', error)
      return { success: false, error: resolveBankingError(error, 'Error al actualizar la cuenta') }
    }
  },

  changeAccountStatus: async (accountId, newStatus) => {
    try {
      if (newStatus === 'active') {
        const response = await bankingClient.post(`/accounts/${encodeURIComponent(accountId)}/activate`)
        return { success: true, data: mapAccount(response.data?.data ?? response.data) }
      }
      const response = await bankingClient.put(`/accounts/${encodeURIComponent(accountId)}`, {
        estado: newStatus,
      })
      return { success: true, data: mapAccount(response.data?.data ?? response.data) }
    } catch (error) {
      // Fallback: update account directly
      if (error.response?.status === 404 || error.response?.status === 400) {
        return accountService.updateAccount(accountId, { status: newStatus })
      }
      console.error('Error changing account status:', error)
      return { success: false, error: resolveBankingError(error, 'Error al cambiar el estado de la cuenta') }
    }
  },

  getAccountTransactions: async (accountId, filters = {}) => {
    try {
      const response = await bankingClient.get(`/accounts/${encodeURIComponent(accountId)}/movements`, {
        params: buildParams(filters),
      })
      const payload = response.data
      const transactions = payload.history ?? payload.transactions ?? payload.data?.transactions ?? payload.movements ?? []
      return { success: true, data: { transactions, total: Number(payload.total_records ?? payload.total ?? transactions.length) } }
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const response = await bankingClient.get(`/transactions/history/${encodeURIComponent(accountId)}`, {
            params: buildParams(filters),
          })
          const payload = response.data
          const transactions = payload.history ?? payload.transactions ?? payload.data?.transactions ?? []
          return { success: true, data: { transactions, total: Number(payload.total_records ?? payload.total ?? transactions.length) } }
        } catch (innerError) {
          console.error('Error fetching account transactions fallback:', innerError)
        }
      }
      console.error('Error fetching account transactions:', error)
      return { success: false, error: resolveBankingError(error, 'Error al obtener movimientos de la cuenta') }
    }
  },
}
