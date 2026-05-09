import React, { useState } from 'react'
import useTransactionStore from '../store/useTransactionStore'

export default function DepositForm() {
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    reference: '',
    concept: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createDeposit } = useTransactionStore()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.accountId || !formData.amount) {
      alert('Por favor completa los campos requeridos')
      return
    }

    setIsSubmitting(true)
    const result = await createDeposit(formData)
    setIsSubmitting(false)

    if (result.success) {
      setFormData({
        accountId: '',
        amount: '',
        reference: '',
        concept: ''
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Crear Depósito</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID de Cuenta *
          </label>
          <input
            type="text"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            placeholder="Ingresa el ID de la cuenta"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referencia
          </label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Ej: Transferencia bancaria"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Concepto
          </label>
          <textarea
            name="concept"
            value={formData.concept}
            onChange={handleChange}
            placeholder="Descripción del depósito"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition"
        >
          {isSubmitting ? 'Procesando...' : 'Crear Depósito'}
        </button>
      </form>
    </div>
  )
}
