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
 * @param {string|null} props.submitError - Error del servidor para mostrar dentro del modal
 */
export default function UserFormModal({ isOpen, onClose, onSubmit, user = null, isLoading = false, submitError = null }) {
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

    // Nombre completo → se divide en Name (primera palabra) y Surname (resto)
    // Backend: Name NotEmpty MaxLength(100), Surname NotEmpty MaxLength(100)
    const nameTrimmed = formData.nombre.trim()
    if (!nameTrimmed) {
      newErrors.nombre = 'Nombre requerido'
    } else {
      const parts = nameTrimmed.split(/\s+/)
      if (parts[0].length > 100) {
        newErrors.nombre = 'El nombre no puede exceder 100 caracteres'
      } else if (parts.slice(1).join(' ').length > 100) {
        newErrors.nombre = 'El apellido no puede exceder 100 caracteres'
      }
    }

    // Username: NotEmpty, MinLength(4), MaxLength(50)
    const usernameTrimmed = formData.username.trim()
    if (!usernameTrimmed) {
      newErrors.username = 'Usuario requerido'
    } else if (usernameTrimmed.length < 4) {
      newErrors.username = 'Mínimo 4 caracteres'
    } else if (usernameTrimmed.length > 50) {
      newErrors.username = 'Máximo 50 caracteres'
    }

    // Password: NotEmpty (solo crear), MinLength(6), MaxLength(100)
    if (!isEditing && !formData.password) {
      newErrors.password = 'Contraseña requerida'
    } else if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Mínimo 6 caracteres'
      } else if (formData.password.length > 100) {
        newErrors.password = 'Máximo 100 caracteres'
      }
    }

    // Email: NotEmpty, EmailAddress (AspNetCore), MaxLength(100)
    const correoTrimmed = formData.correo.trim()
    if (!correoTrimmed) {
      newErrors.correo = 'Email requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoTrimmed)) {
      newErrors.correo = 'Formato de email inválido'
    } else if (correoTrimmed.length > 100) {
      newErrors.correo = 'Máximo 100 caracteres'
    }

    // Phone: NotEmpty, Matches(^\d{8}$)
    if (!formData.telefono) {
      newErrors.telefono = 'Teléfono requerido'
    } else if (!/^\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = 'Debe tener exactamente 8 dígitos numéricos'
    }

    // Address: NotEmpty, MaxLength(200)
    const direccionTrimmed = formData.direccion.trim()
    if (!direccionTrimmed) {
      newErrors.direccion = 'Dirección requerida'
    } else if (direccionTrimmed.length > 200) {
      newErrors.direccion = 'Máximo 200 caracteres'
    }

    // DPI: NotEmpty, Length(13) exactamente, Matches(^\d{13}$) — solo al crear
    if (!isEditing) {
      if (!formData.dpi) {
        newErrors.dpi = 'DPI requerido'
      } else if (!/^\d{13}$/.test(formData.dpi)) {
        newErrors.dpi = 'Debe tener exactamente 13 dígitos numéricos'
      }
    }

    // WorkName: NotEmpty, MaxLength(100)
    const trabajoTrimmed = formData.nombreTrabajo.trim()
    if (!trabajoTrimmed) {
      newErrors.nombreTrabajo = 'Nombre del trabajo requerido'
    } else if (trabajoTrimmed.length > 100) {
      newErrors.nombreTrabajo = 'Máximo 100 caracteres'
    }

    // MonthlyIncome: GreaterThanOrEqualTo(100), LessThanOrEqualTo(1,000,000)
    const ingresos = parseFloat(formData.ingresosMensuales)
    if (formData.ingresosMensuales === '' || isNaN(ingresos)) {
      newErrors.ingresosMensuales = 'Ingresos requeridos'
    } else if (ingresos < 100) {
      newErrors.ingresosMensuales = 'El mínimo es Q100.00'
    } else if (ingresos > 1000000) {
      newErrors.ingresosMensuales = 'El máximo es Q1,000,000.00'
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
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted)' }}>(nombre y apellido)</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan García"
                maxLength={201}
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
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted)' }}>(4–50 caracteres)</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="juangarcia"
                maxLength={50}
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
                {!isEditing && <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted)' }}>(13 dígitos exactos)</span>}
              </label>
              <input
                type="text"
                name="dpi"
                value={formData.dpi}
                onChange={handleChange}
                maxLength={13}
                placeholder={!isEditing ? '1234567890123' : ''}
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
              {!isEditing && !errors.dpi && formData.dpi && (
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  {formData.dpi.length}/13 dígitos
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Email <span style={{ color: 'var(--danger)' }}>*</span>
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted)' }}>(máx. 100 caracteres)</span>
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                maxLength={100}
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
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted)' }}>(8 dígitos exactos)</span>
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
              {!errors.telefono && formData.telefono && (
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  {formData.telefono.length}/8 dígitos
                </p>
              )}
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Contraseña {!isEditing && <span style={{ color: 'var(--danger)' }}>*</span>}
                {isEditing
                  ? <span style={{ color: 'var(--muted)' }}> (dejar vacío para no cambiar)</span>
                  : <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted)' }}>(mín. 6, máx. 100 caracteres)</span>
                }
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                maxLength={100}
                className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  border: `1px solid ${errors.password ? 'var(--danger)' : 'var(--gris-medio)'}`,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
                disabled={isLoading}
                placeholder={isEditing ? 'Dejar vacío para no modificar' : 'Mínimo 6 caracteres'}
              />
              {errors.password && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.password}</p>}
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                Dirección <span style={{ color: 'var(--danger)' }}>*</span>
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted)' }}>(máx. 200 caracteres)</span>
              </label>
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                rows={2}
                maxLength={200}
                placeholder="Zona, calle, avenida, número de casa"
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
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted)' }}>(máx. 100 caracteres)</span>
              </label>
              <input
                type="text"
                name="nombreTrabajo"
                value={formData.nombreTrabajo}
                onChange={handleChange}
                placeholder="Empresa S.A."
                maxLength={100}
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
                  min="100"
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

          {/* Error del servidor — visible dentro del modal sin importar el z-index */}
          {submitError && (
            <div
              className="mt-4 px-4 py-3 rounded-lg text-sm font-medium"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', color: '#dc2626' }}
            >
              <strong>Error:</strong> {submitError}
            </div>
          )}

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
