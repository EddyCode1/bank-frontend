import { useState, useEffect } from 'react'
import { generateAccountNumber } from '../service/userService'

/**
 * Modal para crear o editar usuarios
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onSubmit - Función para enviar el formulario
 * @param {Object} props.user - Usuario a editar (null para crear nuevo)
 * @param {boolean} props.isLoading - Si está cargando
 */
export default function UserFormModal({ isOpen, onClose, onSubmit, user = null, isLoading = false }) {
  const isEditing = !!user

  const [formData, setFormData] = useState({
    nombre: '',
    username: '',
    numeroCuenta: generateAccountNumber(),
    dpi: '',
    direccion: '',
    telefono: '',
    correo: '',
    password: '',
    nombreTrabajo: '',
    ingresosMensuales: '',
    rol: 'USER_ROLE',
  })

  const [errors, setErrors] = useState({})

  // Inicializar formData basado en user (evita setState en useEffect)
  useEffect(() => {
    const initialData = user
      ? {
          nombre: user.nombre || '',
          username: user.username || '',
          numeroCuenta: user.numeroCuenta || '',
          dpi: user.dpi || '',
          direccion: user.direccion || '',
          telefono: user.telefono || '',
          correo: user.correo || user.email || '',
          password: '',
          nombreTrabajo: user.nombreTrabajo || '',
          ingresosMensuales: user.ingresosMensuales || '',
          rol: user.rol || 'USER_ROLE',
        }
      : {
          nombre: '',
          username: '',
          numeroCuenta: generateAccountNumber(),
          dpi: '',
          direccion: '',
          telefono: '',
          correo: '',
          password: '',
          nombreTrabajo: '',
          ingresosMensuales: '',
          rol: 'USER_ROLE',
        }

    // Usar queueMicrotask para evitar setState síncrono en effect
    queueMicrotask(() => {
      setFormData(initialData)
      setErrors({})
    })
  }, [user, isOpen])

  const handleChange = (e) => {
    let { name, value } = e.target

    // Validaciones especiales según el campo
    if (name === 'telefono') {
      // Solo números y máximo 8 dígitos
      value = value.replace(/\D/g, '').slice(0, 8)
    } else if (name === 'dpi') {
      // Solo números y máximo 13 dígitos
      value = value.replace(/\D/g, '').slice(0, 13)
    } else if (name === 'ingresosMensuales') {
      // Permitir solo números y punto decimal
      value = value.replace(/[^\d.]/g, '')
      // Evitar múltiples puntos decimales
      const parts = value.split('.')
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre requerido'
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'Nombre debe tener al menos 3 caracteres'
    }

    // Usuario
    if (!formData.username.trim()) {
      newErrors.username = 'Usuario requerido'
    } else if (formData.username.trim().length < 4) {
      newErrors.username = 'Usuario debe tener al menos 4 caracteres'
    }

    // Password
    if (!isEditing && !formData.password) {
      newErrors.password = 'Contraseña requerida'
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Contraseña debe tener al menos 6 caracteres'
    }

    // Email
    if (!formData.correo.trim()) {
      newErrors.correo = 'Email requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Email inválido'
    }

    // Teléfono (8 dígitos exactos)
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Teléfono requerido'
    } else if (formData.telefono.length !== 8) {
      newErrors.telefono = 'Teléfono debe tener exactamente 8 dígitos'
    }

    // Dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'Dirección requerida'
    } else if (formData.direccion.trim().length < 10) {
      newErrors.direccion = 'Dirección debe ser más específica (mín. 10 caracteres)'
    }

    // DPI (13 dígitos exactos)
    if (!isEditing) {
      if (!formData.dpi.trim()) {
        newErrors.dpi = 'DPI requerido'
      } else if (formData.dpi.length !== 13) {
        newErrors.dpi = 'DPI debe tener exactamente 13 dígitos'
      }
    }

    // Nombre del trabajo
    if (!formData.nombreTrabajo.trim()) {
      newErrors.nombreTrabajo = 'Nombre del trabajo requerido'
    }

    // Ingresos mensuales (> Q100 y < Q1,000,000)
    const ingresos = parseFloat(formData.ingresosMensuales)
    if (!formData.ingresosMensuales || isNaN(ingresos)) {
      newErrors.ingresosMensuales = 'Ingresos requeridos'
    } else if (ingresos <= 100) {
      newErrors.ingresosMensuales = 'Ingresos deben ser mayores a Q100.00'
    } else if (ingresos > 1000000) {
      newErrors.ingresosMensuales = 'Monto máximo: Q1,000,000.00'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    // Preparar datos para enviar
    const dataToSend = { ...formData }
    
    // Convertir ingresos a número
    dataToSend.ingresosMensuales = parseFloat(dataToSend.ingresosMensuales)
    
    // Si es edición, no enviar password si está vacío
    if (isEditing && !dataToSend.password) {
      delete dataToSend.password
    }

    onSubmit(dataToSend)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
        style={{ background: 'var(--surface)' }}
      >
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--gris-medio)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <button
              onClick={onClose}
              className="text-2xl hover:opacity-70 transition"
              style={{ color: 'var(--muted)' }}
              disabled={isLoading}
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Nombre completo <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  border: `1px solid ${errors.nombre ? 'var(--danger)' : 'var(--gris-medio)'}`,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
                disabled={isLoading}
              />
              {errors.nombre && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.nombre}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Usuario <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  border: `1px solid ${errors.username ? 'var(--danger)' : 'var(--gris-medio)'}`,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
                disabled={isLoading}
              />
              {errors.username && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.username}</p>}
            </div>

            {/* Número de Cuenta */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                No. de Cuenta {!isEditing && <span style={{ color: 'var(--muted)' }}>(generado automáticamente)</span>}
              </label>
              <input
                type="text"
                name="numeroCuenta"
                value={formData.numeroCuenta}
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-opacity-50 cursor-not-allowed"
                style={{
                  border: '1px solid var(--gris-medio)',
                  background: 'var(--gris-claro-fondo)',
                  color: 'var(--muted)',
                }}
              />
            </div>

            {/* DPI */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                DPI {isEditing ? <span style={{ color: 'var(--muted)' }}>(no editable)</span> : <span style={{ color: 'var(--danger)' }}>*</span>}
              </label>
              <input
                type="text"
                name="dpi"
                value={formData.dpi}
                onChange={handleChange}
                maxLength={13}
                readOnly={isEditing}
                className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none ${isEditing ? 'cursor-not-allowed' : ''}`}
                style={{
                  border: `1px solid ${errors.dpi ? 'var(--danger)' : 'var(--gris-medio)'}`,
                  background: isEditing ? 'var(--gris-claro-fondo)' : 'var(--bg)',
                  color: isEditing ? 'var(--muted)' : 'var(--text)',
                }}
                disabled={isLoading}
              />
              {errors.dpi && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.dpi}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Email <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  border: `1px solid ${errors.correo ? 'var(--danger)' : 'var(--gris-medio)'}`,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
                disabled={isLoading}
              />
              {errors.correo && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.correo}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Teléfono <span style={{ color: 'var(--danger)' }}>*</span>
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted)' }}>(8 dígitos)</span>
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="12345678"
                maxLength={8}
                className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  border: `1px solid ${errors.telefono ? 'var(--danger)' : 'var(--gris-medio)'}`,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
                disabled={isLoading}
              />
              {errors.telefono && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.telefono}</p>}
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Contraseña {!isEditing && <span style={{ color: 'var(--danger)' }}>*</span>}
                {isEditing && <span style={{ color: 'var(--muted)' }}> (dejar vacío para no cambiar)</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  border: `1px solid ${errors.password ? 'var(--danger)' : 'var(--gris-medio)'}`,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
                disabled={isLoading}
                placeholder={isEditing ? 'Dejar vacío para no modificar' : ''}
              />
              {errors.password && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.password}</p>}
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Dirección <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  border: `1px solid ${errors.direccion ? 'var(--danger)' : 'var(--gris-medio)'}`,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
                disabled={isLoading}
              />
              {errors.direccion && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.direccion}</p>}
            </div>

            {/* Nombre del trabajo */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Nombre del trabajo <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                name="nombreTrabajo"
                value={formData.nombreTrabajo}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  border: `1px solid ${errors.nombreTrabajo ? 'var(--danger)' : 'var(--gris-medio)'}`,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
                disabled={isLoading}
              />
              {errors.nombreTrabajo && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.nombreTrabajo}</p>}
            </div>

            {/* Ingresos mensuales */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Ingresos mensuales (Q) <span style={{ color: 'var(--danger)' }}>*</span>
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted)' }}>(mín. Q100, máx. Q1,000,000)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--muted)' }}>Q</span>
                <input
                  type="number"
                  name="ingresosMensuales"
                  value={formData.ingresosMensuales}
                  onChange={handleChange}
                  placeholder="5000.00"
                  min="101"
                  max="1000000"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                  style={{
                    border: `1px solid ${errors.ingresosMensuales ? 'var(--danger)' : 'var(--gris-medio)'}`,
                    background: 'var(--bg)',
                    color: 'var(--text)',
                  }}
                  disabled={isLoading}
                />
              </div>
              {errors.ingresosMensuales && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.ingresosMensuales}</p>}
              {formData.ingresosMensuales && !errors.ingresosMensuales && (
                <p className="text-xs mt-1" style={{ color: 'var(--success)' }}>
                  ✓ {new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(parseFloat(formData.ingresosMensuales || 0))}
                </p>
              )}
            </div>

            {/* Rol */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Rol
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  border: '1px solid var(--gris-medio)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
                disabled={isLoading}
              >
                <option value="USER_ROLE">Usuario</option>
                <option value="ADMIN_ROLE">Administrador</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: 'var(--gris-medio)' }}>
            <button
              type="button"
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
              type="submit"
              className="px-4 py-2 rounded-lg font-medium transition hover:opacity-90"
              style={{
                background: 'var(--primary)',
                color: 'white',
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
