export default function ProductList({ products, isAdmin, onEdit, onDelete, onRequest, requestingId }) {
  
  // Badge de categoría (Producto/Servicio)
  const getTypeBadge = (type) => {
    return type === 'PRODUCTO'
      ? { backgroundColor: '#E0E7FF', color: '#2C4A7A' } // Azul Institucional
      : { backgroundColor: '#DCF3EE', color: '#1FA187' } // Verde Jade
  }

  // Badge de estado (Activo/Inactivo)
  const getStatusBadge = (is_active) => {
    return is_active
      ? { backgroundColor: '#DCF3EE', color: '#1FA187' } // Éxito (Jade)
      : { backgroundColor: '#FFE4E6', color: '#E11D48' } // Error (Rojo)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border"
          style={{ borderColor: '#E2E8F0' }}
        >
          {/* SECCIÓN SUPERIOR: Títulos y Badges */}
          <div className="p-5 border-b" style={{ borderColor: '#F1F5F9' }}>
            <div className="flex justify-between items-start gap-2 mb-3">
              <h3 className="text-lg font-bold flex-1 leading-tight" style={{ color: '#1F2A44' }}>
                {product.name}
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-black rounded-full" 
                    style={{ ...getStatusBadge(product.is_active) }}>
                {product.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <span className="inline-block px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider" 
                  style={{ ...getTypeBadge(product.type) }}>
              {product.type}
            </span>
          </div>

          {/* SECCIÓN CENTRAL: Información */}
          <div className="p-5">
            {product.description && (
              <p className="text-sm mb-5 line-clamp-2" style={{ color: '#64748B' }}>
                {product.description}
              </p>
            )}

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94A3B8' }}>
                  Precio:
                </span>
                <span className="font-black text-xl" style={{ color: '#2C4A7A' }}>
                  Q{Number(product.price).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] pt-2" style={{ color: '#94A3B8' }}>
                <span className="font-medium">REFERENCIA ID:</span>
                <span className="font-mono bg-gray-50 px-2 py-0.5 rounded">{product._id?.substring(0, 8).toUpperCase()}</span>
              </div>
            </div>

            {/* Fecha de registro */}
            <div className="mt-5 pt-4 text-[11px] border-t flex justify-between" style={{ borderColor: '#F1F5F9', color: '#94A3B8' }}>
              <span className="font-bold uppercase">Registrado:</span>
              <span>{new Date(product.createdAt).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* ACCIONES */}
          {isAdmin ? (
            <div className="p-4 flex gap-3" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
              <button
                onClick={() => onEdit(product)}
                className="flex-1 px-3 py-2 rounded-xl transition-all text-sm font-bold border hover:bg-white active:scale-95"
                style={{ color: '#2F7FBF', borderColor: '#2F7FBF' }}
              >
                Modificar
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="flex-1 px-3 py-2 rounded-xl transition-all text-sm font-bold text-white hover:opacity-90 active:scale-95"
                style={{ backgroundColor: '#EF4444' }}
              >
                Eliminar
              </button>
            </div>
          ) : (
            <div className="p-4" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
              <button
                onClick={() => onRequest?.(product)}
                disabled={!onRequest || requestingId === product._id}
                className="w-full px-3 py-2 rounded-xl transition-all text-sm font-bold text-white active:scale-95 disabled:opacity-60"
                style={{ backgroundColor: '#2C4A7A' }}
              >
                {requestingId === product._id ? 'Enviando solicitud...' : 'Solicitar producto'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}