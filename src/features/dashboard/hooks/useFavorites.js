import { useCallback } from 'react';

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
  } catch {}
}

export function useFavorites() {
  const favs = getFavorites();

  const isFavorite = useCallback(
    (id) => favs.includes(id),
    [favs]
  );

  const toggleFavorite = useCallback((id) => {
    const current = getFavorites();
    const updated = current.includes(id)
      ? current.filter((f) => f !== id)
      : [...current, id];
    setFavorites(updated);
    window.dispatchEvent(new Event('favorites:updated'));
  }, []);

  return { favorites: favs, isFavorite, toggleFavorite };
}
