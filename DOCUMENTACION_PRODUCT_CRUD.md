# 📊 Documentación - CRUD Products (React Frontend)

## 📁 Estructura de Carpetas

```
src/features/product/
├── pages/
│   └── ProductPage.jsx              ← Página principal
├── components/
│   ├── ProductList.jsx              ← Listado en grid
│   ├── ProductForm.jsx              ← Formulario modal
│   └── index.js                     ← Exportaciones
└── index.js
```

---

## 🔧 Componentes Creados

### 1. **ProductPage.jsx** - Contenedor Principal

| Aspecto | Descripción |
|--------|-------------|
| **Ubicación** | `src/features/product/pages/ProductPage.jsx` |
| **Tipo** | Functional Component (Container) |
| **Responsabilidad** | Lógica CRUD, gestión de estado y API |
| **Líneas** | 179 |

#### Estado Interno
| Estado | Tipo | Valor Default | Descripción |
|--------|------|----------------|-------------|
| `products` | Array | `[]` | Lista de productos del backend |
| `loading` | Boolean | `false` | Indicador de carga |
| `error` | String \| null | `null` | Mensajes de error |
| `showForm` | Boolean | `false` | Mostrar/ocultar modal formulario |
| `editingProduct` | Object \| null | `null` | Producto en modo edición |
| `filters` | Object | `{type: '', is_active: ''}` | Filtros aplicados |

#### Funciones Principales
| Función | Método HTTP | URL | Descripción |
|---------|-------------|-----|-------------|
| `fetchProducts()` | GET | `/products` | Cargar productos con filtros |
| `handleCreate()` | POST | `/products` | Crear nuevo producto |
| `handleUpdate()` | PUT | `/products/:id` | Actualizar producto existente |
| `handleDelete()` | DELETE | `/products/:id` | Eliminar producto |
| `handleEdit()` | - | - | Preparar edición (abre modal) |
| `handleCloseForm()` | - | - | Cerrar modal y limpiar estado |

#### Hooks Utilizados
```jsx
useState()              // Gestionar estado local
useEffect()            // Cargar productos al montar
useAuthStore()         // Obtener usuario y validar rol
adminClient            // Cliente HTTP con autenticación
```

#### Control de Acceso
```javascript
const isAdmin = user?.role === 'ADMIN'

// Elementos visibles solo para ADMIN:
✓ Botón "Nuevo Producto"
✓ Props onEdit, onDelete en ProductList
```

---

### 2. **ProductList.jsx** - Grid de Tarjetas

| Aspecto | Descripción |
|--------|-------------|
| **Ubicación** | `src/features/product/components/ProductList.jsx` |
| **Tipo** | Functional Component (Presentational) |
| **Responsabilidad** | Renderizar lista visual de productos |
| **Líneas** | 100 |

#### Props Esperadas
| Prop | Tipo | Requerida | Descripción |
|------|------|----------|-------------|
| `products` | Array | ✓ | Array de productos |
| `isAdmin` | Boolean | ✓ | Mostrar botones de edición |
| `onEdit` | Function | ✓ | Callback al hacer clic en editar |
| `onDelete` | Function | ✓ | Callback al hacer clic en eliminar |

#### Estructura de la Tarjeta
```
┌─────────────────────────────────────┐
│ Nombre                    [Estado]   │ ← Header
│ [Tipo Badge]                         │
├─────────────────────────────────────┤
│ Descripción (truncada)               │ ← Body
│                                      │
│ Precio: Q 150.00                     │
│ ID: abc123de...                      │
│ Creado por: admin-001                │
│ Creado: 15/05/2026                   │
│ Actualizado: 15/05/2026              │
├─────────────────────────────────────┤
│ [Editar]         [Eliminar]          │ ← Footer (solo admin)
└─────────────────────────────────────┘
```

#### Características Visuales
| Elemento | Estilos | Colores |
|----------|---------|---------|
| **Tipo Badge** | Rounded, font-semibold | `PRODUCTO`: Azul / `SERVICIO`: Púrpura |
| **Estado Badge** | Rounded, font-semibold | `Activo`: Verde / `Inactivo`: Rojo |
| **Grid Responsivo** | 1 col mobile / 2 col tablet / 3 col desktop | - |
| **Tarjeta Hover** | Aumenta shadow, transición suave | - |

---

### 3. **ProductForm.jsx** - Formulario Modal

| Aspecto | Descripción |
|--------|-------------|
| **Ubicación** | `src/features/product/components/ProductForm.jsx` |
| **Tipo** | Functional Component (Form) |
| **Responsabilidad** | Validación y entrada de datos |
| **Líneas** | 221 |

#### Props Esperadas
| Prop | Tipo | Requerida | Descripción |
|------|------|----------|-------------|
| `product` | Object \| null | ✓ | Null para CREATE, Object para UPDATE |
| `onSubmit` | Function | ✓ | Callback con datos del formulario |
| `onClose` | Function | ✓ | Callback al cerrar modal |

#### Campos del Formulario
| Campo | Tipo | Validación | Límites |
|-------|------|------------|---------|
| **name** | text | Requerido, no vacío | max 100 caracteres |
| **description** | textarea | Opcional | max 500 caracteres |
| **type** | select | Requerido | enum: `PRODUCTO` \| `SERVICIO` |
| **price** | number | Requerido, no negativo | min 0 |

#### Validaciones en Tiempo Real
```javascript
✓ name: no vacío y <= 100 caracteres
✓ description: <= 500 caracteres
✓ type: debe ser PRODUCTO o SERVICIO
✓ price: número válido y >= 0
✓ Limpieza de errores mientras se edita
```

#### Estado del Formulario
| Estado | Tipo | Descripción |
|--------|------|-------------|
| `formData` | Object | Datos del formulario actual |
| `errors` | Object | Mensajes de error por campo |
| `isSubmitting` | Boolean | Indicador de envío en progreso |

---

## 🔄 Flujo de Datos CRUD

### CREATE (Crear Producto)
```
Usuario hace clic en "Nuevo Producto"
    ↓
showForm = true
    ↓
ProductForm renderiza con product = null
    ↓
Usuario completa formulario
    ↓
handleSubmit() valida datos
    ↓
handleCreate() hace POST /products
    ↓
Nuevo producto se agrega al inicio del array
    ↓
Modal se cierra, showForm = false
```

### READ (Listar Productos)
```
ProductPage monta
    ↓
useEffect se ejecuta
    ↓
fetchProducts() hace GET /products (con filtros)
    ↓
products = response.data.products
    ↓
ProductList renderiza grid de tarjetas
```

### UPDATE (Actualizar Producto)
```
Usuario hace clic en "Editar" en tarjeta
    ↓
handleEdit() → showForm = true, editingProduct = producto
    ↓
ProductForm renderiza con datos precargados
    ↓
Usuario modifica datos
    ↓
handleSubmit() valida
    ↓
handleUpdate() hace PUT /products/:id
    ↓
Producto se actualiza en el array
    ↓
Modal se cierra
```

### DELETE (Eliminar Producto)
```
Usuario hace clic en "Eliminar"
    ↓
window.confirm() pide confirmación
    ↓
Si confirma: handleDelete() hace DELETE /products/:id
    ↓
Producto se remueve del array
    ↓
Lista se re-renderiza
```

---

## 📡 Endpoints API Utilizados

| Método | Endpoint | Descripción | Headers |
|--------|----------|-------------|---------|
| **GET** | `/products` | Obtener todos (con filtros opcionales) | Authorization: Bearer token |
| **GET** | `/products?type=PRODUCTO&is_active=true` | Obtener filtrados | Authorization: Bearer token |
| **POST** | `/products` | Crear nuevo (solo ADMIN) | Authorization: Bearer token |
| **PUT** | `/products/:id` | Actualizar (solo ADMIN) | Authorization: Bearer token |
| **DELETE** | `/products/:id` | Eliminar (solo ADMIN) | Authorization: Bearer token |

### Parámetros de Query
| Parámetro | Tipo | Valores |
|-----------|------|--------|
| `type` | string | `PRODUCTO` \| `SERVICIO` (opcional) |
| `is_active` | string | `'true'` \| `'false'` (opcional) |

---

## 🗺️ Mapeo Schema MongoDB → React Form

| Campo MongoDB | Campo React | Tipo | Required | Max Length |
|---|---|---|---|---|
| `name` | formData.name | string | ✓ | 100 |
| `description` | formData.description | string | ✗ | 500 |
| `type` | formData.type | enum | ✓ | - |
| `price` | formData.price | number | ✓ | - |
| `is_active` | (filtro en UI) | boolean | ✗ | - |
| `created_by` | (automático) | string | ✓ | - |
| `createdAt` | (mostrado solo lectura) | date | - | - |
| `updatedAt` | (mostrado solo lectura) | date | - | - |

---

## 🎨 Estilos Tailwind Utilizados

### Paleta de Colores

| Elemento | Clases Tailwind |
|----------|-----------------|
| **Botón Principal** | `bg-blue-600 hover:bg-blue-700 text-white` |
| **Botón Secundario** | `bg-gray-200 hover:bg-gray-300 text-gray-700` |
| **Botón Editar** | `bg-blue-50 hover:bg-blue-100 text-blue-600` |
| **Botón Eliminar** | `bg-red-50 hover:bg-red-100 text-red-600` |
| **Error** | `bg-red-50 border-red-200 text-red-800` |
| **Success** | `bg-green-100 text-green-800` |

### Responsive Design

| Breakpoint | Producto por Fila |
|------------|------------------|
| Mobile | 1 |
| Tablet (md) | 2 |
| Desktop (lg) | 3 |

---

## 🔐 Control de Rol

| Rol | Permisos |
|-----|----------|
| **USER** | ✓ Ver listado<br>✓ Ver detalles<br>✓ Usar filtros<br>✗ Crear<br>✗ Editar<br>✗ Eliminar |
| **ADMIN** | ✓ Ver listado<br>✓ Ver detalles<br>✓ Usar filtros<br>✓ Crear<br>✓ Editar<br>✓ Eliminar |

---

## ✨ Características Implementadas

| Característica | Estado |
|---|---|
| CRUD Completo (Create/Read/Update/Delete) | ✅ |
| Filtrado por tipo y estado | ✅ |
| Validación de formulario | ✅ |
| Mensajes de error | ✅ |
| Indicadores de carga | ✅ |
| Modal para crear/editar | ✅ |
| Confirmación antes de eliminar | ✅ |
| Responsivo (mobile/tablet/desktop) | ✅ |
| Control de rol (solo admin) | ✅ |
| Timestamps visibles | ✅ |
| Contador de caracteres en form | ✅ |
| Limpieza de errores mientras se edita | ✅ |

---

## 🚀 Cómo Usar

### Cargar página de productos
```javascript
// Automáticamente en ProductPage
- Se cargan todos los productos
- Se filtran según los controles select
```

### Crear producto (ADMIN)
```javascript
1. Click botón "Nuevo Producto"
2. Completar form (name*, type*, price* requeridos)
3. Click "Crear"
4. Modal cierra y aparece en lista
```

### Editar producto (ADMIN)
```javascript
1. Click "Editar" en tarjeta
2. Modal abre con datos precargados
3. Modificar campos
4. Click "Actualizar"
5. Cambios reflejados en lista
```

### Eliminar producto (ADMIN)
```javascript
1. Click "Eliminar" en tarjeta
2. Confirmar en diálogo
3. Producto desaparece de lista
```

### Filtrar productos
```javascript
1. Usar select "Todos los tipos" para filtrar por PRODUCTO/SERVICIO
2. Usar select "Todos los estados" para filtrar Activos/Inactivos
3. Lista se actualiza automáticamente
```

---

## 📋 Archivos Creados/Modificados

| Archivo | Acción | Tipo |
|---------|--------|------|
| `src/features/product/pages/ProductPage.jsx` | Modificado | Component |
| `src/features/product/components/ProductList.jsx` | Creado | Component |
| `src/features/product/components/ProductForm.jsx` | Creado | Component |
| `src/features/product/components/index.js` | Creado | Export |

---

## 📌 Notas Importantes

- El `created_by` se obtiene automáticamente del `req.user.id` en el backend
- Los timestamps (`createdAt`, `updatedAt`) se generan automáticamente en MongoDB
- Solo admins pueden modificar la colección de productos
- El `is_active` se gestiona en el backend pero se filtra desde el frontend
- El estado se mantiene en el componente ProductPage (no usa Redux/Context)
- Las validaciones se hacen tanto en frontend como en backend
