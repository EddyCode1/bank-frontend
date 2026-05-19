import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import { authService } from '../service/authService'
import fondoRelieve from '../../../assets/LoginImage.png'

/**
 * Página de Login con layout split-screen:
 *  - Panel izquierdo: identidad visual y propuesta de valor.
 *  - Panel derecho: tarjeta minimalista con el formulario.
 *
 * El acceso a flujos secundarios (registro, verificación, reenvío) se ofrece como
 * microlinks de texto para no saturar la pantalla principal de ingreso.
 */
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuthStore()
  const navigate = useNavigate()

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
    <section className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:grid-cols-2">
      {/* Panel izquierdo: branding + propuesta de valor */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0f2744] via-[#1e3a5f] to-[#2d5a8c] lg:flex lg:items-center lg:justify-center">
        <img
          src={fondoRelieve}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-luminosity"
        />
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative z-10 max-w-md px-12 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
            Banca digital
          </span>
          <h2 className="mt-6 text-4xl font-bold leading-tight">
            Tu banco, simple<br />y siempre contigo.
          </h2>
          <p className="mt-4 text-base text-white/80">
            Consulta saldos, transfiere entre cuentas y paga servicios desde una sola plataforma diseñada para ti.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/85">
            <li className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-cyan-300" />
              <span>Cifrado de extremo a extremo y verificación multifactor.</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-cyan-300" />
              <span>Disponible 24/7 desde cualquier dispositivo.</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-cyan-300" />
              <span>Soporte humano cuando lo necesitas.</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* Panel derecho: formulario compacto */}
      <div className="flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <span className="inline-block rounded-full bg-[#2d5a8c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2d5a8c]">
              Banco del Quetzal
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Inicia sesión</h1>
            <p className="mt-2 text-sm text-slate-500">Accede a tu banca digital.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Correo o usuario</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="correo@dominio.com"
                  {...register('email', { required: 'Correo o usuario requerido' })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#2d5a8c] focus:ring-2 focus:ring-[#2d5a8c]/15"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600">Contraseña</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#2d5a8c] transition hover:text-[#1e3a5f] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password', { required: 'Contraseña requerida' })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#2d5a8c] focus:ring-2 focus:ring-[#2d5a8c]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#2d5a8c]"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d5a8c] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3a5f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 lg:text-left">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-[#2d5a8c] hover:underline">
              Regístrate
            </Link>
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400 lg:justify-start">
            <Link to="/verify-email" className="hover:text-[#2d5a8c] hover:underline">
              Verificar correo
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/resend-verification" className="hover:text-[#2d5a8c] hover:underline">
              Reenviar verificación
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
