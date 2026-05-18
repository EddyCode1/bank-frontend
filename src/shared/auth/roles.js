const ADMIN_ROLE_KEYS = ['ADMIN', 'ADMIN_ROLE']

export function normalizeRole(role) {
  const value = String(role || '').trim().toUpperCase()
  if (!value) return 'USER_ROLE'
  return value.includes('ADMIN') ? 'ADMIN_ROLE' : 'USER_ROLE'
}

export function isAdminRole(role) {
  const value = String(role || '').trim().toUpperCase()
  return ADMIN_ROLE_KEYS.includes(value) || value.includes('ADMIN')
}

export function getUserRole(user) {
  return normalizeRole(user?.rol || user?.role || '')
}

export function isAdminUser(user) {
  return isAdminRole(getUserRole(user))
}
