import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, KeyRound, Lock, ArrowRight } from 'lucide-react'
import { authService } from '../service/authService'

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const finalToken = token || data.token
      const result = await authService.resetPassword(finalToken, data.password)
      if (result.success) navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const inputBase =
    'w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#2d5a8c] focus:ring-2 focus:ring-[#2d5a8c]/15'

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-white/60 bg-white/95 p-8 shadow-[0_20px_60px_-20px_rgba(15,39,68,0.25)] backdrop-blur-sm">
        <div className="mb-7 text-center">
          <span className="inline-block rounded-full bg-[#2d5a8c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2d5a8c]">
            Banco del Quetzal
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Restablecer contraseña</h1>
          <p className="mt-1.5 text-sm text-slate-500">Define una nueva contraseña segura.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!token && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Token de recuperación</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Pega aquí tu token" {...register('token', { required: 'Token requerido' })} className={inputBase} />
              </div>
              {errors.token && <p className="mt-1 text-xs text-red-500">{errors.token.message}</p>}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nueva contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Contraseña requerida',
                  minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                })}
                className={`${inputBase} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
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
                onClick={() => setShowConfirm((v) => !v)}
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
                Procesando...
              </>
            ) : (
              <>
                Guardar contraseña
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/login" className="font-semibold text-[#2d5a8c] hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
