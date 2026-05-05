const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-8">
      <div className="relative w-full max-w-md sm:max-w-lg">{children}</div>
    </div>
  )
}

export default AuthLayout
