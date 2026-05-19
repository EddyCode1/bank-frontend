# Guía del frontend — Banco del Quetzal

Este documento es una guía de mano para que cualquiera (incluyendo a quien lo califique) pueda **levantar el proyecto, loguearse y recorrer absolutamente todas las vistas** del frontend, sabiendo qué puede hacer un cliente y qué puede hacer un administrador en cada una.

Está escrito en primera persona porque resume lo que hice yo (Josue, `jsajche-2024380`) durante la implementación, y va dirigido a vos —compañero, profe o evaluador— que lo lee por primera vez. Lo importante es el frontend; menciono el backend solo cuando hace falta para que algo se entienda.

---

## 1. Qué es esto

`bank-frontend` es la SPA en **React 19 + Vite 8 + Tailwind CSS 4** del proyecto **Banco del Quetzal**. La aplicación consume dos backends:

| Backend | Stack | Puerto | Base path | Qué hace |
|---|---|---|---|---|
| Auth | .NET 8 + PostgreSQL | `5025` | `/api/v1` | Login, registro, verificación de email, gestión de usuarios |
| Banca | Node.js + Express + MongoDB | `3000` | `/SistemaBancarioAdmin/v1` | Cuentas, transacciones, productos, servicios, favoritos, tasas |

El frontend corre en **`http://localhost:5173`** y se conecta a ambos por axios con interceptores que adjuntan el JWT.

---

## 2. Credenciales para probar

Yo dejé sembrados un admin y un set de clientes con datos reales (cuentas, transacciones, favoritos). Todas las contraseñas de cliente quedan unificadas en **`Cliente123!`** porque corrí mi script `npm run seed:passwords` desde el backend.

### Admin (sembrado por `AdminSeed.cs`, siempre existe)

| Campo | Valor |
|---|---|
| Usuario | `ADMINB` |
| Email | `admin@bank.com` |
| Contraseña | `ADMINB` |
| Rol | `ADMIN_ROLE` |

### Clientes demo (todos con `Cliente123!`)

| Usuario | Email | Cuentas sembradas | Para qué sirve |
|---|---|---|---|
| Astral910 | `josueboror2018@gmail.com` | 3 (con saldo) | Cliente principal de demo: tiene transacciones y favoritos reales |
| Astral | `josueboror2026@gmail.com` | — | Cliente secundario |
| Merida | `merida@example.com` | — | Cliente con datos demográficos completos |
| japerez | `jsajchee-202438000@kinal.edu.gt` | — | Cliente de prueba (Juan Pérez) |
| tuser | `t@t.com` | — | Cliente de smoke test |

En login podés escribir el **username o el email**, los dos sirven. Yo siempre demuestro la app con `josueboror2018@gmail.com / Cliente123!` porque ese tiene movimientos.

> Si en algún momento las contraseñas se pierden (alguien reseteó la base), corré `npm run seed:passwords` desde la raíz del backend Node y todas vuelven a `Cliente123!`. El script llama a un endpoint admin (`POST /api/v1/admin/users/{userId}/reset-password`) protegido por JWT, no toca la base directo.

---

## 3. Cómo levantar todo

### 3.1 Backend (un solo comando)

Desde la raíz de **`Sistema-Bancario--SCRUM`** corré:

```bash
npm run start:all
```

Eso hace tres cosas en paralelo (lo definí en `package.json`):

1. `docker compose up -d` levanta el contenedor de MongoDB (puerto 27017) y el de Postgres.
2. `dotnet run` arranca el servicio de Auth en `http://localhost:5025`.
3. `npm run dev` (nodemon) arranca el servicio de Banca en `http://localhost:3000`.

Vas a ver dos prefijos en la consola: `[dotnet]` en azul y `[node]` en verde. Cuando los dos digan que están "listening" / "running", ya podés abrir el frontend.

Si no querés Docker (ej. ya tenés Mongo/Postgres locales corriendo) podés levantar cada uno por su lado:

```bash
# Auth (.NET)
cd Sistema-Bancario--SCRUM/src/AuthServiceBanco.Api
dotnet run

# Banca (Node)
cd Sistema-Bancario--SCRUM
npm run dev
```

### 3.2 Frontend

Desde **`bank-frontend`**:

```bash
pnpm install   # solo la primera vez
pnpm dev       # arranca Vite en http://localhost:5173
```

Si preferís npm también funciona (`npm install && npm run dev`). En cualquier navegador abrí **`http://localhost:5173`** y caés en `/login`.

### 3.3 Variables de entorno del frontend

Copiá `.env.example` a `.env.local` y dejalo así (es lo que asumen los puertos):

```env
VITE_AUTH_URL=http://localhost:5025/api/v1/auth
VITE_BANKING_URL=http://localhost:3000/SistemaBancarioAdmin/v1

VITE_APP_NAME=Banco del Quetzal
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

---

## 4. Mapa general de la aplicación

El router está en `src/app/router/routes.jsx`. Todo lo de adentro de la app vive bajo el prefijo **`/loby`** y queda envuelto por `MainLayout` (sidebar + navbar + footer). Las rutas públicas son las de autenticación.

### Rutas públicas (`AuthLayout`)

| Ruta | Vista | Para qué |
|---|---|---|
| `/login` | `LoginPage` | Iniciar sesión con username/email + contraseña |
| `/register` | `RegisterPage` | Registro de nuevo cliente (rol `USER_ROLE`) |
| `/forgot-password` | `ForgotPasswordPage` | Solicitar correo de reseteo |
| `/reset-password` | `ResetPasswordPage` | Confirmar nueva contraseña con token del correo |
| `/verify-email` | `VerifyEmailPage` | Verificar email con token del correo |
| `/resend-verification` | `ResendVerificationPage` | Reenviar correo de verificación |

### Rutas protegidas (`MainLayout`, requieren JWT)

| Ruta | Vista | Quién entra |
|---|---|---|
| `/loby` | `DashboardPage` | Todos |
| `/loby/saldos` | `FinancialPage` | Todos |
| `/loby/account` | `AccountPage` | Todos (admin ve un panel extra) |
| `/loby/transactions` | `TransactionPage` | Todos (admin ve tabs extra) |
| `/loby/products` | `ProductPage` | Todos (admin gestiona, cliente solicita) |
| `/loby/services` | `ServicePage` | Todos (admin gestiona, cliente paga) |
| `/loby/favorites` | `FavoritePage` | Todos (admin ve directorio de personas) |
| `/loby/schedules` | `SchedulePage` | Todos |
| `/loby/profile` | `ProfilePage` | Todos (yo edito mis propios datos) |
| `/loby/users` | `UsersPage` | **Solo admin** (`requiredRole="ADMIN_ROLE"`) |
| `/loby/users/:userId` | `UserDetailPage` | **Solo admin** |
| `/loby/forbidden` | `ForbiddenPage` | Pantalla a la que te manda si un cliente intenta `/loby/users` |

Si un cliente fuerza la URL `/loby/users` el `ProtectedRoute` lo manda directamente a `/loby/forbidden`. Si alguien sin JWT entra a cualquier `/loby/*`, el guard lo manda a `/login`.

### Sidebar

El sidebar (`src/app/components/Sidebar.jsx`) muestra el menú principal a todos: Panel general, Saldos, Cuentas, Transacciones, Productos, Servicios y Favoritos. Cuando detecto que el usuario logueado es admin (`isAdminUser(user)` desde `shared/auth/roles.js`), agrego una sección separada **"Administración"** con el link "Usuarios". Si entrás como cliente, esa sección directamente no se renderiza —no es solo CSS oculto, no existe en el DOM.

---

## 5. Recorrido completo, vista por vista

Para cada pantalla te cuento qué ve un cliente, qué ve un admin, y qué se puede hacer ahí.

### 5.1 `/login` — Iniciar sesión

- Formulario único con dos campos: identificador (username o email) y contraseña.
- Botón **Iniciar sesión**. Si las credenciales están mal te muestro un toast rojo. Si están bien guardo el JWT en `localStorage`, hidrato el `useAuthStore` y te mando a `/loby`.
- Hay enlaces a **¿Olvidaste tu contraseña?** y a **Crear cuenta**.
- Esta vista es la misma para admin y cliente; el rol lo decide el backend al validar el token.

### 5.2 `/register` — Registro de cliente

- Solo crea clientes con rol `USER_ROLE`. No expongo formulario público para crear admins.
- Pide nombre, apellido, username, email, contraseña (con validaciones de longitud y caracteres), teléfono, DPI, dirección, ingreso mensual, lugar de trabajo.
- Al registrar disparo el correo de verificación y te redirige a `/login` con un toast pidiendo que verifiques el email.

### 5.3 `/loby` — Dashboard / Panel general

Lo armé como una landing operativa, no un dump de números:

- **Saludo personalizado** con el nombre del usuario logueado.
- **Tarjetas de resumen** con el total de cuentas, transacciones recientes y favoritos.
- **Widget de tasas de cambio** que muestra GTQ → USD y GTQ → EUR. Lo levanto en tiempo real contra `/currency/convert` del backend Node, que a su vez consulta `floatrates.com`. Si el proveedor falla, muestro el último valor en cache.
- **Accesos rápidos** (`QuickLinks`): tarjetas con icono que llevan a cuentas, favoritos, productos, servicios, saldos, horarios y transacciones. Cualquier acceso rápido se puede **marcar como favorito** con una estrellita (esto se guarda local en `localStorage`, no se sube al backend; es solo un orden visual). Para no confundirlo con los "favoritos bancarios" reales, el hook se llama `useQuickLinkFavorites`.
- **Carrusel promocional** con dos slides ilustrativos (créditos y servicios).
- **Productos institucionales** (cuentas de ahorro, seguros, educación financiera) en cards con foto.
- **Sección de seguridad** con tips de phishing, JWT, contraseñas, etc., con sus ilustraciones.

Admin y cliente ven exactamente la misma estructura. El dashboard no expone funciones administrativas (esas viven en su propia ruta).

### 5.4 `/loby/account` — Cuentas

Acá sí hay diferencia importante entre admin y cliente, porque la vista cambia con tabs.

**Cliente** (rol `USER_ROLE`):

- Sección **Mis cuentas**: lista cada una de sus cuentas con número, tipo (`AHORRO` / `CORRIENTE`), moneda (`GTQ` / `USD`), estado (`ACTIVA` / `PENDIENTE` / `INACTIVA`) y saldo formateado.
- En cada tarjeta hay botones **Ver detalles** (abre `AccountDetailModal` con movimientos, límites diarios y estado) y **Editar**.
- Tarjeta lateral **Resumen** con total de cuentas y saldo total consolidado.
- Botón superior **Crear cuenta**: abre `AccountFormModal` para que el cliente pida una cuenta nueva. Queda en estado `PENDIENTE` hasta que el admin la apruebe.

**Admin** (rol `ADMIN_ROLE`):

- Aparecen dos tabs arriba: **Panel admin** y **Mis cuentas**. Por defecto cae en "Panel admin".
- **Panel admin**:
  - Buscador por número de cuenta o nombre.
  - Filtros por tipo, moneda, estado.
  - Vista de todas las cuentas del sistema con paginación.
  - Sub-vistas ordenadas: **Por actividad**, **Por saldo**, **Por movimientos** (cada una llama a su endpoint específico: `/accounts/by-activity`, `/accounts/by-balance`, `/accounts/by-movements`).
  - Por cada cuenta tengo botones para **Ver detalles**, **Editar** y **Cambiar estado** (`ACTIVA` ↔ `INACTIVA`). Cuando una cuenta nueva creada por un cliente queda `PENDIENTE`, el admin la aprueba pasándola a `ACTIVA` desde aquí.
- **Mis cuentas**: muestra exactamente lo mismo que ve un cliente, pero para las cuentas propias del admin. Sirve para mostrar que un admin también es titular de cuentas reales.

### 5.5 `/loby/transactions` — Transacciones

Es la pantalla con más tabs y la que más cambia según el rol.

**Cliente** ve 3 tabs:

1. **Mis transacciones**: tabla paginada con todas mis tx (depósitos, transferencias, pagos de servicios). Cada fila tiene un botón para abrir el detalle (`TransactionDetail`).
2. **Historial**: histórico filtrable por fecha, tipo (`DEPOSITO`, `CREDITO`, `DEBITO`), cuenta, monto. Llama a `/transactions/history/me`.
3. **Transferir**: formulario `TransferForm`. Selecciono cuenta origen, ingreso número de cuenta destino (o lo prellenó desde Favoritos), monto, moneda, descripción. Validaciones del backend: monto mínimo Q5, máximo Q2,000 por movimiento, tope diario por cuenta. Si la moneda destino difiere, el backend hace conversión y devuelve el rate aplicado.

**Admin** ve **5 tabs**:

1. **Mis transacciones** (igual que cliente).
2. **Historial** (igual que cliente, además con filtro extra por `user_id`).
3. **Crear depósito**: formulario `DepositForm`. Selecciono un número de cuenta destino, monto, moneda y concepto. Disparo `POST /transactions/deposit`. Esta tab **solamente se renderiza si `isAdmin`**, y el backend además rechaza con 403 si llega de un cliente, así que la regla está duplicada (UI + backend).
4. **Transferir** (igual que cliente, sirve si el admin además es titular).
5. **Depósitos pendientes**: panel `AdminDepositsPanel` que lee `/deposits/pending`. Lista depósitos en estado pendiente para que el admin los confirme o rechace. Esta tab también está oculta para clientes.

Adicional: el filtro de fechas y tipo es una tira de chips que el admin puede combinar; cuando hay filtros activos aparece un botón **Limpiar filtros**.

### 5.6 `/loby/products` — Productos

El catálogo de productos bancarios (cuentas premium, tarjetas, créditos, etc.). Esto es el `type=PRODUCTO` del modelo unificado del backend.

**Cliente**:

- Ve la grilla de productos activos (`ProductList`).
- Cada card tiene foto, nombre, descripción y precio. Botón **Solicitar**.
- Al solicitar abre un modal con un campo opcional de notas y dispara `POST /products/requests`. Si ya hay una solicitud pendiente del mismo producto, el backend responde 409 y muestro un toast claro ("Ya tenés una solicitud pendiente para este producto").
- Más abajo veo la sección **Mis solicitudes** con cada solicitud, su fecha, notas y estado (`PENDIENTE` / `APROBADO` / `RECHAZADO`).

**Admin**:

- Mismo catálogo, pero arriba aparece un botón **Crear producto** que abre `ProductForm`. Yo elijo nombre, descripción, precio, tipo (`PRODUCTO`/`SERVICIO`) y activo sí/no.
- En cada card de producto activo aparece **Editar** (mismo modal en modo edición) y **Eliminar** (pregunta confirmación; si el producto se sigue ofreciendo el modal sugiere desactivarlo en vez de borrarlo).
- En vez de "Mis solicitudes" veo **Todas las solicitudes** (`/products/requests`) con un selector por estado y botones **Aprobar** / **Rechazar** que mutan el estado de la solicitud. El cliente afectado verá el cambio cuando recargue su lista.

Cliente que intente hacer `POST /products` recibe 403 del backend; tampoco tiene el botón en la UI.

### 5.7 `/loby/services` — Servicios

Conceptualmente parecido a Productos pero para `type=SERVICIO` (luz, agua, internet, etc.).

**Cliente**:

- Ve la grilla de servicios activos.
- Sección **Pagar servicio**: selecciono el servicio del select, mi cuenta origen, ingreso el monto, moneda y referencia. Disparo `POST /services/payments` que descuenta el saldo y registra una transacción tipo `DEBITO` con método `COMPRA`.
- Sección **Mis pagos**: tabla con cada pago realizado, monto, fecha, servicio, cuenta usada y referencia.

**Admin**:

- Igual que el cliente más:
- Tabla **Catálogo completo** que incluye servicios inactivos.
- Botón **Crear servicio** que crea un `Product` con `type=SERVICIO`.
- Botones **Editar** / **Activar–desactivar** por cada servicio del catálogo.
- En lugar de "Mis pagos" ve **Todos los pagos de servicios** del sistema (`/services/payments`), con filtros por usuario, cuenta, servicio, estado y rango de fechas.

> Cliente sin permiso que intente `GET /services/payments` (todos) recibe 403. La UI tampoco le muestra ese listado.

### 5.8 `/loby/favorites` — Favoritos

Los favoritos son contactos a los que se transfiere a menudo. Acá la diferencia entre roles es más sutil pero útil.

**Cliente**:

- Lista de **Mis favoritos** con alias, número de cuenta y botones **Editar alias** y **Eliminar**. El icono de eliminar es un `Trash2` rojo (antes era una estrella amarilla que la gente confundía con "destacar"; lo cambié a propósito para que se entienda que destruye).
- Formulario rápido para **agregar favorito** ingresando alias y número de cuenta destino.
- En cada fila hay un botón **Transferir** que me lleva a `/loby/transactions?tab=transfer&dest=NUMERO` con el campo destino prellenado. Esto evita que el cliente tenga que copiar/pegar el número.

**Admin**:

- Todo lo del cliente, más:
- Una sección **Directorio de personas**: buscador contra `/admin/users` con filtros por nombre, username, email. Devuelve una lista de personas con sus cuentas; con un click puedo **Agregar como favorito** (creando una entrada en mis favoritos del admin).

> Cuando agrego, elimino o renombro un favorito, disparo un `CustomEvent` `favorites:updated`. El dashboard escucha ese evento y actualiza el contador de favoritos sin necesidad de recargar la página.

### 5.9 `/loby/saldos` — Saldos

Es una vista informativa de **saldos consolidados** del cliente:

- Tarjetas de resumen con saldo total de tarjetas y saldo total de préstamos.
- Listas separadas de tarjetas de crédito y de préstamos vigentes (datos de ejemplo en `constants/financialData.js` porque esa parte no la cubre el backend del proyecto).
- Historial filtrable: rango de fechas, tipo de movimiento, moneda, estado, búsqueda libre.
- Botón **Exportar a PDF**: con `html2canvas-pro` + `jspdf` snapshoteo la vista filtrada y descargo un PDF con el estado actual. Útil para la demo (lo muestro en vivo).

Admin y cliente ven la misma vista; el admin la usa para verificar formatos y la vivencia del cliente.

### 5.10 `/loby/schedules` — Horarios

Tabla estática con los días/hora de atención del banco y servicios en línea. Vive en `constants/scheduleData.js`. Útil como referencia. Igual para todos.

### 5.11 `/loby/profile` — Mi perfil

- Foto de perfil (al inicio carga la default, si subo una nueva la redimensiono con `resizeImageToDataUrl` y la guardo).
- Formulario con react-hook-form: nombre, username (read-only en cliente), email, teléfono, dirección, trabajo, ingreso mensual.
- Botón **Editar perfil** que habilita los inputs.
- Si abro `/loby/profile?editPhoto=1` (desde un link del navbar) hago scroll automático a la sección de foto. Lo usé para que el menú de la foto del navbar lleve directo al editor de imagen.
- Los cambios se persisten contra `PUT /users/me` del backend .NET. Después de guardar refresco el `useAuthStore` con `patchUser`.

Admin y cliente ven la misma pantalla; cada uno edita sus propios datos.

### 5.12 `/loby/users` — Gestión de usuarios (solo admin)

Esta pestaña no existe para clientes. Aquí gestiono toda la base de usuarios del banco.

- Buscador por nombre / username / email.
- Tabs **Todos** y **Pendientes** (usuarios sin verificar).
- Paginación.
- Tabla con: nombre, username, email, rol, estado (activo/inactivo), fecha de creación.
- Por cada fila:
  - **Ver detalle** → me lleva a `/loby/users/:userId` (pantalla `UserDetailPage`) donde veo el perfil completo, login history, cuentas asociadas y un botón para **resetear contraseña** (dispara el endpoint admin que devuelve la nueva password al toast, útil para soporte).
  - **Editar** → modal `UserFormModal` para cambiar nombre, teléfono, dirección, ingreso, rol (`USER_ROLE` ↔ `ADMIN_ROLE`).
  - **Activar / Desactivar** → soft delete: el usuario no se borra, queda `status=false` y no puede loguearse.
  - **Cambiar rol** → atajo separado al cambio de rol.
- Botón global **Crear usuario** para alta manual desde el panel.

Si entrás logueado como cliente y forzás la URL `/loby/users`, te aparece la `ForbiddenPage` ("403 — no tenés permisos") con un botón para volver al panel general.

---

## 6. Matriz rápida: ¿qué puede hacer cada rol?

| Vista | Cliente puede | Admin puede (además) |
|---|---|---|
| `/login`, `/register`, `/forgot-password` | Todo lo público | Igual |
| `/loby` (dashboard) | Ver resumen, tasas, favoritos, accesos rápidos | Igual |
| `/loby/account` | Ver mis cuentas, crear cuenta (queda pendiente), editar limites, ver detalles | Panel admin global con filtros + cambiar estado de cuenta + ver cuentas de otros |
| `/loby/transactions` | Mis tx, historial, transferir | Crear depósito + depósitos pendientes + filtro por user_id |
| `/loby/products` | Ver catálogo, solicitar producto, ver mis solicitudes | Crear/editar/eliminar productos + aprobar/rechazar solicitudes |
| `/loby/services` | Ver catálogo, pagar servicio, ver mis pagos | Crear/editar servicios + ver todos los pagos |
| `/loby/favorites` | CRUD de mis favoritos + transferir rápido | Buscar en directorio de personas y agregarlas como favorito |
| `/loby/saldos` | Ver saldos consolidados + exportar PDF | Igual |
| `/loby/schedules` | Consultar horarios | Igual |
| `/loby/profile` | Editar mis datos y mi foto | Igual (con mis datos de admin) |
| `/loby/users` | **No tiene acceso** → `/loby/forbidden` | Gestión completa de usuarios |
| `/loby/users/:userId` | **No tiene acceso** | Detalle + reset password + cambiar rol |

---

## 7. Notas técnicas que quizá te sirvan

- **State management**: `Zustand` para auth (`useAuthStore`), transacciones (`useTransactionStore`) y productos (`useProductStore`). El resto vive en hooks específicos (`useMyAccounts`, `useFavorites`, `useProductRequests`, `useQuickLinkFavorites`).
- **API clients**: `shared/api/` exporta `authClient` (apuntando al .NET), `publicClient` (peticiones sin token), `adminClient` (peticiones admin) y `bankingClient` (Node). Todos comparten interceptores: adjuntan `Authorization: Bearer <token>` y centralizan el manejo de 401 (cierra sesión y redirige a `/login`).
- **Roles**: `shared/auth/roles.js` expone `isAdminUser(user)`. Solo cuando el rol viene como `ADMIN_ROLE` se renderizan secciones admin. Esto es la primera línea de defensa; la segunda la pone el backend.
- **Errores y feedback**: uso `react-hot-toast`. Las funciones `resolveBankingError`, `parseBackendError` y `handleSessionError` (en `shared/`) normalizan los errores de cada backend antes del toast.
- **Estilo**: variables CSS centralizadas en `src/styles/index.css` (`--primary`, `--bg`, `--text`, `--muted`, `--border`, `--surface`, `--danger`, `--success`). Las páginas usan estas variables en vez de hex hardcoded para mantener consistencia y soportar futuro modo oscuro.
- **Iconografía**: `lucide-react` para iconos vectoriales reales (`Trash2`, `ArrowRight`, etc.). Los símbolos del sidebar (`◉`, `★`, `⇄`...) son glifos Unicode minimalistas a propósito, para que pesen 0 KB.

---

## 8. Cómo demostrarlo paso a paso (script de defensa)

1. **Levantar todo**: `npm run start:all` en backend, `pnpm dev` en frontend, abrir `http://localhost:5173`.
2. **Login como admin** (`ADMINB` / `ADMINB`). Mostrar:
   - Dashboard con sidebar completo incluyendo sección **Administración** → **Usuarios**.
   - `/loby/users`: buscar, crear, editar, resetear contraseña, ver detalle.
   - `/loby/account` (tab **Panel admin**): aprobar una cuenta pendiente del cliente demo.
   - `/loby/transactions`: ir al tab **Crear depósito**, hacer un depósito Q500 a la cuenta del cliente demo. Mostrar también el tab **Depósitos pendientes**.
   - `/loby/products`: crear un producto demo, aprobar una solicitud pendiente del cliente.
   - `/loby/services`: ver todos los pagos del sistema.
   - Logout.
3. **Login como cliente** (`josueboror2018@gmail.com` / `Cliente123!`). Mostrar:
   - Sidebar sin la sección Administración.
   - Forzar URL `/loby/users` → se va a `/loby/forbidden`.
   - `/loby/account`: ver mis cuentas (incluyendo la recién aprobada). Pedir una nueva cuenta → queda en `PENDIENTE`.
   - `/loby/transactions`: hacer una transferencia Q50 entre mis cuentas, revisar que aparezca en **Mis transacciones** y en **Historial**.
   - `/loby/favorites`: agregar la cuenta de otro cliente como favorito, usar **Transferir** rápido.
   - `/loby/products`: solicitar un producto (mostrar mensaje de duplicado si ya hay uno pendiente).
   - `/loby/services`: pagar un servicio y mostrar el saldo descontado en `/loby/account`.
   - `/loby/saldos`: filtrar el historial y exportar a PDF.
   - `/loby/profile`: cambiar mi foto y guardar.

Con eso queda demostrado el comportamiento completo del frontend, los dos roles y la separación de privilegios.

---

## 9. Si algo falla

| Síntoma | Causa común | Cómo lo soluciono |
|---|---|---|
| Login devuelve 401 con credenciales correctas | Las contraseñas demo se reiniciaron | Corro `npm run seed:passwords` en el backend |
| Dashboard no muestra tasas | `floatrates.com` está rate-limiteado | El backend devuelve 502 y mantiene el último valor cacheado (15 min); refrescar más tarde |
| `/loby/users` redirige a forbidden estando logueado | Estoy logueado como cliente, no como admin | Logout y entrar con `ADMINB / ADMINB` |
| El sidebar no muestra **Administración** | El usuario logueado no es admin | Idem anterior |
| Toast "No tenés permisos" al hacer un depósito | El backend exige rol admin para `POST /transactions/deposit` (lo cerré en esta entrega) | Hacer la operación desde un usuario admin |
| `npm run dev` no levanta porque el puerto está ocupado | Otro proceso usando 3000/5025/5173 | `lsof -ti tcp:3000 | xargs kill` (idem 5025, 5173) |

---

Cualquier duda con el frontend, este documento es la fuente de verdad. Lo voy a mantener al día junto con `TESTING_USUARIOS.md` y `TESTING_AUTH.md`, que son los anexos técnicos de credenciales y matriz de pruebas.

— Josue D. Sajche Boror (`jsajche-2024380`)
