import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const PROFILE_PIC_PREFIX = 'bq-profile-pic-'

function profilePicStorageKey(user) {
  if (!user) return null
  const key = user.id ?? user.username
  if (key == null || key === '') return null
  return `${PROFILE_PIC_PREFIX}${String(key)}`
}

function readStoredProfilePicture(user) {
  const k = profilePicStorageKey(user)
  if (!k) return null
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}

function writeStoredProfilePicture(user, dataUrl) {
  const k = profilePicStorageKey(user)
  if (!k || !dataUrl) return
  try {
    localStorage.setItem(k, dataUrl)
  } catch (e) {
    console.warn('[auth] No se pudo persistir la foto de perfil:', e.message)
  }
}

function removeStoredProfilePicture(user) {
  const k = profilePicStorageKey(user)
  if (!k) return
  try {
    localStorage.removeItem(k)
  } catch {
    /* ignore */
  }
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (token, user, refreshToken = null) => {
        const storedPic = user ? readStoredProfilePicture(user) : null
        const mergedUser = user
          ? {
              ...user,
              profilePicture:
                storedPic || user.profilePicture || user.avatar || null,
            }
          : null
        set({
          token,
          user: mergedUser,
          refreshToken,
          isAuthenticated: true,
        })
      },
      setTokens: (token, refreshToken = null) => set({ token, refreshToken }),
      setUser: (user) => set({ user }),
      /** Actualiza campos del usuario en sesión y persiste la foto en este dispositivo */
      patchUser: (partial) =>
        set((state) => {
          if (!state.user) return state
          const nextUser = { ...state.user, ...partial }
          if (Object.prototype.hasOwnProperty.call(partial, 'profilePicture')) {
            if (partial.profilePicture) {
              writeStoredProfilePicture(nextUser, partial.profilePicture)
            } else {
              removeStoredProfilePicture(nextUser)
            }
          }
          return { user: nextUser }
        }),
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

// Si la hidratación guardó el usuario sin foto (p. ej. cuota), recuperar la clave dedicada
useAuthStore.persist.onFinishHydration(() => {
  const u = useAuthStore.getState().user
  if (!u) return
  const stored = readStoredProfilePicture(u)
  if (stored && !u.profilePicture) {
    useAuthStore.setState({ user: { ...u, profilePicture: stored } })
  }
})

export default useAuthStore
