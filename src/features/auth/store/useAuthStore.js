import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Usuario de prueba para desarrollo
const MOCK_USER = {
  id: 'user-123',
  nombre: 'Admin Usuario',
  username: 'admin',
  email: 'admin@banco.com',
  telefono: '+34 600 123 456',
  rol: 'ADMIN_ROLE',
  profilePicture: null,
}

const MOCK_TOKEN = 'mock-token-for-development'

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: MOCK_TOKEN,
      user: MOCK_USER,
      refreshToken: null,
      isAuthenticated: true,

      login: (token, user, refreshToken = null) =>
        set({ token, user, refreshToken, isAuthenticated: true }),
      setTokens: (token, refreshToken = null) => set({ token, refreshToken }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null, refreshToken: null, isAuthenticated: false }),

      getToken: () => get().token,
      getUser: () => get().user,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
