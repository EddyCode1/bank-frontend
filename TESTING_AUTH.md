# Testing Auth — Frontend Banco

Guía rápida para validar el módulo de autenticación y autorización después de los últimos cambios.

## Pre-requisitos

- Frontend en `http://localhost:5173`
- Auth API (.NET) en `http://localhost:5025/api/v1`
- Backend bancario (Node) en `http://localhost:3000/SistemaBancarioAdmin/v1`

## Rutas de UI Auth

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/resend-verification`
- `/loby/forbidden`

## Matriz de pruebas (manual)

### A. Login / sesión

1. **Login exitoso**
   - Entrar a `/login`.
   - Usar credenciales válidas (email o username).
   - Esperado: toast de éxito, redirección a `/loby`, sesión persistida.

2. **Cuenta pendiente de activación**
   - Login con usuario pendiente.
   - Esperado: mensaje claro de aprobación administrativa.

3. **Credenciales inválidas**
   - Login con password incorrecta.
   - Esperado: mensaje de error del backend (sin romper UI).

4. **Expiración de sesión (401)**
   - Con sesión iniciada, borrar/invalidar token (o esperar expiración).
   - Consumir una ruta protegida.
   - Esperado: logout automático, mensaje de sesión expirada, redirección a `/login`.

5. **Sin permisos (403)**
   - Con usuario no admin, entrar a `/loby/users`.
   - Esperado: redirección a `/loby/forbidden` con mensaje de acceso denegado.

### B. Registro

1. **Registro válido**
   - `/register` con datos correctos.
   - Esperado: toast de cuenta creada + instrucción de verificar correo + redirección a `/login`.

2. **Teléfono inválido**
   - Probar teléfono con menos/más de 8 dígitos o letras.
   - Esperado: validación local bloquea envío.

3. **Contraseñas no coinciden**
   - Password y confirmación distintas.
   - Esperado: mensaje local de “contraseñas no coinciden”.

### C. Verificación de correo

1. **Verificar con token válido**
   - Abrir `/verify-email?token=...` o pegar token manual.
   - Esperado: éxito y redirección a `/login`.

2. **Token inválido/expirado**
   - Token incorrecto.
   - Esperado: mensaje de error claro.

3. **Reenviar verificación**
   - Ir a `/resend-verification` y enviar email.
   - Esperado: mensaje de éxito o error controlado.

### D. Recuperación de contraseña

1. **Solicitar recuperación**
   - `/forgot-password` con correo registrado.
   - Esperado: mensaje de envío de instrucciones.

2. **Reset con token válido**
   - `/reset-password?token=...` (o ingreso manual), nueva contraseña.
   - Esperado: contraseña actualizada + redirección `/login`.

3. **Reset con token inválido**
   - Token incorrecto.
   - Esperado: mensaje de error.

### E. Integración de interceptores

1. **API de Auth y API de Admin/Banking**
   - Confirmar mismo comportamiento ante 401/403 desde módulos distintos (`auth`, `users`, `transactions`, `accounts`).
   - Esperado:
     - 401: logout + redirección login.
     - 403 permiso: toast sin cerrar sesión.

## Resultado esperado para cierre de Auth

Se considera cerrado cuando:

- Todos los casos A-E pasan.
- No hay errores de consola críticos durante flujos Auth.
- Las rutas públicas/protegidas se comportan de forma consistente.
