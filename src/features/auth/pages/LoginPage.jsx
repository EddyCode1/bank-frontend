import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import { authService } from '../service/authService'
import fondoRelieve from '../../../assets/LoginImage.png'

/**
 * Página de Login
 */
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const { login } = useAuthStore()
  const navigate = useNavigate()
  
  const email = watch('email')
  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await authService.login(data.email, data.password)

      if (result.success) {
        login(result.token, result.user, result.refreshToken)
        toast.success('Sesión iniciada correctamente')
        navigate('/loby')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-full h-full">
          <img
            src={fondoRelieve}
            alt="Fondo relieve quetzales"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-screen-2xl items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <div className="relative flex items-center justify-center">
            <div className="w-full rounded-[2.5rem] border border-slate-100 bg-white/95 backdrop-blur-lg p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] animate-fade-in hover:shadow-[0_50px_120px_-30px_rgba(0,0,0,0.15)] transition-all duration-300">
              
              <div className="mb-2 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2d5a8c]/10 to-[#4a7ba7]/10 px-4 py-2 mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2d5a8c]">Banco del Quetzal</p>
                </div>
              </div>

              <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-[#1a1a1a] leading-tight">Accede a tu cuenta</h1>
                <p className="mt-3 text-base text-slate-600">Ingresa de forma segura a tu banca digital</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder=" "
                    {...register('email', { required: 'Correo o usuario requerido' })}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className="peer w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-4 px-5 text-base text-[#0f2744] outline-none transition-all duration-300 focus:border-[#2d5a8c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,90,140,0.1)] hover:border-[#2d5a8c]/50"
                  />
                  <label
                    className={`absolute left-5 transition-all duration-300 pointer-events-none font-semibold ${
                      emailFocused || email
                        ? 'top-2 text-xs text-[#2d5a8c]'
                        : 'top-1/2 -translate-y-1/2 text-base text-slate-400'
                    }`}
                  >
                    Correo o usuario
                  </label>
                  {errors.email && <p className="text-sm text-red-500 font-medium mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder=" "
                        {...register('password', { required: 'Contraseña requerida' })}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        className="peer w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-4 px-5 text-base text-[#0f2744] outline-none transition-all duration-300 focus:border-[#2d5a8c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,90,140,0.1)] hover:border-[#2d5a8c]/50"
                      />
                      <label
                        className={`absolute left-5 transition-all duration-300 pointer-events-none font-semibold ${
                          passwordFocused || password
                            ? 'top-2 text-xs text-[#2d5a8c]'
                            : 'top-1/2 -translate-y-1/2 text-base text-slate-400'
                        }`}
                      >
                        Contraseña
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-xs font-bold text-[#2d5a8c] transition hover:text-[#1e3a5f] hover:scale-110 ml-2"
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>}
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 p-3 mt-6">
                  <span className="text-lg font-bold text-blue-700">✓</span>
                  <p className="text-xs text-blue-700 font-medium">Tu conexión es 100% segura y encriptada</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#2d5a8c] to-[#1e3a5f] px-6 py-4 text-base font-bold text-white shadow-[0_10px_30px_-15px_rgba(45,90,140,0.4)] transition-all duration-300 hover:shadow-[0_15px_40px_-10px_rgba(45,90,140,0.5)] hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Iniciando sesión...
                    </span>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </form>

              <div className="mt-8 space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-slate-500 font-medium">¿Necesitas ayuda?</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/forgot-password"
                    className="block rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-[#2d5a8c] transition-all duration-300 hover:border-[#2d5a8c] hover:bg-[#2d5a8c]/5 hover:text-[#1e3a5f]"
                  >
                    🔑 ¿Olvidaste contraseña?
                  </Link>
                  <Link
                    to="/register"
                    className="block rounded-xl border-2 border-[#2d5a8c]/30 bg-[#2d5a8c]/5 px-4 py-3 text-center text-sm font-semibold text-[#2d5a8c] transition-all duration-300 hover:border-[#2d5a8c] hover:bg-[#2d5a8c]/10 hover:shadow-md"
                  >
                    ✨ Crear cuenta
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/verify-email"
                    className="block rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-[#2d5a8c] transition-all duration-300 hover:border-[#2d5a8c] hover:bg-[#2d5a8c]/5"
                  >
                    ✉️ Verificar correo
                  </Link>
                  <Link
                    to="/resend-verification"
                    className="block rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-[#2d5a8c] transition-all duration-300 hover:border-[#2d5a8c] hover:bg-[#2d5a8c]/5"
                  >
                    🔄 Reenviar verificación
                  </Link>
                </div>
              </div>

              <p className="mt-8 text-center text-xs text-slate-500 leading-relaxed">
                Protegido por encriptación de nivel bancario. <br />
                <span className="text-[#2d5a8c] font-semibold">Tu información es segura.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
