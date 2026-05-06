import React from 'react'
import { Link } from 'react-router-dom'

const items = [
  { id: 1, label: 'Cuenta', path: '/loby/account' },
  { id: 2, label: 'Favoritos', path: '/loby/favorites' },
  { id: 3, label: 'Productos', path: '/loby/products' },
  { id: 4, label: 'Servicios', path: '/loby/services' },
  { id: 5, label: 'Transacciones', path: '/loby/transactions' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-[var(--ai-gradient-start)] to-[var(--ai-gradient-end)] p-6 text-white shadow-[0_20px_40px_-24px_rgba(91,92,246,0.7)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          Bienvenido
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Tu bienestar financiero es nuestro trabajo
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
          Explora tus cuentas, movimientos y servicios de forma segura y sin complicaciones.
        </p>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-[var(--text)] sm:text-2xl">Accesos rápidos</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Selecciona una sección para continuar.</p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Link
              key={it.id}
              to={it.path}
              className="block w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center font-medium text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {it.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}