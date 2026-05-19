const FinancialSummaryCard = ({ title, value, subtitle }) => (
  <div className="financial-summary-card rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <span className="block text-sm font-medium text-slate-500">{title}</span>
    <strong className="mt-4 block text-3xl text-slate-900">{value}</strong>
    <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
  </div>
)

export default FinancialSummaryCard
