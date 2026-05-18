import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import useAuthStore from '../../auth/store/useAuthStore'
import { accountService } from '../service'
import AccountFormModal from '../components/AccountFormModal'
import AccountDetailModal from '../components/AccountDetailModal'
import { getUsers } from '../../user/service/userService'
import { isAdminUser } from '../../../shared/auth/roles'

const ACCOUNT_TYPES = [
  { value: '', label: 'Todos' },
  { value: 'CORRIENTE', label: 'Corriente' },
  { value: 'AHORRO', label: 'Ahorro' },
  { value: 'NOMINA', label: 'Nómina' },
]

const CURRENCY_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'GTQ', label: 'GTQ' },
  { value: 'USD', label: 'USD' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
]

function formatCurrency(amount, currency = 'GTQ') {
  return Number(amount ?? 0).toLocaleString('es-GT', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  })
}

export default function AccountPage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useMemo(() => isAdminUser(user), [user])

  const [myAccounts, setMyAccounts] = useState([])
  const [accountSummary, setAccountSummary] = useState(null)
  const [myLoading, setMyLoading] = useState(true)
  const [myInfoLoading, setMyInfoLoading] = useState(true)

  const [adminAccounts, setAdminAccounts] = useState([])
  const [adminTotal, setAdminTotal] = useState(0)
  const [adminPage, setAdminPage] = useState(1)
  const [adminLimit] = useState(10)
  const [adminSearch, setAdminSearch] = useState('')
  const [adminType, setAdminType] = useState('')
  const [adminCurrency, setAdminCurrency] = useState('')
  const [adminStatus, setAdminStatus] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  const [owners, setOwners] = useState([])

  const [selectedAccount, setSelectedAccount] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailTransactions, setDetailTransactions] = useState([])
  const [detailError, setDetailError] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [accountToEdit, setAccountToEdit] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  const [activeTab, setActiveTab] = useState(isAdmin ? 'admin' : 'mine')

  const loadMyAccounts = async () => {
    setMyLoading(true)
    try {
      const result = await accountService.getMyAccounts({ limit: 50 })
      if (result.success) {
        setMyAccounts(result.data.items)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Error al consultar mis cuentas')
    } finally {
      setMyLoading(false)
    }
  }

  const loadMyInfo = async () => {
    setMyInfoLoading(true)
    try {
      const result = await accountService.getMyInfo()
      if (result.success) {
        setAccountSummary(result.data.summary)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Error al cargar mi información')
    } finally {
      setMyInfoLoading(false)
    }
  }

  const loadAdminAccounts = async () => {
    if (!isAdmin) return
    setAdminLoading(true)
    try {
      const result = await accountService.getAccounts({
        page: adminPage,
        limit: adminLimit,
        search: adminSearch,
        type: adminType,
        currency: adminCurrency,
        status: adminStatus,
      })
      if (result.success) {
        setAdminAccounts(result.data.items)
        setAdminTotal(result.data.total)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Error al cargar cuentas admin')
    } finally {
      setAdminLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadMyAccounts()
      loadMyInfo()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (isAdmin) {
        loadAdminAccounts()
      }
    }, 0)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, adminPage, adminSearch, adminType, adminCurrency, adminStatus])

  const fetchOwners = async () => {
    try {
      const result = await getUsers({ page: 1, limit: 200 })
      if (result.success) {
        setOwners(result.data.items || [])
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Error al cargar los clientes propietarios')
    }
  }

  const handleOpenCreate = async () => {
    setAccountToEdit(null)
    setFormError(null)
    if (isAdmin) {
      await fetchOwners()
    }
    setFormOpen(true)
  }

  const handleCreateOrUpdate = async (payload) => {
    setFormLoading(true)
    setFormError(null)
    try {
      const result = accountToEdit
        ? await accountService.updateAccount(accountToEdit.id, payload)
        : await accountService.createAccount(payload)
      if (result.success) {
        toast.success(accountToEdit ? 'Cuenta actualizada' : 'Cuenta creada')
        setFormOpen(false)
        setAccountToEdit(null)
        loadMyAccounts()
        if (isAdmin) loadAdminAccounts()
      } else {
        setFormError(result.error)
      }
    } catch {
      setFormError('Error inesperado al guardar la cuenta')
    } finally {
      setFormLoading(false)
    }
  }

  const loadAccountTransactions = async (account) => {
    setDetailError(null)
    setDetailLoading(true)
    setDetailTransactions([])
    try {
      const result = await accountService.getAccountTransactions(account.id, { limit: 30 })
      if (result.success) {
        setDetailTransactions(result.data.transactions)
      } else {
        setDetailError(result.error)
      }
    } catch {
      setDetailError('Error al obtener movimientos')
    } finally {
      setDetailLoading(false)
    }
  }

  const openAccountDetail = async (account) => {
    setSelectedAccount(account)
    setDetailOpen(true)
    await loadAccountTransactions(account)
  }

  const handleEditAccount = (account) => {
    setAccountToEdit(account)
    setFormError(null)
    setFormOpen(true)
    if (isAdmin) fetchOwners()
  }

  const handleAccountStatusChange = async (account, nextStatus) => {
    try {
      const result = await accountService.changeAccountStatus(account.id, nextStatus)
      if (result.success) {
        toast.success(`Cuenta ${nextStatus === 'active' ? 'activada' : 'desactivada'}`)
        loadMyAccounts()
        if (isAdmin) loadAdminAccounts()
        if (detailOpen) setSelectedAccount(result.data)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Error al cambiar estado de la cuenta')
    }
  }

  const totalAdminPages = Math.max(1, Math.ceil(adminTotal / adminLimit))

  return (
    <div className="p-6" style={{ background: 'var(--bg)' }}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Cuentas</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Administración integral de cuentas bancarias y movimientos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Crear cuenta
        </button>
      </div>

      {isAdmin && (
        <div className="mb-6 flex flex-wrap gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <button
            onClick={() => setActiveTab('admin')}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'admin' ? 'bg-[var(--primary)] text-white' : 'bg-white text-[var(--text)]'}`}
          >
            Panel admin
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'mine' ? 'bg-[var(--primary)] text-white' : 'bg-white text-[var(--text)]'}`}
          >
            Mis cuentas
          </button>
        </div>
      )}

      {(!isAdmin || activeTab === 'mine') && (
        <section className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text)]">Mis cuentas</h2>
              {myLoading ? (
                <p className="mt-4 text-sm text-[var(--muted)]">Cargando cuentas...</p>
              ) : myAccounts.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--muted)]">No tienes cuentas registradas.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {myAccounts.map((account) => (
                    <article key={account.id} className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-[var(--muted)]">Número de cuenta</p>
                          <p className="text-lg font-semibold text-[var(--text)]">{account.accountNumber}</p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <span className="rounded-full bg-[var(--gris-claro-fondo)] px-3 py-1 text-sm font-semibold text-[var(--text)]">{account.type}</span>
                          <span className="rounded-full bg-[var(--gris-claro-fondo)] px-3 py-1 text-sm font-semibold text-[var(--text)]">{account.currency}</span>
                          <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: account.status === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: account.status === 'active' ? 'var(--success)' : 'var(--danger)' }}>
                            {account.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-[var(--muted)]">Saldo disponible</p>
                          <p className="text-xl font-semibold text-[var(--text)]">{formatCurrency(account.balance, account.currency)}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openAccountDetail(account)}
                            className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:opacity-90"
                          >
                            Ver detalles
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditAccount(account)}
                            className="rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                          >
                            Editar
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text)]">Resumen</h2>
              {myInfoLoading ? (
                <p className="mt-4 text-sm text-[var(--muted)]">Cargando resumen...</p>
              ) : (
                <div className="mt-4 space-y-4 text-sm text-[var(--text)]">
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-[var(--muted)]">Total de cuentas</p>
                    <p className="mt-2 text-2xl font-semibold">{accountSummary?.totalAccounts ?? myAccounts.length}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-[var(--muted)]">Saldo total</p>
                    <p className="mt-2 text-2xl font-semibold">{formatCurrency(accountSummary?.totalBalance ?? myAccounts.reduce((sum, account) => sum + Number(account.balance || 0), 0))}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {isAdmin && activeTab === 'admin' && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text)]">Listado de cuentas</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Filtra cuentas por número, tipo, moneda o estado.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              <input
                type="text"
                placeholder="Buscar por número o cliente"
                value={adminSearch}
                onChange={(event) => setAdminSearch(event.target.value)}
                className="rounded-2xl border border-[var(--border)] px-4 py-3 bg-white text-[var(--text)]"
              />
              <select
                value={adminType}
                onChange={(event) => { setAdminType(event.target.value); setAdminPage(1) }}
                className="rounded-2xl border border-[var(--border)] px-4 py-3 bg-white text-[var(--text)]"
              >
                {ACCOUNT_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={adminCurrency}
                onChange={(event) => { setAdminCurrency(event.target.value); setAdminPage(1) }}
                className="rounded-2xl border border-[var(--border)] px-4 py-3 bg-white text-[var(--text)]"
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={adminStatus}
                onChange={(event) => { setAdminStatus(event.target.value); setAdminPage(1) }}
                className="rounded-2xl border border-[var(--border)] px-4 py-3 bg-white text-[var(--text)]"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            {adminLoading ? (
              <p className="text-sm text-[var(--muted)]">Cargando cuentas...</p>
            ) : adminAccounts.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No hay cuentas que coincidan con los filtros.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-left">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="px-4 py-3 text-sm font-semibold text-[var(--muted)]">Número</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[var(--muted)]">Cliente</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[var(--muted)]">Tipo</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[var(--muted)]">Moneda</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[var(--muted)]">Saldo</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[var(--muted)]">Estado</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[var(--muted)]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminAccounts.map((account) => (
                      <tr key={account.id} className="border-b border-[var(--border)] hover:bg-[var(--gris-claro-fondo)] transition">
                        <td className="px-4 py-4 text-sm text-[var(--text)]">{account.accountNumber}</td>
                        <td className="px-4 py-4 text-sm text-[var(--text)]">{account.ownerName || 'Sin cliente'}</td>
                        <td className="px-4 py-4 text-sm text-[var(--text)]">{account.type}</td>
                        <td className="px-4 py-4 text-sm text-[var(--text)]">{account.currency}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-[var(--text)]">{formatCurrency(account.balance, account.currency)}</td>
                        <td className="px-4 py-4 text-sm">
                          <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ background: account.status === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: account.status === 'active' ? 'var(--success)' : 'var(--danger)' }}>
                            {account.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-[var(--text)]">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openAccountDetail(account)}
                              className="rounded-2xl border border-[var(--border)] px-3 py-2 text-sm transition hover:opacity-90"
                            >
                              Ver
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditAccount(account)}
                              className="rounded-2xl bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--muted)]">Total de cuentas: {adminTotal}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={adminPage <= 1}
                  onClick={() => setAdminPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-[var(--muted)]">Página {adminPage} de {totalAdminPages}</span>
                <button
                  type="button"
                  disabled={adminPage >= totalAdminPages}
                  onClick={() => setAdminPage((prev) => Math.min(totalAdminPages, prev + 1))}
                  className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <AccountFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setAccountToEdit(null); setFormError(null) }}
        onSubmit={handleCreateOrUpdate}
        account={accountToEdit}
        isLoading={formLoading}
        submitError={formError}
        isAdmin={isAdmin}
        users={owners}
      />

      <AccountDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        account={selectedAccount}
        isAdmin={isAdmin}
        onEdit={(account) => {
          handleEditAccount(account)
          setDetailOpen(false)
        }}
        onStatusChange={handleAccountStatusChange}
        transactions={detailTransactions}
        transactionsLoading={detailLoading}
        error={detailError}
      />
    </div>
  )
}
