## 🧪 Instrucciones para Probar la Funcionalidad de Usuarios

### ✅ Cambios realizados para el testing:

1. **Usuario Mock**: Se agregó un usuario `ADMIN_ROLE` en el auth store
   - Email: `admin@banco.com`
   - Usuario: `admin`
   - Rol: `ADMIN_ROLE` (tiene acceso a la sección de administración)

2. **Rutas sin protección**: Removimos ProtectedRoute del layout principal para acceso directo

3. **Datos Mock**: Se creó un conjunto de 5 usuarios con cuentas asociadas en `adminClient.js`
   - Los usuarios tienen nombres, emails, teléfonos, roles
   - Algunas cuentas inactivas para probar estados

### 🚀 Cómo probar:

#### Opción 1: Acceso directo (Recomendado)
```
http://localhost:5173/loby/users
```
- Se abre directamente la página de usuarios
- No necesitas login ni token válido

#### Opción 2: Ver detalle de un usuario
Haz clic en "Ver detalle" en cualquier usuario de la tabla, o accede directamente:
```
http://localhost:5173/loby/users/user-001
```

#### Opción 3: Dashboard completo
```
http://localhost:5173/loby
```
- Se ve el sidebar con el menú
- El menú de "Administración → Usuarios" solo aparece para admins

### 📋 Pruebas que puedes hacer:

1. **Lista de usuarios**
   - [ ] Carga la tabla con 5 usuarios
   - [ ] Búsqueda en tiempo real (por nombre, email, usuario)
   - [ ] Se muestra el total de usuarios

2. **Detalle de usuario**
   - [ ] Carga los datos personales correctamente
   - [ ] Tab "Cuentas" muestra las cuentas asociadas
   - [ ] Estados de las cuentas con colores (activa/inactiva)
   - [ ] Botón "Volver" regresa a la lista

3. **Comportamiento**
   - [ ] Sin errores en la consola
   - [ ] Loader aparece mientras carga
   - [ ] Navegación funciona correctamente

### 🔧 Para volver a producción:

Cuando tengas el backend funcional y login real, deberás:

1. **En `src/app/router/routes.jsx`**: Volver a activar `ProtectedRoute`
   ```jsx
   {
     path: '/loby',
     element: (
       <ProtectedRoute>
         <MainLayout />
       </ProtectedRoute>
     ),
   ```

2. **En `src/features/auth/store/useAuthStore.js`**: Remover el usuario mock
   - Cambiar `token: MOCK_TOKEN` → `token: null`
   - Cambiar `user: MOCK_USER` → `user: null`
   - Cambiar `isAuthenticated: true` → `isAuthenticated: false`

3. **En `src/shared/api/adminClient.js`**: Remover el interceptor mock
   - Eliminar la sección de MOCK_USERS y el manejo de errores de mock

### 📝 Notas:

- Los datos están siendo mockeados en `src/shared/api/adminClient.js`
- Cuando conectes con el backend real, el interceptor ignorará los endpoints reales
- El usuario tiene rol `ADMIN_ROLE` para ver la sección de administración
