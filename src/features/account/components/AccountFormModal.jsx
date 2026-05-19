import { useEffect, useState } from 'react'

const TYPE_OPTIONS = [
  { value: 'CORRIENTE', label: 'Corriente' },
  { value: 'AHORRO', label: 'Ahorro' },
  { value: 'NOMINA', label: 'Nómina' },
]

const CURRENCY_OPTIONS = [
  { value: 'GTQ', label: 'Quetzales (GTQ)' },
  { value: 'USD', label: 'Dólares (USD)' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
]

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString()
}

export default function AccountFormModal({
  isOpen,
  onClose,
  onSubmit,
  account = null,
  isLoading = false,
  submitError = null,
  isAdmin = false,
  users = [],
}) {
  const isEditing = !!account
  const [formData, setFormData] = useState({
    accountNumber: generateAccountNumber(),
    type: 'CORRIENTE',
    currency: 'GTQ',
    status: 'active',
    balance: 0,
    dailyLimit: 0,
    monthlyLimit: 0,
    ownerId: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) return
    const timer = window.setTimeout(() => {
      setErrors({})
      setFormData({
        accountNumber: account?.accountNumber || generateAccountNumber(),
        type: account?.type || 'CORRIENTE',
        currency: account?.currency || 'GTQ',
        status: account?.status || 'active',
        balance: account?.balance ?? 0,
        dailyLimit: account?.dailyLimit ?? 0,
        monthlyLimit: account?.monthlyLimit ?? 0,
        ownerId: account?.ownerId || '',
      })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [account, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const next = {}
    if (!formData.type) next.type = 'Selecciona el tipo de cuenta'
    if (!formData.currency) next.currency = 'Selecciona la moneda'
    if (!formData.accountNumber) next.accountNumber = 'Número de cuenta requerido'
    if (isAdmin && !isEditing && !formData.ownerId) next.ownerId = 'Selecciona el cliente'
    if (formData.balance < 0) next.balance = 'El saldo inicial no puede ser negativo'
    if (Number(formData.dailyLimit) < 0) next.dailyLimit = 'Límite diario inválido'
    if (Number(formData.monthlyLimit) < 0) next.monthlyLimit = 'Límite mensual inválido'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...formData,
      balance: Number(formData.balance),
      dailyLimit: Number(formData.dailyLimit),
      monthlyLimit: Number(formData.monthlyLimit),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-3xl overflow-y-auto rounded-3xl bg-[var(--surface)] shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-[var(--surface)]">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            {isEditing ? 'Editar cuenta' : 'Crear nueva cuenta'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-2xl font-semibold text-[var(--muted)] hover:opacity-80"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">Número de cuenta</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                readOnly
                className="mt-2 w-full rounded-2xl border px-3 py-2 bg-[var(--gris-claro-fondo)] text-[var(--text)]"
              />
              {errors.accountNumber && <p className="mt-1 text-xs text-[var(--danger)]">{errors.accountNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">Tipo de cuenta</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border px-3 py-2 bg-[var(--bg)] text-[var(--text)]"
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-xs text-[var(--danger)]">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">Moneda</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border px-3 py-2 bg-[var(--bg)] text-[var(--text)]"
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.currency && <p className="mt-1 text-xs text-[var(--danger)]">{errors.currency}</p>}
            </div>

            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border px-3 py-2 bg-[var(--bg)] text-[var(--text)]"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}

            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Saldo inicial</label>
                <input
                  type="number"
                  step="0.01"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border px-3 py-2 bg-[var(--bg)] text-[var(--text)]"
                  min="0"
                />
                {errors.balance && <p className="mt-1 text-xs text-[var(--danger)]">{errors.balance}</p>}
              </div>
            )}

            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Límite diario</label>
                <input
                  type="number"
                  step="0.01"
                  name="dailyLimit"
                  value={formData.dailyLimit}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border px-3 py-2 bg-[var(--bg)] text-[var(--text)]"
                  min="0"
                />
              </div>
            )}

            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Límite mensual</label>
                <input
                  type="number"
                  step="0.01"
                  name="monthlyLimit"
                  value={formData.monthlyLimit}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border px-3 py-2 bg-[var(--bg)] text-[var(--text)]"
                  min="0"
                />
              </div>
            )}

            {isAdmin && !isEditing && (
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-[var(--muted)]">Cliente propietario</label>
                <select
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border px-3 py-2 bg-[var(--bg)] text-[var(--text)]"
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map((user) => (
                    <option key={user.id || user._id} value={user.id || user._id}>
                      {user.nombre || user.username || user.email || 'Usuario'}
                    </option>
                  ))}
                </select>
                {errors.ownerId && <p className="mt-1 text-xs text-[var(--danger)]">{errors.ownerId}</p>}
              </div>
            )}
          </div>

          {submitError && (
            <div className="rounded-2xl border border-[var(--danger)] bg-[rgba(239,68,68,0.1)] p-4 text-sm text-[var(--danger)]">
              {submitError}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-2xl border px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:opacity-90"
              style={{ borderColor: 'var(--border)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar cuenta' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
