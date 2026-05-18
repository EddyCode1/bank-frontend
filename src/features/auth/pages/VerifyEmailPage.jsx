import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
        <h1 className="text-3xl font-bold text-[var(--text)]">Verificar correo</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Confirma tu cuenta usando el enlace que recibiste por correo.
        </p>
      </div>

      {!tokenFromUrl && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text)]">Token de verificación</label>
          <input
            type="text"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
            placeholder="Pega aquí el token del correo"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleVerify}
        disabled={isLoading || (!tokenFromUrl && !tokenInput.trim())}
        className="mt-5 w-full rounded-xl bg-[var(--primary)] py-2.5 font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:bg-[var(--muted)]"
      >
        {isLoading ? 'Procesando...' : 'Verificar correo'}
      </button>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link to="/resend-verification" className="font-semibold text-[var(--primary)] transition hover:underline">
          Reenviar correo de verificación
        </Link>
        <Link to="/login" className="font-semibold text-[var(--primary)] transition hover:underline">
          Volver al login
        </Link>
      </div>
    </section>
  )
}
