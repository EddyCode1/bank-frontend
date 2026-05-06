import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import { authService } from '../service/authService'

/**
 * Página de Login
 */
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await authService.login(data.email, data.password)

      if (result.success) {
        login(result.token, result.user)
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
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.45)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)]">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Accede a tu cuenta para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Campo de correo */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text)]">Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@email.com"
            {...register('email', { required: 'Email requerido' })}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Campo de contraseña */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text)]">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('password', { required: 'Contraseña requerida' })}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 font-semibold text-white transition hover:bg-[#4A4BE0] disabled:cursor-not-allowed disabled:bg-[var(--muted)]"
        >
          {isLoading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--muted)]">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-semibold text-[var(--primary)] transition hover:underline">
          Regístrate
        </Link>
      </p>
    </section>
  )
}

export default LoginPage
