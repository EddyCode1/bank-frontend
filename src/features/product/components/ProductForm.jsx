import React, { useState, useEffect } from 'react'

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

    if (!formData.price) {
      newErrors.price = 'El precio es requerido'
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'El precio debe ser un número válido no negativo'
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
        price: parseFloat(formData.price)
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

        {/* Fila: Tipo y Precio */}
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
              Monto Unitario (Q) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-3 border rounded-xl outline-none"
              style={{
                borderColor: errors.price ? '#FB7185' : '#CBD5E1',
                color: '#1E293B'
              }}
            />
            {errors.price && (
              <p className="text-xs mt-1 font-medium" style={{ color: '#EF4444' }}>{errors.price}</p>
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