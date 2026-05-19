# Banco del Quetzal — Frontend

Aplicación React + Vite para el sistema bancario **Banco del Quetzal**. Consume
dos backends: el de autenticación (.NET 8) y el de banca (Node.js + MongoDB).
Soporta los flujos completos de cliente y administrador: cuentas, depósitos,
transferencias, favoritos, productos, servicios, saldos, horarios, perfil y
gestión administrativa.

## Requisitos

- Node.js 18 o superior
- pnpm 10.29.3 o superior (también funciona con npm)

## Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone https://github.com/EddyCode1/bank-frontend.git
cd bank-frontend
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copia el ejemplo y ajusta las URLs si los backends corren en otros puertos:

```bash
cp .env.example .env.local
```

```env
# Auth (.NET) corre en 5025; Banca (Node) corre en 3000.
VITE_AUTH_URL=http://localhost:5025/api/v1/auth
VITE_BANKING_URL=http://localhost:3000/SistemaBancarioAdmin/v1

VITE_APP_NAME=Banco del Quetzal
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

## Desarrollo

```bash
pnpm dev       # arranca Vite en http://localhost:5173
pnpm lint      # eslint con --max-warnings 0
pnpm build     # build de producción
pnpm preview   # sirve el build local para validar
```

## Conexión con los backends

| Servicio          | Puerto | Base path                              |
|-------------------|--------|----------------------------------------|
| Auth (.NET)       | 5025   | `/api/v1`                              |
| Banca (Node)      | 3000   | `/SistemaBancarioAdmin/v1`             |

Asegurate de tener ambos servicios corriendo antes de abrir el frontend.
Desde la raíz del repo backend podés levantarlos juntos con
`npm run start:all` (ver `Sistema-Bancario--SCRUM/README.md`).

## Estructura del proyecto

```
src/
├── app/                  # layouts, router, ProtectedRoute, sidebar
├── features/             # módulos por dominio (cada uno con pages/, components/, hooks/, service/, store/)
│   ├── auth/             # login, registro, verify, forgot, reset, forbidden
│   ├── account/          # cuentas cliente + panel admin + profile
│   ├── transaction/      # transferencias, depósitos, historial
│   ├── product/          # catálogo y solicitudes de productos
│   ├── service/          # catálogo y pagos de servicios
│   ├── favorite/         # CRUD de favoritos + directorio admin
│   ├── user/             # gestión administrativa de usuarios
│   ├── dashboard/        # loby, accesos rápidos, widget de tasas
│   ├── financial/        # saldos consolidados + exportar PDF
│   └── schedule/         # horarios y feriados del banco
├── shared/               # api clients, helpers, roles, theming
└── styles/               # variables CSS y reset Tailwind
```

## Stack principal

- **React 19** + **React Router DOM 7**
- **Vite 8** como bundler
- **Tailwind CSS 4** con variables centralizadas (`src/styles/index.css`)
- **Axios** + interceptors compartidos (`shared/api/`)
- **Zustand 5** para state management (`useAuthStore`, `useTransactionStore`,
  `useProductStore`)
- **React Hook Form 7** para formularios
- **React Hot Toast** para notificaciones
- **lucide-react** para iconografía vectorial

## Testing manual

- [`TESTING_AUTH.md`](./TESTING_AUTH.md): matriz de pruebas para los flujos de
  autenticación y autorización.
- [`TESTING_USUARIOS.md`](./TESTING_USUARIOS.md): credenciales demo unificadas
  (`Cliente123!` para todos los clientes seed; `ADMINB` para el admin) y flujo
  recomendado para demostrar todas las vistas.

## Licencia

ISC
