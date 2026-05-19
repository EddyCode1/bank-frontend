# Testing — Credenciales y cuentas demo

Todos los usuarios de demo aceptan **una sola contraseña conocida**, que se setea automáticamente al correr el script de reseteo masivo del backend (`npm run seed:passwords`, ver más abajo).

## Cuenta administradora (sembrada por `AdminSeed.cs`)

| Campo      | Valor            |
|------------|------------------|
| Usuario    | `ADMINB`         |
| Email      | `admin@bank.com` |
| Contraseña | `ADMINB`         |
| Rol        | `ADMIN_ROLE`     |

> El seeder de admin se ejecuta solo si la cuenta no existe; no toca la contraseña si ya está creada.

## Clientes demo (cuentas reales con datos sembrados)

Todos comparten la contraseña **`Cliente123!`**.

| Usuario   | Email                              | Rol         | Cuentas | Notas                                          |
|-----------|------------------------------------|-------------|---------|------------------------------------------------|
| Astral910 | `josueboror2018@gmail.com`         | USER_ROLE   | 3       | Cliente principal con saldo y transacciones    |
| Astral    | `josueboror2026@gmail.com`         | USER_ROLE   | —       | Cliente secundario                             |
| Merida    | `merida@example.com`               | USER_ROLE   | —       | Cliente con datos demográficos completos       |
| japerez   | `jsajchee-202438000@kinal.edu.gt`  | USER_ROLE   | —       | Cliente de prueba (Juan Pérez)                 |
| tuser     | `t@t.com`                          | USER_ROLE   | —       | Cliente de smoke test                          |

Cualquiera de estos puede loguearse en `http://localhost:5173/login` con su username o su email.

## Cómo regenerar las contraseñas (si se reinicia la base)

Si se reseteó la base o se quiere volver a un estado conocido:

1. Arrancar el backend .NET (puerto 5025) y el backend Node (puerto 3000).
2. Loguearse como admin (`ADMINB` / `ADMINB`) — el `AdminSeed.cs` lo recrea solo.
3. Desde la raíz de `Sistema-Bancario--SCRUM` ejecutar:

   ```bash
   npm run seed:passwords
   ```

   El script llama a `POST /api/v1/admin/users/{userId}/reset-password` para cada cliente listado en `scripts/seed-passwords.js` y deja todas las contraseñas en `Cliente123!`.

> El endpoint `POST /api/v1/admin/users/{userId}/reset-password` está protegido con JWT + rol admin. Pedimos esta vía explícita en lugar de modificar la BD a mano para mantener el hashing consistente con `IPasswordHashService`.

## Flujo recomendado para demo

1. Login como `ADMINB` → entrar a `/loby/users`, `/loby/account` (panel admin), `/loby/products` (gestión + solicitudes), `/loby/services` (catálogo + gestión + pagos globales) y `/loby/transactions` (admin deposits + global tx).
2. Logout y login como `josueboror2018@gmail.com` con `Cliente123!` → mostrar `/loby/account` (mis cuentas), `/loby/transactions` (mis tx + transferencia), `/loby/favorites` (agregar + transferir rápido), `/loby/products` (solicitar producto), `/loby/services` (pagar servicio), `/loby/saldos` (resumen + exportar PDF), `/loby/profile`.
3. Cubre todas las vistas de la rúbrica: cliente y admin.
