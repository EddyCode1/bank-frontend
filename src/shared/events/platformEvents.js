/**
 * Bus de eventos desacoplado del DOM para reutilizar lógica en React Native.
 */
export function dispatchAppEvent(name) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(name))
  }
}

export function subscribeAppEvent(name, handler) {
  if (typeof window === 'undefined') {
    return () => {}
  }
  window.addEventListener(name, handler)
  return () => window.removeEventListener(name, handler)
}

export function subscribeStorageSync(handler) {
  if (typeof window === 'undefined') {
    return () => {}
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}
