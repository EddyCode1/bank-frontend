// Logo principal a color (mejor contraste en navbar que el medallón sobre fondo blanco)
import logoPrincipal from '../../assets/logo-principal-quetzal.png'

/**
 * Emblema del Banco del Quetzal - Logo circular perfecto
 */
const sizeClass = {
  sm: 'h-11 w-11',
  md: 'h-16 w-16',
  lg: 'h-20 w-20',
  xl: 'h-36 w-36 sm:h-40 sm:w-40',
}

export default function LogoEmblem({ size = 'md', className = '' }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center ${sizeClass[size]} ${className}`}
      style={{
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(47, 127, 191, 0.12)',
        aspectRatio: '1',
        position: 'relative',
        // Evita que mixBlendMode de la imagen afecte al texto del navbar u otros hermanos
        isolation: 'isolate',
        zIndex: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8%',
          background: 'radial-gradient(circle, #ffffff 0%, #f5f5f5 100%)',
        }}
      >
        <img
          src={logoPrincipal}
          alt="Banco del Quetzal"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            mixBlendMode: 'normal',
            filter: 'none',
            transform: 'scale(1.02)',
          }}
          loading="eager"
        />
      </div>
    </div>
  )
}
