import authClient from '../../../shared/api/authClient'
import toast from 'react-hot-toast'

/**
 * Normaliza la estructura del usuario para el store.
 */
function mapUserForStore(userDetails = {}) {
  return {
    id: userDetails.id || userDetails._id || null,
    nombre:
      [userDetails.name, userDetails.surname].filter(Boolean).join(' ') ||
      userDetails.nombre ||
      userDetails.username ||
      '',
    username: userDetails.username || userDetails.nombre || '',
    email: userDetails.email || '',
    telefono: userDetails.telefono || userDetails.phone || userDetails.contact_phone_number || '',
    profilePicture: userDetails.profilePicture || null,
    rol: userDetails.role || userDetails.rol || 'USER_ROLE',
  }
}

export const authService = {
  login: async (email, password) => {
    try {
      const response = await authClient.post('/login', { emailOrUsername: email, password })
      const data = response.data || {}
      const token = data.token
      const compactUser = data.userDetails || data.data || data.user || {}

      if (!token) {
        throw new Error('El backend no devolvió un token de autenticación')
      }

      // Tras login, pedir el perfil completo para evitar campos vacios en "Mi perfil".
      let fullUser = compactUser
      try {
        const profileResponse = await authClient.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const payload = profileResponse.data || {}
        fullUser = payload.data ?? payload
      } catch {
        // Si falla el perfil, usamos la carga compacta del login como fallback.
      }

      return {
        success: true,
        token,
        refreshToken: data.refreshToken || null,
        user: mapUserForStore(fullUser),
      }
    } catch (error) {
      console.error('Login error:', error)

      toast.error(
        error.response?.data?.message || error.message || 'Error al iniciar sesión'
      )
      return { success: false, error: error.response?.data?.message || error.message }
    }
  },

  register: async (userData) => {
    try {
      const nameParts = (userData.nombre || '').trim().split(/\s+/)
      const payload = {
        name: nameParts[0] || '',
        surname: nameParts.slice(1).join(' ') || '-',
        username: userData.username,
        email: userData.email,
        phone: userData.telefono || '',
        password: userData.password,
      }
      const response = await authClient.post('/register', payload)
      return { success: true, user: response.data }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar usuario')
      return { success: false, error: error.response?.data?.message || error.message }
    }
  },

  getCurrentUser: async () => {
    try {
      // AuthController: GET api/v1/Auth/profile
      const response = await authClient.get('/profile')
      const payload = response.data || {}
      const user = payload.data ?? payload
      return { success: true, user: mapUserForStore(user) }
    } catch {
      return { success: false, error: 'Token inválido' }
    }
  },

  logout: () => {
    return { success: true }
  },
}
