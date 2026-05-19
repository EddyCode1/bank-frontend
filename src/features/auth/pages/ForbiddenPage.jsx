import { Link, useLocation } from 'react-router-dom'
import { ShieldX, ArrowRight, LogIn } from 'lucide-react'

export default function ForbiddenPage() {
  const location = useLocation()
  const requiredRole = location.state?.requiredRole

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-white/60 bg-white/95 p-8 shadow-[0_20px_60px_-20px_rgba(15,39,68,0.25)] backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="mb-3 flex justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <ShieldX size={22} />
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Acceso denegado</h1>
          <p className="mt-1.5 text-sm text-slate-500">No tienes permisos para acceder a esta sección.</p>
          {requiredRole && (
            <p className="mt-2 text-xs text-slate-500">
              Rol requerido:{' '}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">{requiredRole}</span>
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <Link
            to="/loby"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d5a8c] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3a5f]"
          >
            Volver al panel
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#2d5a8c] hover:text-[#2d5a8c]"
          >
            <LogIn size={16} />
            Cambiar de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
