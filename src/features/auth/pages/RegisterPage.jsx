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
    <section className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg">
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-black">Crear cuenta</h1>
        <p className="mt-2 text-sm text-black">Regístrate para gestionar tu cuenta.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-black">Nombre completo</label>
          <input
            type="text"
            placeholder="Tu nombre"
            {...register('nombre', { required: 'Nombre requerido' })}
            className="w-full rounded-xl border border-black bg-white px-4 py-2.5 text-black outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
          />
          {errors.nombre && <p className="text-sm text-red-600">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-black">Usuario</label>
          <input
            type="text"
            placeholder="nombre_usuario"
            {...register('username', { required: 'Usuario requerido' })}
            className="w-full rounded-xl border border-black bg-white px-4 py-2.5 text-black outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
          />
          {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-black">Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@email.com"
            {...register('email', { required: 'Email requerido' })}
            className="w-full rounded-xl border border-black bg-white px-4 py-2.5 text-black outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-black">Teléfono</label>
          <input
            type="tel"
            placeholder="123456789"
            {...register('telefono', { required: 'Teléfono requerido' })}
            className="w-full rounded-xl border border-black bg-white px-4 py-2.5 text-black outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
          />
          {errors.telefono && <p className="text-sm text-red-600">{errors.telefono.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-black">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('password', { required: 'Contraseña requerida' })}
            className="w-full rounded-xl border border-black bg-white px-4 py-2.5 text-black outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-black">Confirmar contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword', {
              required: 'Confirmar contraseña',
              validate: (value) => value === password || 'Las contraseñas no coinciden',
            })}
            className="w-full rounded-xl border border-black bg-white px-4 py-2.5 text-black outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/10"
          />
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-xl bg-white border border-black py-2.5 font-semibold text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300"
        >
          {isLoading ? 'Cargando...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-black">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-black transition hover:underline">
          Inicia sesión
        </Link>
      </p>
    </section>
  )
}

export default RegisterPage
