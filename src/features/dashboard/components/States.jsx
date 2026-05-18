import React from 'react';

export function EmptyState({ message = 'No hay datos para mostrar', icon = '📭', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 text-center text-[var(--muted)] ${className}`}>
      <span className="text-4xl mb-2">{icon}</span>
      <span className="text-base">{message}</span>
    </div>
  );
}

export function ErrorState({ message = 'Ocurrió un error', icon = '⚠️', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 text-center text-red-500 ${className}`}>
      <span className="text-4xl mb-2">{icon}</span>
      <span className="text-base">{message}</span>
    </div>
  );
}
