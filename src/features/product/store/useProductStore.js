import { create } from 'zustand'
import { bankingClient } from '../../../shared/api/adminClient'

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  filters: { type: '', is_active: '' },

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null })
      const { type, is_active } = get().filters
      const params = {}
      if (type) params.type = type
      if (is_active !== '') params.is_active = is_active

      const response = await bankingClient.get('/products', { params })
      set({ products: response.data?.products || [], loading: false })
    } catch (err) {
      if (err.response?.status === 404) {
        set({ products: [], loading: false, error: null })
        return
      }
      set({ error: err.response?.data?.message || 'Error al cargar productos', loading: false })
    }
  },

  createProduct: async (formData) => {
    try {
      set({ loading: true, error: null })
      const response = await bankingClient.post('/products', formData)
      set((state) => ({
        products: [response.data.product, ...state.products],
        loading: false,
      }))
      return response.data.product
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error al crear producto', loading: false })
      return null
    }
  },

  updateProduct: async (id, formData) => {
    try {
      set({ loading: true, error: null })
      const response = await bankingClient.put(`/products/${id}`, formData)
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? response.data.product : p)),
        loading: false,
      }))
      return response.data.product
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error al actualizar producto', loading: false })
      return null
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null })
      await bankingClient.delete(`/products/${id}`)
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false,
      }))
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error al eliminar producto', loading: false })
      return false
    }
  },

  setFilters: (filters) => {
    set({ filters })
    get().fetchProducts()
  },

  clearError: () => set({ error: null }),
}))

export default useProductStore
