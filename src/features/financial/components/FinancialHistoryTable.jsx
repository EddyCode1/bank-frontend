import React from 'react'

const FinancialHistoryTable = ({ items }) => {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
        No hay movimientos en el rango seleccionado.
      </div>
    )
  }

  return (
    <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-4 font-medium">Fecha</th>
            <th className="px-4 py-4 font-medium">Descripción</th>
            <th className="px-4 py-4 font-medium">Tipo</th>
            <th className="px-4 py-4 font-medium">Monto</th>
            <th className="px-4 py-4 font-medium">Moneda</th>
            <th className="px-4 py-4 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-slate-200 even:bg-slate-50">
              <td className="px-4 py-4 text-slate-700">{item.date}</td>
              <td className="px-4 py-4 text-slate-700">{item.description}</td>
              <td className="px-4 py-4 text-slate-700">{item.type}</td>
              <td className={`px-4 py-4 font-semibold ${item.amount < 0 ? 'text-rose-600' : 'text-sky-700'}`}>
                {item.amount < 0 ? '-' : '+'}${Math.abs(item.amount).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-4 text-slate-700">{item.currency}</td>
              <td className="px-4 py-4 text-slate-700">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FinancialHistoryTable
