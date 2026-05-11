// Tipos para usuario (ajustar según backend)
export const USER_ROLES = ['admin', 'user'];

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {string} status
 * // otros campos según backend
 */
