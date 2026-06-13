import { useCallback, useEffect, useState } from 'react'
import { dispatchAppEvent, subscribeAppEvent, subscribeStorageSync } from '../../../shared/events/platformEvents'
import { getStorageItem, setStorageItem } from '../../../shared/storage/platformStorage'

// Almacena, solo en el cliente, los accesos rápidos del dashboard que el usuario
// marca con estrella. Es UI pura (no datos bancarios) y por eso vive en
// storage local; el módulo real de "Favoritos" del banco (cuentas asociadas)
// usa el endpoint /favorites del backend a través de favoriteService.js.
const QUICK_LINK_FAVORITES_KEY = 'dashboard_quick_link_favorites_v1'
const QUICK_LINK_FAVORITES_EVENT = 'dashboard:quick-link-favorites:updated'

function readFromStorage() {
  try {
    const raw = getStorageItem(QUICK_LINK_FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeToStorage(favs) {
  try {
    setStorageItem(QUICK_LINK_FAVORITES_KEY, JSON.stringify(favs))
  } catch {
    // ignoramos errores: si el storage no está disponible, simplemente no
    // persistimos el estado entre recargas. La UI sigue funcionando en memoria.
  }
}

export function useQuickLinkFavorites() {
  const [favorites, setFavoritesState] = useState(readFromStorage)

  useEffect(() => {
    const sync = () => setFavoritesState(readFromStorage())
    const unsubEvent = subscribeAppEvent(QUICK_LINK_FAVORITES_EVENT, sync)
    const unsubStorage = subscribeStorageSync(sync)
    return () => {
      unsubEvent()
      unsubStorage()
    }
  }, [])

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  )

  const toggleFavorite = useCallback((id) => {
    setFavoritesState((current) => {
      const updated = current.includes(id)
        ? current.filter((f) => f !== id)
        : [...current, id]
      writeToStorage(updated)
      dispatchAppEvent(QUICK_LINK_FAVORITES_EVENT)
      return updated
    })
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
