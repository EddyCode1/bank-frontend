import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useTransactionStore from '../store/useTransactionStore'
import TransactionTable from '../components/TransactionTable'
import DepositForm from '../components/DepositForm'
import TransferForm from '../components/TransferForm'
import TransactionDetail from '../components/TransactionDetail'

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState('my-transactions') // 'my-transactions', 'history', 'deposit', 'transfer'
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [filters, setFilters] = useState({ limit: 50, offset: 0 })
  const navigate = useNavigate()

  const {
    transactions,
    history,
    loading,
    error,
    pagination,
    fetchMyTransactions,
    fetchHistoryMe,
    clearTransactionState
  } = useTransactionStore()

  // Guard para evitar el doble fetch de React 18 StrictMode en desarrollo.
  const fetchedRef = useRef(false)

  useEffect(() => {
    return () => {
      clearTransactionState()
      fetchedRef.current = false
    }
  }, [clearTransactionState])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    if (activeTab === 'my-transactions') {
      fetchMyTransactions(filters)
    } else if (activeTab === 'history') {
      fetchHistoryMe(filters)
    }
    // fetchMyTransactions y fetchHistoryMe son referencias estables de Zustand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filters])

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction._id || transaction.id)
  }

  const handleRefresh = () => {
    if (activeTab === 'my-transactions') {
      fetchMyTransactions(filters)
    } else if (activeTab === 'history') {
      fetchHistoryMe(filters)
    }
  }

  const handlePageChange = (newOffset) => {
    if (newOffset < 0 || (newOffset + filters.limit > pagination.total && pagination.total > 0)) {
      return
    }
    setFilters(prev => ({ ...prev, offset: newOffset }))
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transacciones</h1>
          <p className="text-gray-600 mt-2">Gestiona y visualiza tus transacciones bancarias</p>
        </div>
        <button
          onClick={() => navigate('/loby/favorites')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition flex items-center gap-2"
        >
          <span>⭐</span>
          Ir a Favoritos
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => { setActiveTab('my-transactions'); setFilters({ limit: 50, offset: 0 }); }}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'my-transactions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Mis Transacciones
        </button>
        <button
          onClick={() => { setActiveTab('history'); setFilters({ limit: 50, offset: 0 }); }}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Historial
        </button>
        <button
          onClick={() => setActiveTab('deposit')}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'deposit'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Crear Depósito
        </button>
        <button
          onClick={() => setActiveTab('transfer')}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'transfer'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Realizar Transferencia
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* My Transactions Tab */}
        {activeTab === 'my-transactions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Mis Transacciones</h2>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium transition"
              >
                {loading ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
            <TransactionTable
              transactions={transactions}
              loading={loading}
              onTransactionClick={handleTransactionClick}
            />
            
            {/* Pagination */}
            {pagination.total > filters.limit && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
                  disabled={filters.offset === 0}
                  className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Página {Math.floor(filters.offset / filters.limit) + 1}
                </span>
                <button
                  onClick={() => handlePageChange(filters.offset + filters.limit)}
                  disabled={filters.offset + filters.limit >= pagination.total}
                  className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Historial de Transacciones</h2>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium transition"
              >
                {loading ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Historial de depósitos y transferencias en orden de fecha/hora
            </p>
            <TransactionTable
              transactions={history}
              loading={loading}
              onTransactionClick={handleTransactionClick}
            />

            {/* Pagination */}
            {pagination.total > filters.limit && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
                  disabled={filters.offset === 0}
                  className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Página {Math.floor(filters.offset / filters.limit) + 1}
                </span>
                <button
                  onClick={() => handlePageChange(filters.offset + filters.limit)}
                  disabled={filters.offset + filters.limit >= pagination.total}
                  className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}

        {/* Deposit Tab */}
        {activeTab === 'deposit' && <DepositForm />}

        {/* Transfer Tab */}
        {activeTab === 'transfer' && <TransferForm />}
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
