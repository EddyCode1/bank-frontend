/**
 * Abstracción de almacenamiento local para facilitar migración a AsyncStorage en React Native.
 */
export function getStorageItem(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    console.warn('[storage] No se pudo guardar:', e.message)
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
