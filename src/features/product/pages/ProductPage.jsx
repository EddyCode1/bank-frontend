import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import ProductList from '../components/ProductList'
import ProductForm from '../components/ProductForm'
import useAuthStore from '../../auth/store/useAuthStore'
import useProductStore from '../store/useProductStore'
import { isAdminUser } from '../../../shared/auth/roles'
import { bankingClient } from '../../../shared/api/adminClient'

function resolveApiError(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.error || fallback
}

function statusBadge(status) {
  if (status === 'APROBADO') return { bg: '#DCF3EE', color: '#1FA187' }
  if (status === 'RECHAZADO') return { bg: '#FFE4E6', color: '#E11D48' }
  return { bg: '#FEF3C7', color: '#B45309' }
}

export default function ProductPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestingProduct, setRequestingProduct] = useState(null)
  const [requestNotes, setRequestNotes] = useState('')
  const [requestingId, setRequestingId] = useState(null)
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [myRequests, setMyRequests] = useState([])
  const [allRequests, setAllRequests] = useState([])

  const user = useAuthStore((state) => state.user)
  const isAdmin = isAdminUser(user)

  const {
    products = [],
    loading,
    error,
    filters,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilters,
  } = useProductStore()

  useEffect(() => {
    setFilters({ type: 'PRODUCTO', is_active: '' })
    // setFilters internamente dispara fetchProducts con el nuevo filtro
  }, [setFilters])

  const loadRequests = async () => {
    setRequestsLoading(true)
    try {
      const [myRes, allRes] = await Promise.all([
        bankingClient.get('/products/requests/me'),
        isAdmin ? bankingClient.get('/products/requests') : Promise.resolve(null),
      ])
      setMyRequests(myRes?.data?.requests ?? [])
      if (isAdmin) {
        setAllRequests(allRes?.data?.requests ?? [])
      }
    } catch (err) {
      toast.error(resolveApiError(err, 'No se pudieron cargar las solicitudes de productos'))
    } finally {
      setRequestsLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRequests()
    }, 0)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleDelete = async (productId) => {
    const target = products.find((p) => p._id === productId)
    const name = target?.name || 'este producto'
    const confirmed = window.confirm(
      `¿Eliminar definitivamente "${name}"? Si solo necesitas dejar de ofrecerlo, edítalo y desactívalo.`
    )
    if (!confirmed) return
    const ok = await deleteProduct(productId)
    if (ok) {
      toast.success('Producto eliminado correctamente')
    }
  }

  const handleOpenRequestModal = (product) => {
    setRequestingProduct(product)
    setRequestNotes('')
    setShowRequestModal(true)
  }

  const handleCloseRequestModal = () => {
    setShowRequestModal(false)
    setRequestingProduct(null)
    setRequestNotes('')
  }

  const submitRequest = async () => {
    if (!requestingProduct?._id) return
    setRequestingId(requestingProduct._id)
    try {
      await bankingClient.post('/products/requests', {
        productId: requestingProduct._id,
        notes: requestNotes?.trim() || undefined,
      })
      toast.success('Solicitud enviada correctamente')
      handleCloseRequestModal()
      await loadRequests()
    } catch (err) {
      toast.error(resolveApiError(err, 'No se pudo enviar la solicitud'))
    } finally {
      setRequestingId(null)
    }
  }

  const updateRequestStatus = async (requestId, status) => {
    setStatusUpdatingId(requestId)
    try {
      await bankingClient.patch(`/products/requests/${requestId}/status`, {
        status,
      })
      toast.success(`Solicitud ${status.toLowerCase()} correctamente`)
      await loadRequests()
    } catch (err) {
      toast.error(resolveApiError(err, 'No se pudo actualizar la solicitud'))
    } finally {
      setStatusUpdatingId(null)
    }
  }

  const onSubmit = async (data) => {
    let result = null
    if (editingProduct) {
      result = await updateProduct(editingProduct._id, data)
    } else {
      result = await createProduct(data)
    }

    // Solo cerramos cuando el backend realmente confirma la operación.
    if (result) {
      handleCloseForm()
    }
  }

  const pendingRequestsCount = useMemo(
    () => allRequests.filter((item) => item.status === 'PENDIENTE').length,
    [allRequests]
  )

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F5F7FA' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1F2A44' }}>Catálogo de Productos</h1>
            <p className="mt-1" style={{ color: '#475569' }}>Gestión integral de servicios financieros</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 text-white rounded-lg transition-all font-semibold shadow-md active:scale-95"
              style={{ backgroundColor: '#2C4A7A' }}
            >
              + Nuevo Registro
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-3 border" 
               style={{ backgroundColor: '#FEE2E2', borderColor: '#FB7185', color: '#EF4444' }}>
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-4 p-5 bg-white rounded-xl shadow-sm border" style={{ borderColor: '#94A3B844' }}>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Estado de Cuenta</span>
            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ type: 'PRODUCTO', is_active: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none"
              style={{ borderColor: '#94A3B8', color: '#1E293B' }}
            >
              <option value="">Cualquier estado</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-[#1F2A44]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <ProductForm
                key={String(editingProduct?._id ?? editingProduct?.id ?? 'new')}
                product={editingProduct}
                onSubmit={onSubmit}
                onClose={handleCloseForm}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4" style={{ borderColor: '#2C4A7A' }}></div>
            <p className="mt-4 font-semibold" style={{ color: '#2C4A7A' }}>Sincronizando con el servidor...</p>
          </div>
        ) : products.length > 0 ? (
          <ProductList
            products={products}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRequest={!isAdmin ? handleOpenRequestModal : undefined}
            requestingId={requestingId}
          />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed" style={{ borderColor: '#94A3B8' }}>
            <p className="text-xl font-semibold" style={{ color: '#94A3B8' }}>No hay registros para mostrar</p>
          </div>
        )}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#1F2A44' }}>
                {isAdmin ? 'Solicitudes de productos (clientes)' : 'Mis solicitudes de productos'}
              </h2>
              <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                Seguimiento del flujo de aprobación de productos.
              </p>
            </div>
            {isAdmin && (
              <div className="rounded-xl px-3 py-2 text-xs font-bold" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
                Pendientes: {pendingRequestsCount}
              </div>
            )}
          </div>

          {requestsLoading ? (
            <p className="mt-4 text-sm" style={{ color: '#64748B' }}>Cargando solicitudes...</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr style={{ color: '#64748B' }}>
                    <th className="text-left py-2 pr-4">Producto</th>
                    <th className="text-left py-2 pr-4">Cliente</th>
                    <th className="text-left py-2 pr-4">Estado</th>
                    <th className="text-left py-2 pr-4">Notas</th>
                    <th className="text-left py-2 pr-4">Fecha</th>
                    {isAdmin ? <th className="text-left py-2 pr-4">Acciones</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {(isAdmin ? allRequests : myRequests).map((item) => {
                    const badge = statusBadge(item.status)
                    return (
                      <tr key={item._id} className="border-t" style={{ borderColor: '#E2E8F0' }}>
                        <td className="py-3 pr-4 font-semibold" style={{ color: '#1F2A44' }}>
                          {item.product_id?.name || 'Producto'}
                        </td>
                        <td className="py-3 pr-4" style={{ color: '#475569' }}>
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-50">
                            {String(item.user_id || '').slice(-8).toUpperCase() || '—'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: badge.bg, color: badge.color }}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4" style={{ color: '#475569' }}>
                          {item.notes || item.admin_notes || '—'}
                        </td>
                        <td className="py-3 pr-4" style={{ color: '#475569' }}>
                          {new Date(item.createdAt).toLocaleString('es-GT')}
                        </td>
                        {isAdmin ? (
                          <td className="py-3 pr-4">
                            {item.status === 'PENDIENTE' ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateRequestStatus(item._id, 'APROBADO')}
                                  disabled={statusUpdatingId === item._id}
                                  className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                                  style={{ backgroundColor: '#16A34A' }}
                                >
                                  Aprobar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateRequestStatus(item._id, 'RECHAZADO')}
                                  disabled={statusUpdatingId === item._id}
                                  className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                                  style={{ backgroundColor: '#DC2626' }}
                                >
                                  Rechazar
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: '#94A3B8' }}>Gestionada</span>
                            )}
                          </td>
                        ) : null}
                      </tr>
                    )
                  })}
                  {(isAdmin ? allRequests : myRequests).length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} className="py-6 text-center" style={{ color: '#94A3B8' }}>
                        No hay solicitudes registradas.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showRequestModal ? (
        <div className="fixed inset-0 bg-[#1F2A44]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: '#F1F5F9' }}>
              <h3 className="text-xl font-bold" style={{ color: '#1F2A44' }}>
                Solicitar producto
              </h3>
              <button type="button" onClick={handleCloseRequestModal} style={{ color: '#94A3B8' }}>
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm" style={{ color: '#475569' }}>
                Producto seleccionado: <span className="font-semibold">{requestingProduct?.name}</span>
              </p>
              <textarea
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full rounded-xl border px-3 py-2"
                style={{ borderColor: '#CBD5E1' }}
                placeholder="Motivo o comentario para tu solicitud (opcional)"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 rounded-xl border font-semibold"
                  style={{ borderColor: '#CBD5E1', color: '#475569' }}
                  onClick={handleCloseRequestModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 rounded-xl text-white font-semibold"
                  style={{ backgroundColor: '#2C4A7A' }}
                  onClick={submitRequest}
                  disabled={requestingId === requestingProduct?._id}
                >
                  {requestingId === requestingProduct?._id ? 'Enviando...' : 'Enviar solicitud'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}