<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react'
=======
import { useState } from 'react'

function buildInitialFormData(product) {
  if (!product) {
    return {
      name: '',
      description: '',
      type: 'PRODUCTO',
      paymentType: 'UNICO',
      is_active: true,
    }
  }
  return {
    name: product.name,
    description: product.description || '',
    type: product.type,
    paymentType: product.paymentType || 'UNICO',
    is_active: product.is_active !== undefined ? product.is_active : true,
  }
}
>>>>>>> Stashed changes

export default function ProductForm({ product, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'PRODUCTO',
    price: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        type: product.type,
        price: product.price
      })
    }
  }, [product])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres'
    }

    if (!formData.type) {
      newErrors.type = 'El tipo es requerido'
    }

    if (!formData.paymentType) {
      newErrors.paymentType = 'El tipo de pago es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
<<<<<<< Updated upstream
        price: parseFloat(formData.price)
=======
        paymentType: formData.paymentType,
        is_active: formData.is_active,
>>>>>>> Stashed changes
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
      {/* HEADER DEL MODAL */}
      <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: '#F1F5F9' }}>
        <h2 className="text-2xl font-bold" style={{ color: '#1F2A44' }}>
          {product ? 'Editar Registro' : 'Nuevo Producto'}
        </h2>
        <button
          onClick={onClose}
          className="text-2xl leading-none transition-colors hover:opacity-70"
          style={{ color: '#94A3B8' }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#1E293B' }}>
            Nombre del Activo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Cuenta de Ahorro Preferencial"
            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 transition-all"
            style={{
              borderColor: errors.name ? '#FB7185' : '#CBD5E1',
              color: '#1E293B',
              boxShadow: !errors.name ? 'none' : '0 0 0 1px #FB7185'
            }}
          />
          <div className="flex justify-between mt-1">
            {errors.name ? (
              <p className="text-xs font-medium" style={{ color: '#EF4444' }}>{errors.name}</p>
            ) : (
              <div />
            )}
            <p className="text-xs" style={{ color: '#94A3B8' }}>
              {formData.name.length}/100
            </p>
          </div>
        </div>

        {/* Fila: Tipo y Tipo de Pago */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: '#1E293B' }}>
              Categoría *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl outline-none bg-white cursor-pointer"
              style={{ borderColor: '#CBD5E1', color: '#1E293B' }}
            >
              <option value="PRODUCTO">Producto</option>
              <option value="SERVICIO">Servicio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: '#1E293B' }}>
              Tipo de Pago *
            </label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl outline-none bg-white cursor-pointer"
              style={{
<<<<<<< Updated upstream
                borderColor: errors.price ? '#FB7185' : '#CBD5E1',
                color: '#1E293B'
              }}
            />
            {errors.price && (
              <p className="text-xs mt-1 font-medium" style={{ color: '#EF4444' }}>{errors.price}</p>
=======
                borderColor: errors.paymentType ? '#FB7185' : '#CBD5E1',
                color: '#1E293B',
              }}
            >
              <option value="UNICO">Pago Único</option>
              <option value="MENSUAL">Pago Mensual</option>
            </select>
            {errors.paymentType && (
              <p className="text-xs mt-1 font-medium" style={{ color: '#EF4444' }}>
                {errors.paymentType}
              </p>
>>>>>>> Stashed changes
            )}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#1E293B' }}>
            Descripción Técnica
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detalles adicionales del servicio..."
            rows="3"
            className="w-full px-4 py-3 border rounded-xl outline-none transition-all resize-none"
            style={{
              borderColor: errors.description ? '#FB7185' : '#CBD5E1',
              color: '#1E293B'
            }}
          />
          <p className="text-xs mt-1 text-right" style={{ color: '#94A3B8' }}>
            {formData.description.length}/500
          </p>
        </div>

        {/* Estado del Producto */}
        {product && (
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', border: '1px solid #E2E8F0' }}>
            <div>
              <label className="block text-sm font-bold" style={{ color: '#1E293B' }}>
                Estado del Producto
              </label>
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                {formData.is_active ? 'Producto activo' : 'Producto inactivo'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={(e) => {
                  setFormData({ ...formData, is_active: e.target.checked })
                }}
                className="sr-only peer"
              />
              <div
                className="w-12 h-6 rounded-full transition-colors peer-checked:bg-green-500"
                style={{
                  backgroundColor: formData.is_active ? '#10B981' : '#CBD5E1',
                }}
              />
              <span
                className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"
              />
            </label>
          </div>
        )}

        {/* BOTONES DE ACCIÓN */}
        <div className="flex gap-4 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-bold transition-all hover:bg-gray-50"
            style={{ backgroundColor: 'transparent', color: '#64748B', border: '1px solid #CBD5E1' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
            style={{
              backgroundColor: '#F97316',
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Procesando...' : product ? 'Guardar Cambios' : 'Confirmar Registro'}
          </button>
        </div>
      </form>
    </div>
  )
}