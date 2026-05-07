/**
 * Logo institucional textual para vistas públicas
 */
const BrandLogo = ({ compact = false }) => {
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'flex-col gap-3 text-center'}`}>
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--ai-gradient-start)] to-[var(--ai-gradient-end)] text-xl font-bold text-white shadow-lg shadow-[rgba(91,92,246,0.25)]">
        VB
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--secondary)]">
          Banca Digital
        </p>
        <h1 className="text-xl font-bold text-[var(--text)]">Visual Banco</h1>
      </div>
    </div>
  )
}

export default BrandLogo
