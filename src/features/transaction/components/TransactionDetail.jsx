import { useEffect } from 'react'
import useTransactionStore from '../store/useTransactionStore'

export default function TransactionDetail({ transactionId, onClose }) {
  const { currentTransaction, loading, fetchTransactionById } = useTransactionStore()

  useEffect(() => {
    if (transactionId) {
      fetchTransactionById(transactionId)
    }
  }, [transactionId, fetchTransactionById])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentTransaction) {
    return null
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
      return new Date(date).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return 'Fecha inválida'
    }
  }

  const formatCurrency = (amount, currency = 'GTQ') => {
    if (typeof amount !== 'number') return 'Q0.00'
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const tx = currentTransaction.data || currentTransaction
  const transactionId_display = tx._id || tx.id || 'N/A'
  const transactionType = tx.type || tx.transactionType || tx.transaction_type || 'Desconocido'
  const transactionAmount = Number(tx.amount ?? tx.transaction_amount ?? 0)
  const transactionCurrency = tx.currency || tx.currency_to || tx.currency_from || tx.account_id?.currency || 'GTQ'
  const transactionStatus = tx.status || 'completada'
  const amountDebited = Number(tx.amount_debited ?? tx.debit_amount ?? tx.amount ?? tx.transaction_amount ?? 0)
  const amountCredited = Number(tx.amount_credited ?? tx.credit_amount ?? tx.amount ?? tx.transaction_amount ?? 0)
  const fromCurrency = tx.currency_from || tx.from_currency || transactionCurrency
  const toCurrency = tx.currency_to || tx.to_currency || transactionCurrency
  const exchangeRate = tx.exchange_rate
  const conversionNote = tx.conversion_note

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--text)]">Detalles de Transacción</h2>
          <button
            onClick={onClose}
            className="text-2xl text-[var(--muted)] transition hover:opacity-70"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4">
            <p className="text-sm text-[var(--muted)]">ID Transacción</p>
            <p className="break-all text-sm font-semibold text-[var(--text)]">{transactionId_display}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-[var(--muted)]">Tipo</p>
              <p className="font-semibold capitalize text-[var(--text)]">{transactionType}</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-[var(--muted)]">Estado</p>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  transactionStatus.toLowerCase() === 'completed' || transactionStatus.toLowerCase() === 'completada'
                    ? 'bg-[rgba(31,161,135,0.12)] text-[var(--success)]'
                    : transactionStatus.toLowerCase() === 'pending'
                    ? 'bg-[rgba(245,158,11,0.15)] text-[var(--naranja)]'
                    : 'bg-[rgba(239,68,68,0.12)] text-[var(--danger)]'
                }`}
              >
                {transactionStatus}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-sm text-[var(--muted)]">Monto principal</p>
            <p className="text-lg font-semibold" style={{ color: transactionAmount >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {formatCurrency(transactionAmount, transactionCurrency)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-sm text-[var(--muted)]">Fecha</p>
            <p className="font-semibold text-[var(--text)]">{formatDate(tx.createdAt || tx.date)}</p>
          </div>

          {(fromCurrency || toCurrency || exchangeRate || conversionNote) && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--gris-claro-fondo)] p-4">
              <p className="mb-3 text-sm font-semibold text-[var(--text)]">Información de conversión</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[var(--muted)]">Monto debitado</p>
                  <p className="font-semibold text-[var(--text)]">{formatCurrency(amountDebited, fromCurrency || 'GTQ')}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Monto acreditado</p>
                  <p className="font-semibold text-[var(--text)]">{formatCurrency(amountCredited, toCurrency || 'GTQ')}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Moneda origen</p>
                  <p className="font-semibold text-[var(--text)]">{fromCurrency || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Moneda destino</p>
                  <p className="font-semibold text-[var(--text)]">{toCurrency || 'N/A'}</p>
                </div>
                {exchangeRate && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[var(--muted)]">Tasa usada</p>
                    <p className="font-semibold text-[var(--text)]">{exchangeRate}</p>
                  </div>
                )}
                {conversionNote && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[var(--muted)]">Nota de conversión</p>
                    <p className="font-semibold text-[var(--text)]">{conversionNote}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tx.reference && (
            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-[var(--muted)]">Referencia</p>
              <p className="font-semibold text-[var(--text)]">{tx.reference}</p>
            </div>
          )}

          {tx.concept && (
            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-[var(--muted)]">Concepto</p>
              <p className="font-semibold text-[var(--text)]">{tx.concept}</p>
            </div>
          )}

          {tx.description && (
            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-[var(--muted)]">Descripción</p>
              <p className="font-semibold text-[var(--text)]">{tx.description}</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
