export default function TransactionTable({
  transactions,
  loading,
  onTransactionClick,
  emptyMessage = 'No hay transacciones disponibles'
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]"></div>
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center text-sm text-[var(--muted)]">
        {emptyMessage}
      </div>
    )
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
      return new Date(date).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
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

  return (
    <div className="overflow-x-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="min-w-full border-separate border-spacing-0 text-left">
        <thead className="bg-[var(--gris-claro-fondo)] border-b border-[var(--border)]">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">ID</th>
            <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">Tipo</th>
            <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">Monto</th>
            <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">Fecha</th>
            <th className="px-4 py-3 text-sm font-semibold text-[var(--gris-oscuro)]">Estado</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-[var(--gris-oscuro)]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const txId = transaction._id || transaction.id
            const txType = transaction.type || transaction.transactionType || transaction.transaction_type || 'N/A'
            const txAmount = Number(transaction.amount ?? transaction.transaction_amount ?? 0)
            const txCurrency = transaction.currency || transaction.currency_to || transaction.currency_from || transaction.account_id?.currency || 'GTQ'
            const txStatus = transaction.status || 'completed'
            const txDate = transaction.createdAt || transaction.date
            
            return (
              <tr
                key={txId}
                className="border-b border-[var(--border)] transition hover:bg-[var(--gris-claro-fondo)]"
              >
                <td className="px-4 py-3 text-sm text-[var(--text)]">
                  {String(txId).substring(0, 8)}...
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center rounded-full bg-[rgba(47,127,191,0.12)] px-3 py-1 text-xs font-semibold text-[var(--azul-vibrante)] capitalize">
                    {txType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold">
                  <span style={{ color: txAmount >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {formatCurrency(txAmount, txCurrency)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--muted)]">
                  {formatDate(txDate)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      txStatus.toLowerCase() === 'completed' || txStatus.toLowerCase() === 'completada'
                        ? 'bg-[rgba(31,161,135,0.12)] text-[var(--success)]'
                        : txStatus.toLowerCase() === 'pending'
                        ? 'bg-[rgba(245,158,11,0.15)] text-[var(--naranja)]'
                        : 'bg-[rgba(239,68,68,0.12)] text-[var(--danger)]'
                    }`}
                  >
                    {txStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onTransactionClick?.(transaction)}
                    className="rounded-2xl border border-[var(--azul-vibrante)] px-3 py-2 text-sm font-semibold text-[var(--azul-vibrante)] transition hover:opacity-90"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
