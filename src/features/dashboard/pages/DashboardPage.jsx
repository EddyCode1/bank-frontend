import { Link } from 'react-router-dom'

const items = [
  { id: 1, label: 'Cuenta', path: '/loby/account', icon: '◉' },
  { id: 2, label: 'Favoritos', path: '/loby/favorites', icon: '★' },
  { id: 3, label: 'Productos', path: '/loby/products', icon: '◫' },
  { id: 4, label: 'Servicios', path: '/loby/services', icon: '◌' },
  { id: 5, label: 'Transacciones', path: '/loby/transactions', icon: '⇄' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--azul-medio)] via-[var(--azul-vibrante)] to-[var(--verde-jade)] p-8 text-white shadow-lg sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
          Banco del Quetzal
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold italic leading-tight sm:text-4xl">
          Tu bienestar es nuestro trabajo
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          Servicio bancario con solidez institucional: consulta tus cuentas, movimientos y productos con la
          tranquilidad que mereces.
        </p>
      </section>

      {/* Accesos rápidos */}
      <section className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text)]">Accesos rápidos</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Selecciona una sección para continuar.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-white p-4 transition-all hover:border-[var(--primary)] hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg)] text-lg text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                {item.icon}
              </span>
              <span className="font-semibold text-[var(--text)] group-hover:text-[var(--primary)]">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
