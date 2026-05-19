import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, User, AtSign, Mail, Phone, Lock, ArrowRight } from 'lucide-react'
import { authService } from '../service/authService'

/**
 * Página de Registro con card minimalista y campos iconificados.
 */
const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const password = watch('password')

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)
    try {
      const res = await authService.register({
        nombre: data.nombre,
        username: data.username,
        email: data.email,
        telefono: data.telefono,
        password: data.password,
      })

      if (res.success) {
        toast.success('Cuenta creada. Revisa tu correo para verificar y espera activación administrativa.')
        navigate('/login')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const inputBase =
    'w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#2d5a8c] focus:ring-2 focus:ring-[#2d5a8c]/15'

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/60 bg-white/95 p-8 shadow-[0_20px_60px_-20px_rgba(15,39,68,0.25)] backdrop-blur-sm">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-[#2d5a8c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2d5a8c]">
            Banco del Quetzal
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Crear cuenta</h1>
          <p className="mt-1.5 text-sm text-slate-500">Regístrate para gestionar tu cuenta.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nombre completo</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Tu nombre" {...register('nombre', { required: 'Nombre requerido' })} className={inputBase} />
            </div>
            {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Usuario</label>
            <div className="relative">
              <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="nombre_usuario" {...register('username', { required: 'Usuario requerido' })} className={inputBase} />
            </div>
            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Correo electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" placeholder="tu@email.com" {...register('email', { required: 'Email requerido' })} className={inputBase} />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Teléfono</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                placeholder="12345678"
                inputMode="numeric"
                maxLength={8}
                {...register('telefono', {
                  required: 'Teléfono requerido',
                  pattern: { value: /^\d{8}$/, message: 'El teléfono debe tener exactamente 8 dígitos' },
                  onChange: (event) => {
                    const onlyDigits = event.target.value.replace(/\D/g, '').slice(0, 8)
                    event.target.value = onlyDigits
                  },
                })}
                className={inputBase}
              />
            </div>
            {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Contraseña requerida',
                  minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' },
                })}
                className={`${inputBase} pr-10`}
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

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Confirmar contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Confirmar contraseña',
                  validate: (value) => value === password || 'Las contraseñas no coinciden',
                })}
                className={`${inputBase} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#2d5a8c]"
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d5a8c] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3a5f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear cuenta
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-[#2d5a8c] hover:underline">
            Inicia sesión
          </Link>
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
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
  )
}

export default RegisterPage
