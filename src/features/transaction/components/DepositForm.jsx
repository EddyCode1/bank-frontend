import { useState } from 'react'
import toast from 'react-hot-toast'
import useTransactionStore from '../store/useTransactionStore'

export default function DepositForm() {
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    currency: 'GTQ',
    reference: '',
    concept: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createDeposit } = useTransactionStore()

  const validateForm = () => {
    const newErrors = {}

    // Validar accountId
    if (!formData.accountId || formData.accountId.trim() === '') {
      newErrors.accountId = 'El número de cuenta es requerido'
    } else if (!/^[a-zA-Z0-9-]{3,}$/.test(formData.accountId.trim())) {
      newErrors.accountId = 'Formato de cuenta inválido'
    }

    // Validar amount
    if (!formData.amount || formData.amount === '') {
      newErrors.amount = 'El monto es requerido'
    } else {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount)) {
        newErrors.amount = 'El monto debe ser un número válido'
      } else if (amount <= 0) {
        newErrors.amount = 'El monto debe ser mayor a 0'
      } else if (amount > 999999999) {
        newErrors.amount = 'El monto excede el límite máximo permitido'
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.amount)) {
        newErrors.amount = 'El monto debe tener máximo 2 decimales'
      }
    }

    if (!formData.currency || !['GTQ', 'USD'].includes(formData.currency)) {
      newErrors.currency = 'Selecciona una moneda válida (GTQ o USD)'
    }

    // Validar referencia (opcional pero si se proporciona debe ser válida)
    if (formData.reference && formData.reference.length > 100) {
      newErrors.reference = 'La referencia no puede exceder 100 caracteres'
    }

    // Validar concepto (opcional pero si se proporciona debe ser válida)
    if (formData.concept && formData.concept.length > 500) {
      newErrors.concept = 'El concepto no puede exceder 500 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor completa correctamente todos los campos requeridos')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createDeposit({
        accountId: formData.accountId.trim(),
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        reference: formData.reference.trim() || undefined,
        concept: formData.concept.trim() || undefined
      })

      if (result.success) {
        setFormData({
          accountId: '',
          amount: '',
          currency: 'GTQ',
          reference: '',
          concept: ''
        })
        setErrors({})
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error inesperado al procesar el depósito')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Crear Depósito</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account ID Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de cuenta *
          </label>
          <input
            type="text"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            placeholder="Ej: número de cuenta en el banco"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.accountId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.accountId && (
            <p className="mt-1 text-sm text-red-600">{errors.accountId}</p>
          )}
        </div>

        {/* Currency Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Moneda *
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.currency
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="GTQ">GTQ — Quetzales</option>
            <option value="USD">USD — Dólares</option>
          </select>
          {errors.currency && (
            <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
          )}
        </div>

        {/* Amount Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto ({formData.currency}) *
          </label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.amount
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Máximo 2 decimales</p>
        </div>

        {/* Reference Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referencia (Opcional)
          </label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Ej: Transferencia bancaria"
            maxLength="100"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.reference
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.reference && (
            <p className="mt-1 text-sm text-red-600">{errors.reference}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">{formData.reference.length}/100</p>
        </div>

        {/* Concept Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Concepto (Opcional)
          </label>
          <textarea
            name="concept"
            value={formData.concept}
            onChange={handleChange}
            placeholder="Descripción del depósito"
            rows="3"
            maxLength="500"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.concept
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.concept && (
            <p className="mt-1 text-sm text-red-600">{errors.concept}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">{formData.concept.length}/500</p>
        </div>

        {/* Submit Button */}
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
