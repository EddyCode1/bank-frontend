import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useTransactionStore from '../store/useTransactionStore'
import useAuthStore from '../../auth/store/useAuthStore'
import TransactionTable from '../components/TransactionTable'
import DepositForm from '../components/DepositForm'
import TransferForm from '../components/TransferForm'
import TransactionDetail from '../components/TransactionDetail'
import AdminDepositsPanel from '../components/AdminDepositsPanel'
import { isAdminUser } from '../../../shared/auth/roles'

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState('my-transactions') // 'my-transactions', 'history', 'deposit', 'transfer'
  const [lastListTab, setLastListTab] = useState('my-transactions')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transferDestination, setTransferDestination] = useState('')
  const [filters, setFilters] = useState({
    limit: 20,
    offset: 0,
    type: '',
    user_id: '',
    from_date: '',
    to_date: '',
    transactionId: '',
    accountId: ''
  })
  const [searchParams] = useSearchParams()
  const [filterDraft, setFilterDraft] = useState({
    type: '',
    user_id: '',
    from_date: '',
    to_date: '',
    transactionId: '',
    accountId: ''
  })
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const isAdmin = isAdminUser(user)

  useEffect(() => {
    const targetTab = searchParams.get('tab')
    const destination = searchParams.get('dest')?.trim()
    const timer = setTimeout(() => {
      if (targetTab === 'transfer') {
        setActiveTab('transfer')
      }
      if (destination) {
        setTransferDestination(destination)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [searchParams])

  const {
    transactions,
    history,
    loading,
    error,
    pagination,
    fetchMyTransactions,
    fetchAllTransactions,
    fetchHistoryMe,
    fetchHistoryByAccountId,
    clearTransactionState
  } = useTransactionStore()

  useEffect(() => {
    return () => {
      clearTransactionState()
    }
  }, [clearTransactionState])

  const apiFilters = useMemo(() => ({
    limit: filters.limit,
    offset: filters.offset,
    type: filters.type || undefined,
    user_id: filters.user_id || undefined,
    from_date: filters.from_date || undefined,
    to_date: filters.to_date || undefined
  }), [filters])

  useEffect(() => {
    if (activeTab === 'my-transactions') {
      if (isAdmin) {
        fetchAllTransactions(apiFilters)
      } else {
        fetchMyTransactions(apiFilters)
      }
    } else if (activeTab === 'history') {
      if (isAdmin) {
        if (filters.accountId?.trim()) {
          fetchHistoryByAccountId(filters.accountId.trim(), apiFilters)
        } else {
          fetchAllTransactions(apiFilters)
        }
      } else {
        fetchHistoryMe(apiFilters)
      }
    }
  }, [activeTab, apiFilters, isAdmin, fetchAllTransactions, fetchHistoryByAccountId, fetchHistoryMe, fetchMyTransactions, filters.accountId])

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction._id || transaction.id)
  }

  const handleRefresh = () => {
    if (activeTab === 'my-transactions') {
      if (isAdmin) {
        fetchAllTransactions(apiFilters)
      } else {
        fetchMyTransactions(apiFilters)
      }
    } else if (activeTab === 'history') {
      if (isAdmin) {
        if (filters.accountId?.trim()) {
          fetchHistoryByAccountId(filters.accountId.trim(), apiFilters)
        } else {
          fetchAllTransactions(apiFilters)
        }
      } else {
        fetchHistoryMe(apiFilters)
      }
    }
  }

  const handleOperationSuccess = () => {
    const targetTab = lastListTab === 'history' ? 'history' : 'my-transactions'
    setFilters((prev) => ({ ...prev, offset: 0 }))
    setActiveTab(targetTab)
  }

  const handlePageChange = (newOffset) => {
    if (newOffset < 0 || (newOffset + filters.limit > pagination.total && pagination.total > 0)) {
      return
    }
    setFilters(prev => ({ ...prev, offset: newOffset }))
  }

  const handleApplyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      ...filterDraft,
      offset: 0
    }))
  }

  const handleClearFilters = () => {
    const clean = {
      type: '',
      user_id: '',
      from_date: '',
      to_date: '',
      transactionId: '',
      accountId: ''
    }
    setFilterDraft(clean)
    setFilters((prev) => ({
      ...prev,
      ...clean,
      offset: 0
    }))
  }

  const rawRows = activeTab === 'history'
    ? (isAdmin && !filters.accountId?.trim() ? transactions : history)
    : transactions
  const rows = filters.transactionId?.trim()
    ? rawRows.filter((tx) => String(tx.id || tx._id || '').toLowerCase().includes(filters.transactionId.trim().toLowerCase()))
    : rawRows

  const showPagination = !filters.transactionId?.trim() && pagination.total > filters.limit

  return (
    <div className="p-6" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Transacciones</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Gestión de movimientos, historial, depósitos y transferencias.</p>
        </div>
        <button
          onClick={() => navigate('/loby/favorites')}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--naranja)] px-4 py-2 text-sm font-semibold text-[var(--naranja)] transition hover:opacity-90"
        >
          <span>⭐</span>
          Ir a Favoritos
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-2xl border border-[var(--danger)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2">
        <button
          onClick={() => {
            setLastListTab('my-transactions')
            setActiveTab('my-transactions')
            setFilters((prev) => ({ ...prev, offset: 0 }))
          }}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'my-transactions' ? 'text-white' : 'text-[var(--text)]'}`}
          style={{ background: activeTab === 'my-transactions' ? 'var(--primary)' : 'transparent' }}
        >
          {isAdmin ? 'Transacciones del Sistema' : 'Mis Transacciones'}
        </button>
        <button
          onClick={() => {
            setLastListTab('history')
            setActiveTab('history')
            setFilters((prev) => ({ ...prev, offset: 0 }))
          }}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'history' ? 'text-white' : 'text-[var(--text)]'}`}
          style={{ background: activeTab === 'history' ? 'var(--primary)' : 'transparent' }}
        >
          Historial
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('deposit')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'deposit' ? 'text-white' : 'text-[var(--text)]'}`}
            style={{ background: activeTab === 'deposit' ? 'var(--primary)' : 'transparent' }}
          >
            Crear Depósito
          </button>
        )}
        <button
          onClick={() => setActiveTab('transfer')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'transfer' ? 'text-white' : 'text-[var(--text)]'}`}
          style={{ background: activeTab === 'transfer' ? 'var(--primary)' : 'transparent' }}
        >
          Realizar Transferencia
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin-deposits')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'admin-deposits' ? 'text-white' : 'text-[var(--text)]'}`}
            style={{ background: activeTab === 'admin-deposits' ? 'var(--primary)' : 'transparent' }}
          >
            Depósitos Admin
          </button>
        )}
      </div>

      {(activeTab === 'my-transactions' || activeTab === 'history') && isAdmin && (
        <div className="mb-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input
              type="text"
              value={filterDraft.transactionId}
              onChange={(event) => setFilterDraft((prev) => ({ ...prev, transactionId: event.target.value }))}
              placeholder="Filtrar por ID de transacción"
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
            />
            <input
              type="text"
              value={filterDraft.user_id}
              onChange={(event) => setFilterDraft((prev) => ({ ...prev, user_id: event.target.value }))}
              placeholder="Filtrar por user_id"
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
            />
            {activeTab === 'history' && (
              <input
                type="text"
                value={filterDraft.accountId}
                onChange={(event) => setFilterDraft((prev) => ({ ...prev, accountId: event.target.value }))}
                placeholder="Historial por ID de cuenta"
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
              />
            )}
            <select
              value={filterDraft.type}
              onChange={(event) => setFilterDraft((prev) => ({ ...prev, type: event.target.value }))}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
            >
              <option value="">Todos los tipos</option>
              <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              <option value="DEPOSITO">DEPOSITO</option>
              <option value="CREDITO">CREDITO</option>
              <option value="DEBITO">DEBITO</option>
            </select>
            <input
              type="date"
              value={filterDraft.from_date}
              onChange={(event) => setFilterDraft((prev) => ({ ...prev, from_date: event.target.value }))}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
            />
            <input
              type="date"
              value={filterDraft.to_date}
              onChange={(event) => setFilterDraft((prev) => ({ ...prev, to_date: event.target.value }))}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)]"
            />
            <button
              type="button"
              onClick={handleApplyFilters}
              className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Aplicar filtros
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:opacity-90"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {/* My Transactions Tab */}
        {activeTab === 'my-transactions' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--text)]">{isAdmin ? 'Transacciones del Sistema' : 'Mis Transacciones'}</h2>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
            <TransactionTable
              transactions={rows}
              loading={loading}
              onTransactionClick={handleTransactionClick}
            />
            
            {/* Pagination */}
            {showPagination && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
                  disabled={filters.offset === 0}
                  className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] transition hover:opacity-90 disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-[var(--muted)]">
                  Página {Math.floor(filters.offset / filters.limit) + 1}
                </span>
                <button
                  onClick={() => handlePageChange(filters.offset + filters.limit)}
                  disabled={filters.offset + filters.limit >= pagination.total}
                  className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] transition hover:opacity-90 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--text)]">Historial de Transacciones</h2>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
            <p className="mb-4 text-sm text-[var(--muted)]">
              {isAdmin
                ? (filters.accountId ? 'Historial filtrado por cuenta específica.' : 'Historial general del sistema. Puedes filtrar por cuenta para detalle puntual.')
                : 'Historial de depósitos y transferencias en orden de fecha/hora'}
            </p>
            <TransactionTable
              transactions={rows}
              loading={loading}
              onTransactionClick={handleTransactionClick}
              emptyMessage="No hay movimientos para los filtros seleccionados"
            />

            {/* Pagination */}
            {showPagination && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
                  disabled={filters.offset === 0}
                  className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] transition hover:opacity-90 disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-[var(--muted)]">
                  Página {Math.floor(filters.offset / filters.limit) + 1}
                </span>
                <button
                  onClick={() => handlePageChange(filters.offset + filters.limit)}
                  disabled={filters.offset + filters.limit >= pagination.total}
                  className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] transition hover:opacity-90 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}

        {/* Deposit Tab — solo visible para admin (ventanilla) */}
        {activeTab === 'deposit' && isAdmin && <DepositForm onSuccess={handleOperationSuccess} />}

        {/* Transfer Tab */}
        {activeTab === 'transfer' && (
          <TransferForm
            onSuccess={handleOperationSuccess}
            initialDestinationAccountId={transferDestination}
          />
        )}

        {/* Admin Deposits Tab */}
        {activeTab === 'admin-deposits' && isAdmin && <AdminDepositsPanel />}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetail
          transactionId={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  )
}
