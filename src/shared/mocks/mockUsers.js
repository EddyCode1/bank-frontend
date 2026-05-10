/**
 * Datos de ejemplo para testing del módulo de usuarios.
 * Se muestran cuando el admin inicia sesión con la cuenta de testing (ADMINB).
 * Esto permite probar el módulo sin tener usuarios reales en el backend.
 */
export const MOCK_USERS = [
  {
    id: 'user-001',
    nombre: 'Juan García López',
    username: 'jgarcia',
    email: 'juan.garcia@banco.com',
    telefono: '+34 600 111 111',
    rol: 'USER_ROLE',
    direccion: 'Calle Principal 123',
    ciudad: 'Madrid',
    pais: 'España',
    cuentas: [
      { id: 'account-001', numero: '1234567890', tipo: 'Ahorros', saldo: 5000.5, estado: 'active' },
      { id: 'account-002', numero: '0987654321', tipo: 'Corriente', saldo: 2150.75, estado: 'active' },
    ],
  },
  {
    id: 'user-002',
    nombre: 'María Rodríguez Pérez',
    username: 'mrodriguez',
    email: 'maria.rodriguez@banco.com',
    telefono: '+34 600 222 222',
    rol: 'USER_ROLE',
    direccion: 'Avenida Segunda 456',
    ciudad: 'Barcelona',
    pais: 'España',
    cuentas: [
      { id: 'account-003', numero: '5555555555', tipo: 'Ahorros', saldo: 8900.0, estado: 'active' },
    ],
  },
  {
    id: 'user-003',
    nombre: 'Carlos Martínez Sánchez',
    username: 'cmartinez',
    email: 'carlos.martinez@banco.com',
    telefono: '+34 600 333 333',
    rol: 'USER_ROLE',
    direccion: 'Plaza Mayor 789',
    ciudad: 'Valencia',
    pais: 'España',
    cuentas: [
      { id: 'account-004', numero: '3333333333', tipo: 'Corriente', saldo: 3200.25, estado: 'active' },
      { id: 'account-005', numero: '4444444444', tipo: 'Inversión', saldo: 15000.0, estado: 'active' },
      { id: 'account-006', numero: '6666666666', tipo: 'Ahorros', saldo: 1500.0, estado: 'inactive' },
    ],
  },
  {
    id: 'user-004',
    nombre: 'Ana Fernández López',
    username: 'afernandez',
    email: 'ana.fernandez@banco.com',
    telefono: '+34 600 444 444',
    rol: 'USER_ROLE',
    direccion: undefined,
    ciudad: undefined,
    pais: undefined,
    cuentas: [
      { id: 'account-007', numero: '7777777777', tipo: 'Ahorros', saldo: 4500.75, estado: 'active' },
    ],
  },
  {
    id: 'user-005',
    nombre: 'Pedro González López',
    username: 'pgonzalez',
    email: 'pedro.gonzalez@banco.com',
    telefono: '+34 600 555 555',
    rol: 'USER_ROLE',
    direccion: undefined,
    ciudad: undefined,
    pais: undefined,
    cuentas: [],
  },
]

/** Email/username del admin de testing para mostrar datos mock */
export const TESTING_ADMIN_CREDENTIALS = {
  username: 'ADMINB',
  email: 'admin@bank.com',
}
