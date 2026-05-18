import { useEffect, useState } from 'react'
import { transactionService } from '../service/transactionService'

function formatDate(value) {
  if (!value) return 'N/A'
  try {
    return new Date(value).toLocaleString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Fecha inválida'
  }
}

function formatMoney(amount, currency = 'GTQ') {
  return Number(amount || 0).toLocaleString('es-GT', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  })
}

export default function AdminDepositsPanel() {
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [actionId, setActionId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingAmount, setEditingAmount] = useState('')

  const loadPendingDeposits = async () => {
    setLoading(true)
    setError(null)
    const result = await transactionService.getPendingDeposits()
    if (result.success) {
      setDeposits(result.data.deposits || [])
    } else {
      setError(result.error || 'No se pudieron cargar los depósitos pendientes')
    }
    setLoading(false)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPendingDeposits()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const handleRevert = async (deposit) => {
    setActionId(deposit.id)
    const result = await transactionService.revertDeposit(deposit.id)
    if (result.success) {
      await loadPendingDeposits()
    }
    setActionId(null)
  }

  const handleStartEdit = (deposit) => {
    setEditingId(deposit.id)
    setEditingAmount(String(deposit.amount ?? ''))
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingAmount('')
  }

  const handleSaveEdit = async (deposit) => {
    const amount = Number(editingAmount)
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setError('El monto debe ser un número mayor a 0')
      return
    }
    setActionId(deposit.id)
    const result = await transactionService.updateDepositAmount(deposit.id, amount)
    if (result.success) {
      handleCancelEdit()
      await loadPendingDeposits()
    } else {
      setError(result.error || 'No se pudo actualizar el depósito')
    }
    setActionId(null)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)]">Depósitos pendientes (Admin)</h2>
          <p className="text-sm text-[var(--muted)]">
            Reversa disponible solo en ventana corta de tiempo según política backend.
          </p>
        </div>
        <button
          type="button"
          onClick={loadPendingDeposits}
          disabled={loading}
          className="rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-[var(--danger)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]"></div>
        </div>
      ) : deposits.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center text-sm text-[var(--muted)]">
          No hay depósitos pendientes para gestión administrativa.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-[var(--gris-claro-fondo)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">ID</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">Cuenta</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">Monto</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">Conversión</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">Fecha</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">Tiempo restante</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-[var(--gris-oscuro)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => {
                const isBusy = actionId === deposit.id
                const isEditing = editingId === deposit.id
                return (
                  <tr key={deposit.id} className="border-b border-[var(--border)] transition hover:bg-[var(--gris-claro-fondo)]">
                    <td className="px-4 py-3 text-sm text-[var(--text)]">{String(deposit.id).slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-sm text-[var(--text)]">{deposit.accountNumber}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[var(--text)]">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={editingAmount}
                          onChange={(event) => setEditingAmount(event.target.value)}
                          className="w-36 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)]"
                        />
                      ) : (
                        formatMoney(deposit.amount, deposit.currencyTo || 'GTQ')
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)]">
                      {deposit.currencyFrom} -&gt; {deposit.currencyTo}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)]">{formatDate(deposit.createdAt)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${deposit.canRevert ? 'bg-[rgba(245,158,11,0.15)] text-[var(--naranja)]' : 'bg-[rgba(239,68,68,0.12)] text-[var(--danger)]'}`}>
                        {deposit.canRevert ? `${deposit.secondsRemaining}s` : 'Expirado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleSaveEdit(deposit)}
                              className="rounded-2xl bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={handleCancelEdit}
                              className="rounded-2xl border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:opacity-90 disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleStartEdit(deposit)}
                              className="rounded-2xl border border-[var(--azul-vibrante)] px-3 py-2 text-xs font-semibold text-[var(--azul-vibrante)] transition hover:opacity-90 disabled:opacity-50"
                            >
                              Editar monto
                            </button>
                            <button
                              type="button"
                              disabled={isBusy || !deposit.canRevert}
                              onClick={() => handleRevert(deposit)}
                              className="rounded-2xl border border-[var(--danger)] px-3 py-2 text-xs font-semibold text-[var(--danger)] transition hover:opacity-90 disabled:opacity-50"
                            >
                              Revertir
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
