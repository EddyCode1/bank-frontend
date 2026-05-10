import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authService } from '../service/authService'

/**
 * Página de Registro
 */
const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)
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
        toast.success('Cuenta creada exitosamente')
        navigate('/login')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.45)]">
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-[var(--text)]">Crear cuenta</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Regístrate para gestionar tu cuenta.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text)]">Nombre completo</label>
          <input
            type="text"
            placeholder="Tu nombre"
            {...register('nombre', { required: 'Nombre requerido' })}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          {errors.nombre && <p className="text-sm text-red-600">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text)]">Usuario</label>
          <input
            type="text"
            placeholder="nombre_usuario"
            {...register('username', { required: 'Usuario requerido' })}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
        </div>

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

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text)]">Teléfono</label>
          <input
            type="tel"
            placeholder="123456789"
            {...register('telefono', { required: 'Teléfono requerido' })}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          {errors.telefono && <p className="text-sm text-red-600">{errors.telefono.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text)]">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('password', { required: 'Contraseña requerida' })}
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
          {isLoading ? 'Cargando...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--muted)]">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-[var(--primary)] transition hover:underline">
          Inicia sesión
        </Link>
      </p>
    </section>
  )
}

export default RegisterPage
