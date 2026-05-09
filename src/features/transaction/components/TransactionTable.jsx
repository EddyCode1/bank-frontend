import React from 'react'

export default function TransactionTable({ transactions, loading, onTransactionClick }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay transacciones disponibles
      </div>
    )
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Monto</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction._id || transaction.id}
              className="border-b hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-4 py-3 text-sm">
                {(transaction._id || transaction.id)?.substring(0, 8)}...
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {transaction.type || transaction.transactionType || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-semibold">
                <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(transaction.amount || 0)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                {formatDate(transaction.createdAt || transaction.date || new Date())}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    (transaction.status || 'completed').toLowerCase() === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {transaction.status || 'Completada'}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onTransactionClick?.(transaction)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
