import BrandLogo from '../components/BrandLogo'

const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--surface)] px-4 py-8">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[var(--secondary)]/10 blur-3xl" />

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
