import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useTransactionStore from '../store/useTransactionStore'

export default function TransferForm({ onSuccess, initialDestinationAccountId = '' }) {
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

  useEffect(() => {
    if (initialDestinationAccountId && initialDestinationAccountId.trim()) {
      setFormData((prev) => ({
        ...prev,
        destinationAccountId: initialDestinationAccountId.trim()
      }))
    }
  }, [initialDestinationAccountId])

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
        onSuccess?.()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error inesperado al procesar la transferencia')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="mb-1 text-xl font-semibold text-[var(--text)]">Crear Transferencia</h2>
      <p className="mb-5 text-sm text-[var(--muted)]">Envía dinero entre cuentas y registra referencia/concepto opcional.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source Account Field */}
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text)]">
            Cuenta Origen *
          </label>
          <input
            type="text"
            name="sourceAccountId"
            value={formData.sourceAccountId}
            onChange={handleChange}
            placeholder="Ej: tu número de cuenta"
            className={`w-full rounded-2xl border px-4 py-3 bg-white text-[var(--text)] focus:outline-none ${
              errors.sourceAccountId
                ? 'border-[var(--danger)]'
                : 'border-[var(--border)]'
            }`}
          />
          {errors.sourceAccountId && (
            <p className="mt-1 text-sm text-[var(--danger)]">{errors.sourceAccountId}</p>
          )}
        </div>

        {/* Destination Account Field */}
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text)]">
            Cuenta Destino *
          </label>
          <input
            type="text"
            name="destinationAccountId"
            value={formData.destinationAccountId}
            onChange={handleChange}
            placeholder="Ej: número de cuenta del beneficiario"
            className={`w-full rounded-2xl border px-4 py-3 bg-white text-[var(--text)] focus:outline-none ${
              errors.destinationAccountId
                ? 'border-[var(--danger)]'
                : 'border-[var(--border)]'
            }`}
          />
          {errors.destinationAccountId && (
            <p className="mt-1 text-sm text-[var(--danger)]">{errors.destinationAccountId}</p>
          )}
        </div>

        {/* Amount Field */}
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text)]">
            Monto (GTQ) *
          </label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full rounded-2xl border px-4 py-3 bg-white text-[var(--text)] focus:outline-none ${
              errors.amount
                ? 'border-[var(--danger)]'
                : 'border-[var(--border)]'
            }`}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-[var(--danger)]">{errors.amount}</p>
          )}
          <p className="mt-1 text-xs text-[var(--muted)]">Máximo 2 decimales</p>
        </div>

        {/* Reference Field */}
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text)]">
            Referencia (Opcional)
          </label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Ej: Pago de servicios"
            maxLength="100"
            className={`w-full rounded-2xl border px-4 py-3 bg-white text-[var(--text)] focus:outline-none ${
              errors.reference
                ? 'border-[var(--danger)]'
                : 'border-[var(--border)]'
            }`}
          />
          {errors.reference && (
            <p className="mt-1 text-sm text-[var(--danger)]">{errors.reference}</p>
          )}
          <p className="mt-1 text-xs text-[var(--muted)]">{formData.reference.length}/100</p>
        </div>

        {/* Concept Field */}
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text)]">
            Concepto (Opcional)
          </label>
          <textarea
            name="concept"
            value={formData.concept}
            onChange={handleChange}
            placeholder="Descripción de la transferencia"
            rows="3"
            maxLength="500"
            className={`w-full rounded-2xl border px-4 py-3 bg-white text-[var(--text)] focus:outline-none ${
              errors.concept
                ? 'border-[var(--danger)]'
                : 'border-[var(--border)]'
            }`}
          />
          {errors.concept && (
            <p className="mt-1 text-sm text-[var(--danger)]">{errors.concept}</p>
          )}
          <p className="mt-1 text-xs text-[var(--muted)]">{formData.concept.length}/500</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[var(--success)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Procesando...' : 'Realizar Transferencia'}
        </button>
      </form>
    </div>
  )
}
