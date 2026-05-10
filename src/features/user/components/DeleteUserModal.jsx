/**
 * Modal de confirmación para eliminar usuario
 */
export default function DeleteUserModal({ isOpen, onClose, onConfirm, user, isLoading = false }) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="w-full max-w-md rounded-lg shadow-xl p-6"
        style={{ background: 'var(--surface)' }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
          Confirmar eliminación
        </h2>

        <p className="mb-2" style={{ color: 'var(--text)' }}>
          ¿Estás seguro de que deseas eliminar al usuario?
        </p>

        <div className="p-3 rounded-lg mb-6" style={{ background: 'var(--gris-claro-fondo)' }}>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>
            {user.nombre || 'N/A'}
          </p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {user.email || user.correo || 'N/A'}
          </p>
        </div>

        <div
          className="p-3 rounded-lg mb-6"
          style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid var(--danger)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
            Esta acción no se puede deshacer
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition hover:opacity-80"
            style={{
              border: '1px solid var(--gris-medio)',
              color: 'var(--muted)',
              background: 'transparent',
            }}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(user.id || user._id)}
            className="px-4 py-2 rounded-lg font-medium transition hover:opacity-90"
            style={{
              background: 'var(--danger)',
              color: 'white',
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
