# Testing — Cuenta Admin

## Cuenta de administrador (sembrada por el backend)

| Campo      | Valor            |
|------------|------------------|
| Usuario    | `ADMINB`         |
| Email      | `admin@bank.com` |
| Contraseña | `ADMINB`         |
| Rol        | `ADMIN_ROLE`     |

El seeder (`AdminSeed.cs`) crea esta cuenta al arrancar la API si no existe.

---

## Cómo funciona el testing de usuarios

El módulo de **Usuarios** tiene comportamiento distinto según la cuenta con la
que se ingrese.

### Lógica por cuenta

- **Login con `ADMINB` / `admin@bank.com`** → se muestran siempre los
  **5 usuarios de ejemplo** con sus cuentas bancarias (modo testing).
- **Login con cualquier otro usuario admin** → se muestran los usuarios
  reales que devuelve el backend.

### Usuarios de ejemplo (heredados de `ft/kevin`)

| # | Nombre                | Usuario     | Cuentas |
|---|-----------------------|-------------|---------|
| 1 | Juan García López     | jgarcia     | 2       |
| 2 | María Rodríguez Pérez | mrodriguez  | 1       |
| 3 | Carlos Martínez S.    | cmartinez   | 3       |
| 4 | Ana Fernández López   | afernandez  | 1       |
| 5 | Pedro González López  | pgonzalez   | 0       |

Al hacer clic en **Ver** de cualquier usuario de ejemplo, la pestaña
**Cuentas** muestra sus cuentas con número, tipo, saldo y estado.

---

## Flujo de prueba

### 1. Iniciar servicios
- API:      `http://localhost:3000`
- Frontend: `http://localhost:5173`

### 2. Login
Ir a `http://localhost:5173/login` e ingresar:
- Usuario: `ADMINB`
- Contraseña: `ADMINB`

### 3. Navegar al módulo de Usuarios
Ruta: `/loby/users`

Aparecerán los 5 usuarios de ejemplo de Kevin.

### 4. Ver detalle
Hacer clic en **Ver** de cualquier usuario para ver:
- Pestaña **Datos Personales**: nombre, email, teléfono, rol, dirección
- Pestaña **Cuentas**: cuentas bancarias con saldo y estado
