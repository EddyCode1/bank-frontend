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
    if (!date) return 'N/A'
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return 'Fecha inválida'
    }
  }

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'Q0.00'
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
          {transactions.map((transaction) => {
            const txId = transaction._id || transaction.id
            const txType = transaction.type || transaction.transactionType || 'N/A'
            const txAmount = transaction.amount || 0
            const txStatus = transaction.status || 'completed'
            const txDate = transaction.createdAt || transaction.date
            
            return (
              <tr
                key={txId}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-3 text-sm">
                  {String(txId).substring(0, 8)}...
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {txType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold">
                  <span className={txAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(txAmount)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatDate(txDate)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${
                      txStatus.toLowerCase() === 'completed' || txStatus.toLowerCase() === 'completada'
                        ? 'bg-green-100 text-green-800'
                        : txStatus.toLowerCase() === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {txStatus}
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
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
