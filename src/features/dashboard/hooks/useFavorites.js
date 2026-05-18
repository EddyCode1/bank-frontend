import { useCallback, useEffect, useState } from 'react';

const FAVORITES_KEY = 'bank_favorites_v1';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setFavorites(favs) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch {
    return;
  }
}

export function useFavorites() {
  const [favorites, setFavoritesState] = useState(() => getFavorites())

  useEffect(() => {
    const syncFavorites = () => setFavoritesState(getFavorites())
    window.addEventListener('favorites:updated', syncFavorites)
    window.addEventListener('storage', syncFavorites)
    return () => {
      window.removeEventListener('favorites:updated', syncFavorites)
      window.removeEventListener('storage', syncFavorites)
    }
  }, [])

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback((id) => {
    setFavoritesState((current) => {
      const updated = current.includes(id)
        ? current.filter((f) => f !== id)
        : [...current, id]
      setFavorites(updated)
      window.dispatchEvent(new Event('favorites:updated'))
      return updated
    })
  }, [])

  const setFavoritesDirect = useCallback((nextFavorites) => {
    const normalized = Array.isArray(nextFavorites) ? nextFavorites : []
    setFavorites(normalized)
    setFavoritesState(normalized)
    window.dispatchEvent(new Event('favorites:updated'));
  }, [])

  return { favorites, isFavorite, toggleFavorite, setFavorites: setFavoritesDirect };
}
