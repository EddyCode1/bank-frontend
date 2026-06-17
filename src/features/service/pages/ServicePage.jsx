import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import useAuthStore from '../../auth/store/useAuthStore'
import { isAdminUser } from '../../../shared/auth/roles'
import { bankingClient } from '../../../shared/api/adminClient'
import ConfirmModal from '../../../shared/components/ConfirmModal'
import { accountService } from '../../account/service/accountService'

function resolveApiError(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.error || fallback
}

export default function ServicePage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = isAdminUser(user)

  const [catalog, setCatalog] = useState([])
  const [adminCatalog, setAdminCatalog] = useState([])
  const [payments, setPayments] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [savingService, setSavingService] = useState(false)
  const [serviceFormOpen, setServiceFormOpen] = useState(false)
  const [serviceEditing, setServiceEditing] = useState(null)
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    is_active: true,
  })

  const [form, setForm] = useState({
    serviceId: '',
    accountId: '',
    amount: '',
    currency: 'GTQ',
    reference: '',
    description: '',
  })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [catalogRes, adminCatalogRes, accountRes, myPaymentsRes, allPaymentsRes] = await Promise.all([
        bankingClient.get('/products', { params: { type: 'SERVICIO', is_active: true } }),
        isAdmin
          ? bankingClient.get('/products', { params: { type: 'SERVICIO' } })
          : Promise.resolve(null),
        accountService.getMyAccounts({}),
        bankingClient.get('/services/payments/me'),
        isAdmin ? bankingClient.get('/services/payments') : Promise.resolve(null),
      ])

      setCatalog(catalogRes?.data?.products ?? [])
      setAdminCatalog(isAdmin ? (adminCatalogRes?.data?.products ?? []) : [])
      setPayments(isAdmin ? (allPaymentsRes?.data?.payments ?? []) : (myPaymentsRes?.data?.payments ?? []))
      setAccounts(accountRes?.success ? accountRes.data.items : [])
    } catch (error) {
      toast.error(resolveApiError(error, 'No se pudo cargar el módulo de servicios'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData()
    }, 0)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  const selectedService = useMemo(
    () => catalog.find((item) => item._id === form.serviceId),
    [catalog, form.serviceId]
  )

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const openCreateService = () => {
    setServiceEditing(null)
    setServiceForm({
      name: '',
      description: '',
      price: '',
      is_active: true,
    })
    setServiceFormOpen(true)
  }

  const openEditService = (service) => {
    setServiceEditing(service)
    setServiceForm({
      name: service.name || '',
      description: service.description || '',
      price: String(Number(service.price ?? 0)),
      is_active: service.is_active !== false,
    })
    setServiceFormOpen(true)
  }

  const saveService = async (e) => {
    e.preventDefault()
    if (!serviceForm.name.trim() || serviceForm.price === '') {
      toast.error('Nombre y precio son obligatorios')
      return
    }

    const price = Number(serviceForm.price)
    if (!Number.isFinite(price) || price < 0) {
      toast.error('El precio debe ser válido y no negativo')
      return
    }

    setSavingService(true)
    try {
      const payload = {
        name: serviceForm.name.trim(),
        description: serviceForm.description.trim() || undefined,
        type: 'SERVICIO',
        price,
        is_active: Boolean(serviceForm.is_active),
      }

      if (serviceEditing?._id) {
        await bankingClient.put(`/products/${serviceEditing._id}`, payload)
        toast.success('Servicio actualizado')
      } else {
        await bankingClient.post('/products', payload)
        toast.success('Servicio creado')
      }

      setServiceFormOpen(false)
      setServiceEditing(null)
      await loadData()
    } catch (error) {
      toast.error(resolveApiError(error, 'No se pudo guardar el servicio'))
    } finally {
      setSavingService(false)
    }
  }

  const toggleServiceStatus = async (service) => {
    try {
      await bankingClient.put(`/products/${service._id}`, {
        is_active: !service.is_active,
      })
      toast.success(`Servicio ${service.is_active ? 'desactivado' : 'activado'}`)
      await loadData()
    } catch (error) {
      toast.error(resolveApiError(error, 'No se pudo actualizar estado del servicio'))
    }
  }

  const deleteService = async (service) => {
    setConfirmTitle('Eliminar servicio')
    setConfirmMessage(`¿Eliminar el servicio "${service.name}"?`)
    setConfirmAction(() => async () => {
      setConfirmOpen(false)
      try {
        await bankingClient.delete(`/products/${service._id}`)
        toast.success('Servicio eliminado')
        await loadData()
      } catch (error) {
        toast.error(resolveApiError(error, 'No se pudo eliminar el servicio'))
      }
    })
    setConfirmOpen(true)
  }

  const submitPayment = async (e) => {
    e.preventDefault()
    if (!form.serviceId || !form.accountId || !form.amount) {
      toast.error('Completa servicio, cuenta y monto')
      return
    }

    setSubmitting(true)
    try {
      await bankingClient.post('/services/payments', {
        serviceId: form.serviceId,
        accountId: form.accountId,
        amount: Number(form.amount),
        currency: form.currency,
        reference: form.reference || undefined,
        description: form.description || undefined,
      })
      toast.success('Pago de servicio realizado correctamente')
      setForm({
        serviceId: '',
        accountId: '',
        amount: '',
        currency: 'GTQ',
        reference: '',
        description: '',
      })
      await loadData()
    } catch (error) {
      toast.error(resolveApiError(error, 'No se pudo realizar el pago del servicio'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
              Servicios bancarios
            </h1>
            <p className="mt-1" style={{ color: 'var(--muted)' }}>
              Realiza pagos de servicios y consulta su historial.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadData()}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Actualizar
          </button>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              Catálogo de servicios
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
              Servicios activos disponibles para pago.
            </p>
            {loading ? (
              <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>Cargando catálogo...</p>
            ) : catalog.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-3">
                {catalog.map((service) => (
                  <button
                    key={service._id}
                    type="button"
                    className={`rounded-xl border p-4 text-left transition ${
                      form.serviceId === service._id ? 'border-[#2C4A7A] bg-[#EEF2FF]' : ''
                    }`}
                    style={{ borderColor: 'var(--border)' }}
                    onClick={() => handleChange('serviceId', service._id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{service.name}</h3>
                      <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                        Q{Number(service.price ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>{service.description || 'Sin descripción'}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>No hay servicios activos.</p>
            )}
          </article>

          <article className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              Pagar servicio
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
              Selecciona cuenta, monto y referencia para registrar el pago.
            </p>

            <form className="mt-4 space-y-4" onSubmit={submitPayment}>
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Servicio</label>
                <select
                  value={form.serviceId}
                  onChange={(e) => handleChange('serviceId', e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <option value="">Selecciona un servicio</option>
                  {catalog.map((service) => (
                    <option key={service._id} value={service._id}>{service.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Cuenta origen</label>
                <select
                  value={form.accountId}
                  onChange={(e) => handleChange('accountId', e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <option value="">Selecciona una cuenta</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountNumber} ({account.currency}) - Saldo: {Number(account.balance).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Monto</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Moneda de pago</label>
                  <select
                    value={form.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <option value="GTQ">GTQ</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Referencia</label>
                <input
                  type="text"
                  maxLength={120}
                  value={form.reference}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="Ej: contrato, NIS, cliente"
                />
              </div>

              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Descripción</label>
                <textarea
                  maxLength={500}
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="Detalle adicional del pago"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl px-4 py-2.5 text-white font-semibold disabled:opacity-60"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {submitting ? 'Procesando pago...' : `Pagar ${selectedService?.name || 'servicio'}`}
              </button>
            </form>
          </article>
        </section>

        {isAdmin ? (
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                  Catálogo de servicios (admin)
                </h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
                  Gestión completa de servicios disponibles para pago.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateService}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                + Nuevo servicio
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr style={{ color: 'var(--muted)' }}>
                    <th className="text-left py-2 pr-4">Nombre</th>
                    <th className="text-left py-2 pr-4">Descripción</th>
                    <th className="text-left py-2 pr-4">Precio</th>
                    <th className="text-left py-2 pr-4">Estado</th>
                    <th className="text-left py-2 pr-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {adminCatalog.map((service) => (
                    <tr key={service._id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-3 pr-4 font-semibold" style={{ color: 'var(--text)' }}>{service.name}</td>
                      <td className="py-3 pr-4" style={{ color: 'var(--muted)' }}>{service.description || '—'}</td>
                      <td className="py-3 pr-4" style={{ color: 'var(--muted)' }}>Q{Number(service.price ?? 0).toFixed(2)}</td>
                      <td className="py-3 pr-4">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: service.is_active ? '#DCF3EE' : '#FFE4E6',
                            color: service.is_active ? '#1FA187' : '#E11D48',
                          }}
                        >
                          {service.is_active ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditService(service)}
                            className="rounded-lg border px-3 py-1 text-xs font-semibold"
                            style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleServiceStatus(service)}
                            className="rounded-lg border px-3 py-1 text-xs font-semibold"
                            style={{ borderColor: 'var(--muted)', color: 'var(--muted)' }}
                          >
                            {service.is_active ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteService(service)}
                            className="rounded-lg border px-3 py-1 text-xs font-semibold"
                            style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {adminCatalog.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center" style={{ color: 'var(--muted)' }}>
                        No hay servicios registrados.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
            {isAdmin ? 'Pagos de servicios (global)' : 'Mis pagos de servicios'}
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Registro de pagos completados con detalle de cuenta, moneda y referencia.
          </p>

          {loading ? (
            <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>Cargando pagos...</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr style={{ color: 'var(--muted)' }}>
                    <th className="text-left py-2 pr-4">Servicio</th>
                    <th className="text-left py-2 pr-4">Usuario</th>
                    <th className="text-left py-2 pr-4">Cuenta</th>
                    <th className="text-left py-2 pr-4">Solicitado</th>
                    <th className="text-left py-2 pr-4">Debitado</th>
                    <th className="text-left py-2 pr-4">Referencia</th>
                    <th className="text-left py-2 pr-4">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-3 pr-4 font-semibold" style={{ color: 'var(--text)' }}>
                        {payment.service_id?.name || 'Servicio'}
                      </td>
                      <td className="py-3 pr-4" style={{ color: 'var(--muted)' }}>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-50">
                          {String(payment.user_id || '').slice(-8).toUpperCase() || '—'}
                        </span>
                      </td>
                      <td className="py-3 pr-4" style={{ color: 'var(--muted)' }}>
                        {payment.account_id?.account_number || '—'}
                      </td>
                      <td className="py-3 pr-4" style={{ color: 'var(--muted)' }}>
                        {Number(payment.amount_requested ?? 0).toFixed(2)} {payment.currency_from}
                      </td>
                      <td className="py-3 pr-4" style={{ color: 'var(--muted)' }}>
                        {Number(payment.amount_debited ?? 0).toFixed(2)} {payment.currency_to}
                      </td>
                      <td className="py-3 pr-4" style={{ color: 'var(--muted)' }}>{payment.reference || '—'}</td>
                      <td className="py-3 pr-4" style={{ color: 'var(--muted)' }}>
                        {new Date(payment.createdAt).toLocaleString('es-GT')}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center" style={{ color: 'var(--muted)' }}>
                        No hay pagos registrados todavía.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {serviceFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              {serviceEditing ? 'Editar servicio' : 'Nuevo servicio'}
            </h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
              Configura el servicio para que pueda ser pagado por clientes.
            </p>

            <form className="mt-4 space-y-4" onSubmit={saveService}>
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Nombre</label>
                <input
                  type="text"
                  maxLength={100}
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>

              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Descripción</label>
                <textarea
                  maxLength={500}
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Precio</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, price: e.target.value }))}
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--muted)' }}>
                    <input
                      type="checkbox"
                      checked={serviceForm.is_active}
                      onChange={(e) => setServiceForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                    />
                    Activo
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setServiceFormOpen(false)}
                  className="flex-1 rounded-xl border px-4 py-2 font-semibold"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingService}
                  className="flex-1 rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {savingService ? 'Guardando...' : serviceEditing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { if (typeof confirmAction === 'function') confirmAction() }}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        danger={true}
      />
    </div>
  )
}
