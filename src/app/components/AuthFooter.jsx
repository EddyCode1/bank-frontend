import { Link } from 'react-router-dom'
import LogoEmblem from './LogoEmblem'

/**
 * Footer reducido para pantallas de autenticación (login, registro, verificación).
 * Mantiene la marca, los avisos legales mínimos y un copyright; evita el footer
 * institucional completo, que es demasiado denso para una landing de acceso.
 */
const AuthFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-xs text-slate-500 sm:flex-row">
        <div className="flex items-center gap-3">
          <LogoEmblem size="sm" />
          <div className="leading-tight">
            <p className="font-semibold text-slate-700">Banco del Quetzal</p>
            <p className="text-[11px] text-slate-500">Conexión cifrada TLS 1.3</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px]">
          <Link to="/" className="hover:text-[var(--azul-profundo)] transition-colors">Inicio</Link>
          <a href="#" className="hover:text-[var(--azul-profundo)] transition-colors">Términos</a>
          <a href="#" className="hover:text-[var(--azul-profundo)] transition-colors">Privacidad</a>
          <a href="tel:24116000" className="hover:text-[var(--azul-profundo)] transition-colors">Soporte 2411-6000</a>
        </nav>

        <p className="text-[11px] text-slate-400">© {year} Corporación Banco del Quetzal</p>
      </div>
    </footer>
  )
}

export default AuthFooter
