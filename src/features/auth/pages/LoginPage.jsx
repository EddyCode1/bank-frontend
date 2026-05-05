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
    <section className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Banco</h1>
        <p className="mt-2 text-sm text-black">
          Accede a tu cuenta para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Campo de correo */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-black">Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@email.com"
            {...register('email', { required: 'Email requerido' })}
            className="w-full rounded-xl border border-black bg-white px-4 py-2.5 text-black outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Campo de contraseña */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-black">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('password', { required: 'Contraseña requerida' })}
            className="w-full rounded-xl border border-black bg-white px-4 py-2.5 text-black outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-white border border-black py-2.5 font-semibold text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300"
        >
          {isLoading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-black">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-semibold text-black transition hover:underline">
          Regístrate
        </Link>
      </p>
    </section>
  )
}

export default LoginPage
