import { create } from 'zustand'
import adminClient from '../../../shared/api/adminClient'

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

      const response = await adminClient.get('/products', { params })
      set({ products: response.data.products || [], loading: false })
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al cargar productos'
      set({ error: errorMsg, loading: false })
    }
  },

  createProduct: async (formData) => {
    try {
      set({ loading: true, error: null })
      const response = await adminClient.post('/products', formData)
      set((state) => ({
        products: [response.data.product, ...state.products],
        loading: false,
      }))
      return response.data.product
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al crear producto'
      set({ error: errorMsg, loading: false })
      throw err
    }
  },

  updateProduct: async (id, formData) => {
    try {
      set({ loading: true, error: null })
      const response = await adminClient.put(`/products/${id}`, formData)
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? response.data.product : p
        ),
        loading: false,
      }))
      return response.data.product
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar producto'
      set({ error: errorMsg, loading: false })
      throw err
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null })
      await adminClient.delete(`/products/${id}`)
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false,
      }))
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al eliminar producto'
      set({ error: errorMsg, loading: false })
      throw err
    }
  },

  setFilters: (filters) => {
    set({ filters })
    get().fetchProducts()
  },

  clearError: () => set({ error: null }),
}))

export default useProductStore