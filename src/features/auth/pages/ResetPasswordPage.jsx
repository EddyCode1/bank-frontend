import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authService } from '../service/authService'

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
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
      if (result.success) {
        navigate('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.45)]">
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-[var(--text)]">Restablecer contraseña</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Define una nueva contraseña segura para tu cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!token && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--text)]">Token de recuperación</label>
            <input
              type="text"
              placeholder="Pega aquí tu token"
              {...register('token', { required: 'Token requerido' })}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
            />
            {errors.token && <p className="text-sm text-red-600">{errors.token.message}</p>}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text)]">Nueva contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('password', {
              required: 'Contraseña requerida',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            })}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text)]">Confirmar contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword', {
              required: 'Confirmar contraseña',
              validate: (value) => value === password || 'Las contraseñas no coinciden',
            })}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-xl bg-[var(--primary)] py-2.5 font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:bg-[var(--muted)]"
        >
          {isLoading ? 'Procesando...' : 'Guardar nueva contraseña'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--muted)]">
        <Link to="/login" className="font-semibold text-[var(--primary)] transition hover:underline">
          Volver al login
        </Link>
      </p>
    </section>
  )
}
