import React from 'react'
import { Link } from 'react-router-dom'

const items = [
  { id: 1, label: 'Cuenta', path: '/loby/account' },
  { id: 2, label: 'Favoritos', path: '/loby/favorites' },
  { id: 3, label: 'Productos', path: '/loby/products' },
  { id: 4, label: 'Servicios', path: '/loby/services' },
  { id: 5, label: 'Transacciones', path: '/loby/transactions' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <main className="w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Banco</h1>

        <p className="text-center text-gray-600 mb-6">Selecciona una sección para continuar.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((it) => (
            <Link
              key={it.id}
              to={it.path}
              className="block w-full text-center py-3 border rounded-lg bg-white hover:bg-gray-50 text-gray-900 shadow-sm"
            >
              {it.label}
            </Link>
          ))}
        </div>

      </main>
    </div>
  )
}