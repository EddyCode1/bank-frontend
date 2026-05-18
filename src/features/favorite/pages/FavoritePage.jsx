import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getUsers } from '../../user/service/userService'
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavoriteAlias,
} from '../service/favoriteService'
import useAuthStore from '../../auth/store/useAuthStore'
import { isAdminUser } from '../../../shared/auth/roles'

function IconStar() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10.868 2.53a.75.75 0 00-1.736 0l-1.264 3.88a.75.75 0 01-.564.52l-4.03.585a.75.75 0 00-.416 1.279l2.916 2.843a.75.75 0 01.216.664l-.687 4.006a.75.75 0 001.088.791L10 13.347l3.594 1.888a.75.75 0 001.088-.79l-.687-4.005a.75.75 0 01.216-.665l2.916-2.843a.75.75 0 00-.416-1.28l-4.03-.585a.75.75 0 01-.564-.52L10.868 2.53z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M3 10.5a.75.75 0 01.75-.75h9.69l-3.22-3.219a.75.75 0 111.06-1.061l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06L13.44 11.25H3.75A.75.75 0 013 10.5z" />
    </svg>
  )
}

function getOwnerAccountFromUser(person) {
  if (!person) return ''
  const primary = Array.isArray(person.cuentas) ? person.cuentas[0] : null
  return String(
    person.accountNumber ||
      person.numeroCuenta ||
      person.numero ||
      person.accountId ||
      person.idCuenta ||
      primary?.numero ||
      primary?.accountNumber ||
      primary?.id ||
      ''
  ).trim()
}

export default function FavoritePage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.user)
  const isAdmin = isAdminUser(currentUser)

  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)

  const [aliasInput, setAliasInput] = useState('')
  const [accountInput, setAccountInput] = useState('')
  const [creating, setCreating] = useState(false)

  const [people, setPeople] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searching, setSearching] = useState(false)
  const [peopleError, setPeopleError] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editingAlias, setEditingAlias] = useState('')

  const loadFavorites = async () => {
    setError(null)
    const result = await getFavorites()
    if (result.success) {
      setFavorites(result.data)
    } else {
      setError(result.error)
    }
  }

  const loadPeople = async (search = '') => {
    if (!isAdmin) {
      setPeople([])
      return
    }
    setSearching(true)
    setPeopleError(null)
    const result = await getUsers({ search: search.trim() || undefined, page: 1, limit: 50 })
    if (result.success) {
      setPeople(result.data.items)
    } else {
      setPeopleError(result.error || 'No se pudo cargar el directorio de personas')
    }
    setSearching(false)
  }

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      await loadFavorites()
      if (isAdmin) {
        await loadPeople('')
      }
      setLoading(false)
    }
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  const handleAddFavorite = async (event) => {
    event?.preventDefault()
    setCreating(true)
    const result = await addFavorite({ alias: aliasInput, accountNumber: accountInput })
    setCreating(false)
    if (!result.success) {
      toast.error(result.error || 'No se pudo agregar el favorito')
      return
    }
    toast.success('Favorito agregado correctamente')
    setAliasInput('')
    setAccountInput('')
    await loadFavorites()
  }

  const handleAddFromDirectory = async (person) => {
    const accountNumber = getOwnerAccountFromUser(person)
    if (!accountNumber) {
      toast.error('Esta persona no tiene un número de cuenta visible para agregar')
      return
    }
    setActionLoading(true)
    const aliasGuess = person.nombre || person.username || `Favorito ${accountNumber.slice(-4)}`
    const result = await addFavorite({ alias: aliasGuess, accountNumber })
    setActionLoading(false)
    if (!result.success) {
      toast.error(result.error || 'No se pudo agregar el favorito')
      return
    }
    toast.success('Favorito agregado correctamente')
    await loadFavorites()
  }

  const handleRemove = async (favorite) => {
    const confirmed = window.confirm(
      `¿Eliminar "${favorite.alias}" (cuenta ${favorite.accountNumber}) de tus favoritos?`
    )
    if (!confirmed) return
    setActionLoading(true)
    const result = await removeFavorite(favorite.id)
    setActionLoading(false)
    if (!result.success) {
      toast.error(result.error || 'No se pudo eliminar el favorito')
      return
    }
    toast.success('Favorito eliminado')
    await loadFavorites()
  }

  const startEdit = (favorite) => {
    setEditingId(favorite.id)
    setEditingAlias(favorite.alias)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingAlias('')
  }

  const saveEdit = async (favoriteId) => {
    if (!editingAlias.trim()) {
      toast.error('El alias no puede estar vacío')
      return
    }
    setActionLoading(true)
    const result = await updateFavoriteAlias(favoriteId, editingAlias)
    setActionLoading(false)
    if (!result.success) {
      toast.error(result.error || 'No se pudo actualizar el favorito')
      return
    }
    toast.success('Alias actualizado')
    setEditingId(null)
    setEditingAlias('')
    await loadFavorites()
  }

  const handleSearch = async (event) => {
    event?.preventDefault()
    await loadPeople(searchTerm)
  }

  const handleTransfer = (accountNumber) => {
    if (!accountNumber) return
    navigate(`/loby/transactions?tab=transfer&dest=${encodeURIComponent(accountNumber)}`)
  }

  return (
    <div className="p-6" style={{ background: 'var(--bg)' }}>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Cuentas favoritas</h1>
          <p className="mt-2 text-[var(--muted)]">
            Guarda las cuentas que más utilizas para enviar dinero rápidamente.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)]">
          Favoritos guardados: <strong>{favorites.length}</strong>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-4 flex flex-col gap-1">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Agregar cuenta favorita</h2>
          <p className="text-sm text-[var(--muted)]">
            Indica un alias (cómo quieres reconocerla) y el número de cuenta destino. Verificamos en el banco que la cuenta exista antes de guardarla.
          </p>
        </div>

        <form onSubmit={handleAddFavorite} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            value={aliasInput}
            onChange={(event) => setAliasInput(event.target.value)}
            placeholder="Alias (ej: Mamá, Tienda, Renta)"
            maxLength={50}
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--text)] focus:outline-none"
          />
          <input
            type="text"
            value={accountInput}
            onChange={(event) => setAccountInput(event.target.value)}
            placeholder="Número de cuenta destino"
            inputMode="numeric"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--text)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-2xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {creating ? 'Guardando...' : 'Agregar favorito'}
          </button>
        </form>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Tus cuentas favoritas</h2>
            <p className="text-sm text-[var(--muted)]">Aquí están las cuentas que tienes guardadas para envíos rápidos.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            onClick={() => loadFavorites()}
          >
            Actualizar lista
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--muted)]">
            Cargando favoritos...
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--muted)]">
            No tienes cuentas favoritas todavía. Agrega una usando el formulario de arriba.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Favorito</p>
                    {editingId === favorite.id ? (
                      <input
                        type="text"
                        value={editingAlias}
                        onChange={(event) => setEditingAlias(event.target.value)}
                        maxLength={50}
                        className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-base font-semibold text-[var(--text)]"
                      />
                    ) : (
                      <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{favorite.alias}</h3>
                    )}
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Cuenta <span className="font-mono">{favorite.accountNumber}</span>
                    </p>
                    {favorite.accountType ? (
                      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{favorite.accountType}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label="Eliminar favorito"
                    className="rounded-full bg-yellow-100 p-2 text-yellow-600 transition hover:bg-yellow-200"
                    onClick={() => handleRemove(favorite)}
                    disabled={actionLoading}
                  >
                    <IconStar />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editingId === favorite.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => saveEdit(favorite.id)}
                        disabled={actionLoading}
                        className="inline-flex items-center justify-center rounded-2xl bg-[var(--success)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Guardar alias
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)]"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(favorite)}
                        className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--primary)] hover:text-white"
                      >
                        Editar alias
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTransfer(favorite.accountNumber)}
                        disabled={actionLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--success)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        <IconArrowRight />
                        Enviar dinero
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {isAdmin ? (
        <section>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Directorio de personas (admin)</h2>
              <p className="text-sm text-[var(--muted)]">
                Busca usuarios del sistema y guarda su cuenta principal como favorito.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] border border-[var(--border)]">
              {searching ? 'Buscando...' : `Personas encontradas: ${people.length}`}
            </span>
          </div>

          <form onSubmit={handleSearch} className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre, usuario o email"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--text)]"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Buscar
            </button>
          </form>

          {peopleError && (
            <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {peopleError}
            </div>
          )}

          {searching ? (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--muted)]">Cargando personas...</div>
          ) : people.length === 0 ? (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--muted)]">
              No se encontraron personas con ese criterio.
            </div>
          ) : (
            <div className="grid gap-4">
              {people.map((person) => {
                const accountNumber = getOwnerAccountFromUser(person)
                return (
                  <div key={person.id || person._id} className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text)]">{person.nombre || person.username || 'Sin nombre'}</h3>
                        <p className="text-sm text-[var(--muted)]">@{person.username || 'sin-usuario'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddFromDirectory(person)}
                          disabled={actionLoading || !accountNumber}
                          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            accountNumber
                              ? 'bg-[var(--primary)] text-white hover:opacity-90'
                              : 'cursor-not-allowed bg-[var(--border)] text-[var(--muted)]'
                          }`}
                        >
                          {accountNumber ? 'Agregar a favoritos' : 'Sin cuenta disponible'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTransfer(accountNumber)}
                          disabled={actionLoading || !accountNumber}
                          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            accountNumber
                              ? 'bg-[var(--success)] text-white hover:opacity-90'
                              : 'cursor-not-allowed bg-[var(--border)] text-[var(--muted)]'
                          }`}
                        >
                          Enviar dinero
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <p className="text-sm text-[var(--muted)]">Email: {person.email || 'N/A'}</p>
                      <p className="text-sm text-[var(--muted)]">Tel: {person.telefono || 'N/A'}</p>
                      <p className="text-sm text-[var(--muted)]">Rol: {person.rol || person.role || 'Usuario'}</p>
                      <p className="text-sm text-[var(--muted)]">
                        Cuenta: <span className="font-mono">{accountNumber || 'No disponible'}</span>
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}
