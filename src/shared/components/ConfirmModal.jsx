import React from 'react'

export default function ConfirmModal({
  isOpen,
  title = 'Confirmar',
  message = '¿Estás seguro?',
  onCancel = () => {},
  onConfirm = () => {},
  cancelLabel = 'Cancelar',
  confirmLabel = 'Confirmar',
  danger = true,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--surface)] shadow-2xl">
        <div className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-[var(--muted)]">{message}</p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border px-4 py-2 text-sm font-semibold"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-2xl px-4 py-2 text-sm font-semibold text-white"
              style={{ background: danger ? 'var(--danger)' : 'var(--primary)' }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
