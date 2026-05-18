export default function SummaryCard({ title, value, icon, loading, error, empty, accent = '#5B5CF6', onClick, tooltip }) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:shadow-md cursor-pointer select-none ${loading ? 'animate-pulse' : ''}`}
      style={{ borderColor: accent, minHeight: 120 }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={title}
      title={tooltip || title}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: accent + '22', color: accent }}>
          {icon}
        </span>
        <span className="text-lg font-semibold text-[var(--text)]">{title}</span>
      </div>
      <div className="mt-4 text-2xl font-bold text-[var(--primary)]">
        {loading ? '...' : error ? (
          <span className="text-red-500 text-base">{error}</span>
        ) : empty ? (
          <span className="text-[var(--muted)] text-base">Sin datos</span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
