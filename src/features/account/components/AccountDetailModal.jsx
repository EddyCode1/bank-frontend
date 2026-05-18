export default function AccountDetailModal({
  isOpen,
  onClose,
  account,
  isAdmin = false,
  onEdit,
  onStatusChange,
  transactions = [],
  transactionsLoading = false,
  error = null,
}) {
  if (!isOpen || !account) return null

  const handleToggleStatus = () => {
    const nextStatus = account.status === 'active' ? 'inactive' : 'active'
    onStatusChange(account, nextStatus)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-4xl overflow-y-auto rounded-3xl bg-[var(--surface)] shadow-2xl">
        <div className="sticky top-0 flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">Detalle de cuenta</h2>
            <p className="text-sm text-[var(--muted)]">{account.accountNumber || 'Sin número de cuenta'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={handleToggleStatus}
                className="rounded-2xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                style={{ borderColor: account.status === 'active' ? 'var(--success)' : 'var(--danger)', color: account.status === 'active' ? 'var(--success)' : 'var(--danger)' }}
              >
                {account.status === 'active' ? 'Desactivar' : 'Activar'}
              </button>
            )}
            <button
              type="button"
              onClick={() => onEdit(account)}
              className="rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:opacity-90"
              style={{ borderColor: 'var(--border)' }}
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5">
              <h3 className="mb-4 text-lg font-semibold text-[var(--text)]">Información general</h3>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-[var(--muted)]">Número</dt>
                  <dd className="mt-1 text-sm font-semibold text-[var(--text)]">{account.accountNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted)]">Tipo</dt>
                  <dd className="mt-1 text-sm font-semibold text-[var(--text)]">{account.type}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted)]">Moneda</dt>
                  <dd className="mt-1 text-sm font-semibold text-[var(--text)]">{account.currency}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted)]">Estado</dt>
                  <dd className="mt-1 text-sm font-semibold text-[var(--text)]">{account.status}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted)]">Saldo</dt>
                  <dd className="mt-1 text-sm font-semibold text-[var(--text)]">{Number(account.balance).toLocaleString('es-GT', { style: 'currency', currency: account.currency || 'GTQ' })}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted)]">Cliente</dt>
                  <dd className="mt-1 text-sm font-semibold text-[var(--text)]">{account.ownerName || 'No asignado'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted)]">Límite diario</dt>
                  <dd className="mt-1 text-sm font-semibold text-[var(--text)]">{account.dailyLimit ?? 0}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--muted)]">Límite mensual</dt>
                  <dd className="mt-1 text-sm font-semibold text-[var(--text)]">{account.monthlyLimit ?? 0}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5">
              <h3 className="mb-4 text-lg font-semibold text-[var(--text)]">Movimientos recientes</h3>
              {transactionsLoading ? (
                <p className="text-sm text-[var(--muted)]">Cargando movimientos...</p>
              ) : error ? (
                <p className="text-sm text-[var(--danger)]">{error}</p>
              ) : transactions.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No hay movimientos disponibles para esta cuenta.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id || tx._id || tx.transactionId} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[var(--text)]">{tx.description || tx.concept || 'Movimiento'}</p>
                        <span className="text-sm text-[var(--muted)]">
                          {new Date(tx.createdAt || tx.date || tx.timestamp).toLocaleDateString('es-GT')}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                        <p className="text-[var(--muted)]">{tx.type || tx.transactionType || tx.transaction_type || '—'}</p>
                        <p className={"font-semibold " + ((Number(tx.amount ?? tx.transaction_amount ?? tx.value ?? 0)) >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]')}>
                          {(Number(tx.amount ?? tx.transaction_amount ?? tx.value ?? 0)).toLocaleString('es-GT', {
                            style: 'currency',
                            currency: tx.currency || tx.currency_to || tx.currency_from || account.currency || 'GTQ',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5">
              <h3 className="mb-4 text-lg font-semibold text-[var(--text)]">Resumen de la cuenta</h3>
              <div className="space-y-3 text-sm">
                <p className="text-[var(--muted)]">Creada el:</p>
                <p className="font-semibold text-[var(--text)]">{account.createdAt ? new Date(account.createdAt).toLocaleString('es-GT') : 'No disponible'}</p>
                <p className="text-[var(--muted)]">ID interno:</p>
                <p className="break-all font-semibold text-[var(--text)]">{account.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
