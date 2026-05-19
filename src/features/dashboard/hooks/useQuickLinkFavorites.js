import { useCallback, useEffect, useState } from 'react'

// Almacena, solo en el cliente, los accesos rápidos del dashboard que el usuario
// marca con estrella. Es UI pura (no datos bancarios) y por eso vive en
// localStorage; el módulo real de "Favoritos" del banco (cuentas asociadas)
// usa el endpoint /favorites del backend a través de favoriteService.js.
const QUICK_LINK_FAVORITES_KEY = 'dashboard_quick_link_favorites_v1'
const QUICK_LINK_FAVORITES_EVENT = 'dashboard:quick-link-favorites:updated'

function readFromStorage() {
  try {
    const raw = localStorage.getItem(QUICK_LINK_FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeToStorage(favs) {
  try {
    localStorage.setItem(QUICK_LINK_FAVORITES_KEY, JSON.stringify(favs))
  } catch {
    // ignoramos errores: si el storage no está disponible, simplemente no
    // persistimos el estado entre recargas. La UI sigue funcionando en memoria.
  }
}

export function useQuickLinkFavorites() {
  const [favorites, setFavoritesState] = useState(readFromStorage)

  useEffect(() => {
    const sync = () => setFavoritesState(readFromStorage())
    window.addEventListener(QUICK_LINK_FAVORITES_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(QUICK_LINK_FAVORITES_EVENT, sync)
      window.removeEventListener('storage', sync)
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
      window.dispatchEvent(new Event(QUICK_LINK_FAVORITES_EVENT))
      return updated
    })
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
