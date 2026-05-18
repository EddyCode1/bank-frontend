import React from 'react'

const FinancialFilters = ({ filters, onChange }) => (
  <div className="financial-filters grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <div>
      <label className="block text-sm font-medium text-slate-700">Fecha inicio</label>
      <input
        type="date"
        value={filters.startDate}
        onChange={(event) => onChange({ ...filters, startDate: event.target.value })}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700">Fecha fin</label>
      <input
        type="date"
        value={filters.endDate}
        onChange={(event) => onChange({ ...filters, endDate: event.target.value })}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700">Tipo de transacción</label>
      <select
        value={filters.type}
        onChange={(event) => onChange({ ...filters, type: event.target.value })}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
      >
        {filters.types.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700">Moneda</label>
      <select
        value={filters.currency}
        onChange={(event) => onChange({ ...filters, currency: event.target.value })}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
      >
        {filters.currencies.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700">Estado</label>
      <select
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value })}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
      >
        {filters.statuses.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
    <div className="xl:col-span-4">
      <label className="block text-sm font-medium text-slate-700">Buscar</label>
      <input
        type="text"
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        placeholder="Buscar por descripción, categoría o servicio"
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
      />
    </div>
  </div>
)

export default FinancialFilters
