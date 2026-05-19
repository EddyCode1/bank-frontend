import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  getFavorites,
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
  updateFavoriteAlias as updateFavoriteAliasService,
} from '../service/favoriteService'

const FAVORITES_UPDATED_EVENT = 'favorites:updated'

// Hook que centraliza el acceso a los favoritos del backend. Se usa tanto en
// FavoritePage (CRUD completo) como en consumidores que solo necesitan el
// listado (Dashboard, transferencias rápidas). Mantiene una sola fuente de
// verdad y sincroniza entre vistas con un CustomEvent global.
export function useFavorites({ autoLoad = true } = {}) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(autoLoad)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getFavorites()
      if (result.success) {
        setFavorites(result.data || [])
      } else if (result.error) {
        toast.error(result.error)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const broadcast = useCallback(() => {
    window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT))
  }, [])

  const add = useCallback(async ({ alias, accountNumber }) => {
    const result = await addFavoriteService({ alias, accountNumber })
    if (result.success) {
      await load()
      broadcast()
    }
    return result
  }, [load, broadcast])

  const remove = useCallback(async (favoriteId) => {
    const result = await removeFavoriteService(favoriteId)
    if (result.success) {
      await load()
      broadcast()
    }
    return result
  }, [load, broadcast])

  const updateAlias = useCallback(async (favoriteId, alias) => {
    const result = await updateFavoriteAliasService(favoriteId, alias)
    if (result.success) {
      await load()
      broadcast()
    }
    return result
  }, [load, broadcast])

  useEffect(() => {
    if (!autoLoad) return undefined
    // Defer al siguiente tick para que el setLoading interno no entre en la
    // fase de render (regla set-state-in-effect de eslint-plugin-react-hooks).
    const timer = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [autoLoad, load])

  // Mantiene el listado sincronizado entre vistas/pestañas: si otro componente
  // dispara favorites:updated (FavoritePage, transferencias rápidas, etc.),
  // recargamos para no quedarnos con datos desactualizados.
  useEffect(() => {
    if (!autoLoad) return undefined
    const handler = () => {
      void load()
    }
    window.addEventListener(FAVORITES_UPDATED_EVENT, handler)
    return () => window.removeEventListener(FAVORITES_UPDATED_EVENT, handler)
  }, [autoLoad, load])

  return {
    favorites,
    loading,
    refresh: load,
    addFavorite: add,
    removeFavorite: remove,
    updateFavoriteAlias: updateAlias,
  }
}
