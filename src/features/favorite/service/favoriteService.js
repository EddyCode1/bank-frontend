import adminClient from '../../../shared/api/adminClient'

const FAVORITES_KEY = 'bank_people_favorites_v1'
const FAVORITES_ENDPOINT = '/favorites'

function parseBackendError(error) {
  const data = error.response?.data
  if (!data) return error.message
  if (data.errors && typeof data.errors === 'object') {
    const msgs = Object.values(data.errors).flat()
    if (msgs.length > 0) return msgs.join(' | ')
  }
  return data.message || data.title || error.message
}

function normalizeFavoriteIds(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (!item) return null
        if (typeof item === 'string' || typeof item === 'number') return String(item)
        return String(item.userId || item.id || item._id || item.favoriteUserId || item.favoriteId || item)
      })
      .filter(Boolean)
  }
  if (typeof raw === 'object') {
    if (Array.isArray(raw.items)) {
      return normalizeFavoriteIds(raw.items)
    }
    if (Array.isArray(raw.data)) {
      return normalizeFavoriteIds(raw.data)
    }
    return normalizeFavoriteIds(Object.values(raw))
  }
  return []
}

function getLocalFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? normalizeFavoriteIds(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

function setLocalFavorites(favs) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
  } catch {
    // ignore local storage failures
  }
}

function isServerFavoritesAvailable(error) {
  const status = error?.response?.status
  return status !== 404 && status !== 405 && status !== 403
}

export const getFavorites = async () => {
  try {
    const response = await adminClient.get(FAVORITES_ENDPOINT)
    const ids = normalizeFavoriteIds(response.data?.data ?? response.data)
    setLocalFavorites(ids)
    return { success: true, data: ids }
  } catch (error) {
    if (!isServerFavoritesAvailable(error)) {
      return { success: true, data: getLocalFavorites() }
    }
    return { success: false, error: parseBackendError(error) }
  }
}

export const addFavorite = async (userId) => {
  const favoriteId = String(userId)
  try {
    const response = await adminClient.post(FAVORITES_ENDPOINT, { userId: favoriteId })
    const ids = normalizeFavoriteIds(response.data?.data ?? response.data)
    const result = ids.length > 0 ? ids : getLocalFavorites()
    const updated = Array.from(new Set([...result, favoriteId]))
    setLocalFavorites(updated)
    return { success: true, data: updated }
  } catch (error) {
    if (!isServerFavoritesAvailable(error)) {
      const current = getLocalFavorites()
      const updated = Array.from(new Set([...current, favoriteId]))
      setLocalFavorites(updated)
      return { success: true, data: updated }
    }
    return { success: false, error: parseBackendError(error) }
  }
}

export const removeFavorite = async (userId) => {
  const favoriteId = String(userId)
  try {
    const response = await adminClient.delete(`${FAVORITES_ENDPOINT}/${encodeURIComponent(favoriteId)}`)
    const ids = normalizeFavoriteIds(response.data?.data ?? response.data)
    const updated = ids.length > 0 ? ids : getLocalFavorites().filter((id) => id !== favoriteId)
    setLocalFavorites(updated)
    return { success: true, data: updated }
  } catch (error) {
    if (!isServerFavoritesAvailable(error)) {
      const current = getLocalFavorites()
      const updated = current.filter((id) => id !== favoriteId)
      setLocalFavorites(updated)
      return { success: true, data: updated }
    }
    return { success: false, error: parseBackendError(error) }
  }
}
