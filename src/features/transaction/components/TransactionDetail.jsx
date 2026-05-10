import React, { useEffect } from 'react'
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentTransaction) {
    return null
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const tx = currentTransaction.data || currentTransaction

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detalles de Transacción</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">ID Transacción</p>
            <p className="font-semibold break-all text-sm">{tx._id || tx.id}</p>
          </div>

          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Tipo</p>
            <p className="font-semibold">{tx.type || tx.transactionType || 'N/A'}</p>
          </div>

          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Monto</p>
            <p className={`font-semibold text-lg ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(tx.amount || 0)}
            </p>
          </div>

          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Estado</p>
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                (tx.status || 'completed').toLowerCase() === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {tx.status || 'Completada'}
            </span>
          </div>

          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Fecha</p>
            <p className="font-semibold">{formatDate(tx.createdAt || tx.date || new Date())}</p>
          </div>

          {tx.reference && (
            <div className="border-b pb-2">
              <p className="text-sm text-gray-600">Referencia</p>
              <p className="font-semibold">{tx.reference}</p>
            </div>
          )}

          {tx.concept && (
            <div className="border-b pb-2">
              <p className="text-sm text-gray-600">Concepto</p>
              <p className="font-semibold">{tx.concept}</p>
            </div>
          )}

          {tx.accountId && (
            <div className="border-b pb-2">
              <p className="text-sm text-gray-600">ID Cuenta</p>
              <p className="font-semibold break-all text-sm">{tx.accountId}</p>
            </div>
          )}

          {tx.description && (
            <div className="pb-2">
              <p className="text-sm text-gray-600">Descripción</p>
              <p className="font-semibold">{tx.description}</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
