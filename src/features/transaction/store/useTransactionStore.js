import { create } from 'zustand'
import { transactionService } from '../service/transactionService'

const useTransactionStore = create((set, get) => ({
  // State
  transactions: [],
  history: [],
  currentTransaction: null,
  loading: false,
  error: null,
  pagination: {
    limit: 50,
    offset: 0,
    total: 0
  },

  // Actions
  setTransactions: (transactions) => set({ transactions }),
  setHistory: (history) => set({ history }),
  setCurrentTransaction: (transaction) => set({ currentTransaction: transaction }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),

  // Fetch my transactions
  fetchMyTransactions: async (filters = {}) => {
    set({ loading: true, error: null })
    const result = await transactionService.getMyTransactions(filters)
    
    if (result.success) {
      set({ 
        transactions: result.data.transactions || result.data.data || [],
        pagination: {
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          total: result.data.total || result.data.transactions?.length || 0
        },
        loading: false 
      })
    } else {
      set({ error: result.error, loading: false })
    }
    return result
  },

  // Fetch all transactions (ADMIN)
  fetchAllTransactions: async (filters = {}) => {
    set({ loading: true, error: null })
    const result = await transactionService.getAllTransactions(filters)
    
    if (result.success) {
      set({ 
        transactions: result.data.transactions || result.data.data || [],
        pagination: {
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          total: result.data.total || result.data.transactions?.length || 0
        },
        loading: false 
      })
    } else {
      set({ error: result.error, loading: false })
    }
    return result
  },

  // Fetch transaction by ID
  fetchTransactionById: async (id) => {
    set({ loading: true, error: null })
    const result = await transactionService.getTransactionById(id)
    
    if (result.success) {
      set({ currentTransaction: result.data.data || result.data, loading: false })
    } else {
      set({ error: result.error, loading: false })
    }
    return result
  },

  // Fetch my history
  fetchHistoryMe: async (filters = {}) => {
    set({ loading: true, error: null })
    const result = await transactionService.getHistoryMe(filters)
    
    if (result.success) {
      set({ 
        history: result.data.transactions || result.data.data || [],
        pagination: {
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          total: result.data.total || result.data.transactions?.length || 0
        },
        loading: false 
      })
    } else {
      set({ error: result.error, loading: false })
    }
    return result
  },

  // Fetch history by account ID (ADMIN)
  fetchHistoryByAccountId: async (accountId, filters = {}) => {
    set({ loading: true, error: null })
    const result = await transactionService.getHistoryByAccountId(accountId, filters)
    
    if (result.success) {
      set({ 
        history: result.data.transactions || result.data.data || [],
        pagination: {
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          total: result.data.total || result.data.transactions?.length || 0
        },
        loading: false 
      })
    } else {
      set({ error: result.error, loading: false })
    }
    return result
  },

  // Create deposit
  createDeposit: async (depositData) => {
    set({ loading: true, error: null })
    const result = await transactionService.createDeposit(depositData)
    
    if (result.success) {
      set({ loading: false })
      // Refresh transactions after creating deposit
      const state = get()
      await state.fetchMyTransactions()
    } else {
      set({ error: result.error, loading: false })
    }
    return result
  },

  // Clear state
  clearTransactionState: () => set({ 
    transactions: [],
    history: [],
    currentTransaction: null,
    error: null,
    pagination: { limit: 50, offset: 0, total: 0 }
  })
}))

export default useTransactionStore
