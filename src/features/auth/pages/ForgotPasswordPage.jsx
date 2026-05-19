import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail, ArrowRight } from 'lucide-react'
import { authService } from '../service/authService'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await authService.forgotPassword(data.email)
      if (result.success) navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-white/60 bg-white/95 p-8 shadow-[0_20px_60px_-20px_rgba(15,39,68,0.25)] backdrop-blur-sm">
        <div className="mb-7 text-center">
          <span className="inline-block rounded-full bg-[#2d5a8c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2d5a8c]">
            Banco del Quetzal
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Recuperar contraseña</h1>
          <p className="mt-1.5 text-sm text-slate-500">Te enviaremos instrucciones a tu correo.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Correo electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="tu@email.com"
                {...register('email', { required: 'Email requerido' })}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#2d5a8c] focus:ring-2 focus:ring-[#2d5a8c]/15"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d5a8c] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3a5f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Enviando...
              </>
            ) : (
              <>
                Enviar instrucciones
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

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
          <Link to="/resend-verification" className="hover:text-[#2d5a8c] hover:underline">
            Reenviar verificación
          </Link>
        </div>
      </div>
    </div>
  )
}
