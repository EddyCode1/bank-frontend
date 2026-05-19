import AuthFooter from '../components/AuthFooter'

/**
 * Layout neutro para pantallas de autenticación. No impone fondo ni decoraciones
 * para que cada página (login, registro, verificación, reset) construya su propio
 * layout interno (split-screen, full-card, etc.). Solo añade el footer reducido.
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <main className="flex-1">{children}</main>
      <AuthFooter />
    </div>
  )
}

export default AuthLayout
