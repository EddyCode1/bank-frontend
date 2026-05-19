import AuthFooter from '../components/AuthFooter'
import fondoRelieve from '../../assets/LoginImage.png'

/**
 * Layout compartido por todas las pantallas de autenticación (login, registro,
 * recuperación, verificación, reenvío, acceso denegado). Aporta el fondo de
 * quetzales en relieve, centra el card de la página y agrega el AuthFooter
 * reducido. Cada página solo necesita renderizar su card sin preocuparse por
 * fondos ni alineación.
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-100">
      <img
        src={fondoRelieve}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>

      <div className="relative z-10">
        <AuthFooter />
      </div>
    </div>
  )
}

export default AuthLayout
