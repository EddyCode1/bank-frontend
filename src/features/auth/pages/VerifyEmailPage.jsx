import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { MailCheck, KeyRound, ArrowRight } from 'lucide-react'
import { authService } from '../service/authService'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [tokenInput, setTokenInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const tokenFromUrl = useMemo(() => searchParams.get('token') || '', [searchParams])

  const handleVerify = async () => {
    const token = (tokenFromUrl || tokenInput).trim()
    if (!token) return
    setIsLoading(true)
    try {
      const result = await authService.verifyEmail(token)
      if (result.success) navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-white/60 bg-white/95 p-8 shadow-[0_20px_60px_-20px_rgba(15,39,68,0.25)] backdrop-blur-sm">
        <div className="mb-7 text-center">
          <div className="mb-3 flex justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2d5a8c]/10 text-[#2d5a8c]">
              <MailCheck size={22} />
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Verificar correo</h1>
          <p className="mt-1.5 text-sm text-slate-500">Confirma tu cuenta usando el enlace o token que recibiste.</p>
        </div>

        {!tokenFromUrl && (
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Token de verificación</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                placeholder="Pega aquí el token del correo"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#2d5a8c] focus:ring-2 focus:ring-[#2d5a8c]/15"
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleVerify}
          disabled={isLoading || (!tokenFromUrl && !tokenInput.trim())}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d5a8c] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3a5f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Verificando...
            </>
          ) : (
            <>
              Verificar correo
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/login" className="font-semibold text-[#2d5a8c] hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
          <Link to="/resend-verification" className="hover:text-[#2d5a8c] hover:underline">
            ¿No recibiste el correo? Reenviar
          </Link>
        </div>
      </div>
    </div>
  )
}
