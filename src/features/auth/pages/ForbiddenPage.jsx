import { Link, useLocation } from 'react-router-dom'

export default function ForbiddenPage() {
  const location = useLocation()
  const requiredRole = location.state?.requiredRole

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.45)]">
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-[var(--text)]">Acceso denegado</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          No tienes permisos para acceder a esta sección.
        </p>
        {requiredRole && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            Rol requerido: <span className="font-semibold text-[var(--text)]">{requiredRole}</span>
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/loby"
          className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-center font-semibold text-white transition hover:bg-[var(--primary-dark)]"
        >
          Volver al panel
        </Link>
        <Link
          to="/login"
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-center font-semibold text-[var(--text)] transition hover:bg-[var(--bg)]"
        >
          Cambiar de sesión
        </Link>
      </div>
    </section>
  )
}
