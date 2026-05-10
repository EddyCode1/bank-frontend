import BrandLogo from '../components/BrandLogo'

const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-4 py-8">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--primary)]/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[var(--secondary)]/12 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-[var(--azul-vibrante)]/5 blur-3xl" />

      <div className="relative w-full max-w-md space-y-6 sm:max-w-lg">
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
