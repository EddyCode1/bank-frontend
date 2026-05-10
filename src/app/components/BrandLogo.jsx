import LogoEmblem from './LogoEmblem'

/**
 * Marca institucional en login/registro: emblema + nombre y eslogan.
 */
const BrandLogo = ({ compact = false }) => {
  return (
    <div
      className={`flex flex-col items-center ${compact ? 'gap-4' : 'gap-6'} text-center`}
    >
      <LogoEmblem size={compact ? 'lg' : 'xl'} />

      <div className="space-y-2">
        <h1
          className={`font-serif font-bold tracking-[0.08em] text-[var(--azul-profundo)] ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'}`}
          style={{ fontVariant: 'small-caps' }}
        >
          Banco del Quetzal
        </h1>
        <p
          className={`mx-auto max-w-md font-serif italic leading-relaxed text-[var(--muted)] ${compact ? 'text-xs' : 'text-sm sm:text-base'}`}
        >
          Tu bienestar es nuestro trabajo
        </p>
      </div>
    </div>
  )
}

export default BrandLogo
