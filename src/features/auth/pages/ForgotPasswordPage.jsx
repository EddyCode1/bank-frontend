import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authService } from '../service/authService'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await authService.forgotPassword(data.email)
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
        <h1 className="text-3xl font-bold text-[var(--text)]">Recuperar contraseña</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Ingresa tu correo y te enviaremos las instrucciones para restablecer acceso.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text)]">Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@email.com"
            {...register('email', { required: 'Email requerido' })}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-xl bg-[var(--primary)] py-2.5 font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:bg-[var(--muted)]"
        >
          {isLoading ? 'Procesando...' : 'Enviar instrucciones'}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link to="/login" className="font-semibold text-[var(--primary)] transition hover:underline">
          Volver al login
        </Link>
        <Link to="/resend-verification" className="font-semibold text-[var(--primary)] transition hover:underline">
          Reenviar verificación
        </Link>
      </div>
    </section>
  )
}
