import { useState } from 'react'
import toast from 'react-hot-toast'
import useTransactionStore from '../store/useTransactionStore'

export default function TransferForm() {
  const [formData, setFormData] = useState({
    sourceAccountId: '',
    destinationAccountId: '',
    amount: '',
    reference: '',
    concept: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createTransfer } = useTransactionStore()

  const validateForm = () => {
    const newErrors = {}

    // Validar cuenta origen
    if (!formData.sourceAccountId || formData.sourceAccountId.trim() === '') {
      newErrors.sourceAccountId = 'La cuenta origen es requerida'
    } else if (!/^[a-zA-Z0-9-]{3,}$/.test(formData.sourceAccountId.trim())) {
      newErrors.sourceAccountId = 'Formato de cuenta origen inválido'
    }

    // Validar cuenta destino
    if (!formData.destinationAccountId || formData.destinationAccountId.trim() === '') {
      newErrors.destinationAccountId = 'La cuenta destino es requerida'
    } else if (!/^[a-zA-Z0-9-]{3,}$/.test(formData.destinationAccountId.trim())) {
      newErrors.destinationAccountId = 'Formato de cuenta destino inválido'
    }

    // Validar que las cuentas sean diferentes
    if (
      formData.sourceAccountId.trim() &&
      formData.destinationAccountId.trim() &&
      formData.sourceAccountId.trim() === formData.destinationAccountId.trim()
    ) {
      newErrors.destinationAccountId = 'La cuenta destino debe ser diferente a la cuenta origen'
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
      const result = await createTransfer({
        sourceAccountId: formData.sourceAccountId.trim(),
        destinationAccountId: formData.destinationAccountId.trim(),
        amount: parseFloat(formData.amount),
        reference: formData.reference.trim() || undefined,
        concept: formData.concept.trim() || undefined
      })

      if (result.success) {
        setFormData({
          sourceAccountId: '',
          destinationAccountId: '',
          amount: '',
          reference: '',
          concept: ''
        })
        setErrors({})
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error inesperado al procesar la transferencia')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Crear Transferencia</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source Account Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuenta Origen *
          </label>
          <input
            type="text"
            name="sourceAccountId"
            value={formData.sourceAccountId}
            onChange={handleChange}
            placeholder="Ej: tu número de cuenta"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.sourceAccountId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.sourceAccountId && (
            <p className="mt-1 text-sm text-red-600">{errors.sourceAccountId}</p>
          )}
        </div>

        {/* Destination Account Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuenta Destino *
          </label>
          <input
            type="text"
            name="destinationAccountId"
            value={formData.destinationAccountId}
            onChange={handleChange}
            placeholder="Ej: número de cuenta del beneficiario"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.destinationAccountId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.destinationAccountId && (
            <p className="mt-1 text-sm text-red-600">{errors.destinationAccountId}</p>
          )}
        </div>

        {/* Amount Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto (GTQ) *
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
            placeholder="Ej: Pago de servicios"
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
            placeholder="Descripción de la transferencia"
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
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition"
        >
          {isSubmitting ? 'Procesando...' : 'Realizar Transferencia'}
        </button>
      </form>
    </div>
  )
}
