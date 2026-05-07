import axios from 'axios'
import useAuthStore from '../../features/auth/store/useAuthStore'

const adminClient = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_URL || import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

adminClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getToken()
    if (token) {
      // Cambiado de 'Authorization' a 'x-token' para match con tu Backend
      config.headers['x-token'] = token 
    }
    
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

adminClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default adminClient