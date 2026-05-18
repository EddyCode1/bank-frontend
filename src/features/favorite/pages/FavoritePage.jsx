
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUsers, getUserById } from '../../user/service/userService'
import { getFavorites, addFavorite, removeFavorite } from '../service/favoriteService'

function formatStatus(status) {
  const value = String(status || '').toLowerCase()
  if (value === 'inactive' || value === 'pendiente' || value === 'inactive' || value === 'inactiva') {
    return 'Inactivo'
  }
  return 'Activo'
}

function getDestinationAccount(person) {
  if (!person) return ''
  const primaryAccount = Array.isArray(person.cuentas) ? person.cuentas[0] : null
  return (
    String(person.accountNumber || person.numeroCuenta || person.numero || person.accountId || person.idCuenta || primaryAccount?.numero || primaryAccount?.accountNumber || primaryAccount?.id || '')
      .trim()
  )
}

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

function IconUser() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a4 4 0 100 8 4 4 0 000-8z" />
      <path fillRule="evenodd" d="M2 18a8 8 0 1116 0H2z" clipRule="evenodd" />
    </svg>
  )
}

export default function FavoritePage() {
  const navigate = useNavigate()
  const [people, setPeople] = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])
  const [favoriteUsers, setFavoriteUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const loadPeople = async (search = '') => {
    setSearching(true)
    setError(null)
    try {
      const result = await getUsers({ search: search.trim() || undefined, page: 1, limit: 50 })
      if (result.success) {
        setPeople(result.data.items)
      } else {
        setError(result.error || 'No se pudo cargar la lista de personas')
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor')
    } finally {
      setSearching(false)
    }
  }

  const loadFavorites = async () => {
    setError(null)
    try {
      const result = await getFavorites()
      if (result.success) {
        setFavoriteIds(result.data)
        await loadFavoriteUsers(result.data)
      } else {
        setError(result.error || 'Error al cargar favoritos')
      }
    } catch (err) {
      setError(err.message || 'Error al cargar favoritos')
    }
  }

  const loadFavoriteUsers = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
      setFavoriteUsers([])
      return
    }
    const uniqueIds = Array.from(new Set(ids.map(String)))
    const usersFromPage = people.filter((person) => uniqueIds.includes(String(person.id || person._id)))
    const missingIds = uniqueIds.filter((id) => !usersFromPage.some((person) => String(person.id || person._id) === id))

    const fetchedMissing = await Promise.all(
      missingIds.map(async (id) => {
        const result = await getUserById(id)
        return result.success ? result.data : null
      })
    )

    setFavoriteUsers([...usersFromPage, ...fetchedMissing.filter(Boolean)])
  }

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      await Promise.all([loadFavorites(), loadPeople('')])
      setLoading(false)
    }
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFavorite = (userId) => favoriteIds.includes(String(userId))

  const handleToggleFavorite = async (user) => {
    setActionLoading(true)
    setError(null)
    const userId = String(user.id || user._id)
    try {
      const result = isFavorite(userId)
        ? await removeFavorite(userId)
        : await addFavorite(userId)

      if (!result.success) {
        setError(result.error || 'No se pudo actualizar favorito')
        return
      }

      setFavoriteIds(result.data)
      await loadFavoriteUsers(result.data)
      setMessage(isFavorite(userId) ? 'Persona eliminada de favoritos' : 'Persona agregada a favoritos')
      setTimeout(() => setMessage(null), 4000)
    } catch (err) {
      setError(err.message || 'Error al actualizar favorito')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSearch = async (event) => {
    event?.preventDefault()
    await loadPeople(searchTerm)
  }

  const favoriteCount = favoriteIds.length
  const visiblePeople = people

  return (
    <div className="p-6" style={{ background: 'var(--bg)' }}>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Personas favoritas</h1>
          <p className="mt-2 text-[var(--muted)]">
            Marca personas que uses con frecuencia para acceder rápidamente a sus acciones.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)]">
          Favoritos guardados: <strong>{favoriteCount}</strong>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mb-8">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Tus personas favoritas</h2>
            <p className="text-sm text-[var(--muted)]">Aquí verás a las personas que añadiste como favoritas.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            onClick={async () => {
              setSearchTerm('')
              await loadPeople('')
              await loadFavorites()
            }}
          >
            Actualizar lista
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--muted)]">
            Cargando favoritos...
          </div>
        ) : favoriteUsers.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--muted)]">
            No tienes personas favoritas todavía. Busca personas abajo y agrégalas.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteUsers.map((person) => (
              <div key={person.id || person._id} className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Favorito</p>
                    <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{person.nombre || person.username || 'Sin nombre'}</h3>
                    <p className="text-sm text-[var(--muted)]">@{person.username || 'sin-usuario'}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Eliminar favorito"
                    className="rounded-full bg-yellow-100 p-2 text-yellow-600 transition hover:bg-yellow-200"
                    onClick={() => handleToggleFavorite(person)}
                    disabled={actionLoading}
                  >
                    <IconStar />
                  </button>
                </div>
                <div className="space-y-2 text-sm text-[var(--muted)]">
                  <p>{person.email || 'Email no disponible'}</p>
                  <p>{person.telefono || 'Teléfono no disponible'}</p>
                  <p>Estado: <span className="font-semibold text-[var(--text)]">{formatStatus(person.status)}</span></p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to={`/loby/users/${person.id || person._id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--primary)] hover:text-white"
                  >
                    <IconUser />
                    Ver perfil
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      const destination = getDestinationAccount(person)
                      if (!destination) return
                      navigate(`/loby/transactions?tab=transfer&dest=${encodeURIComponent(destination)}`)
                    }}
                    disabled={actionLoading || !getDestinationAccount(person)}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${getDestinationAccount(person)
                      ? 'bg-[var(--success)] text-white hover:opacity-90'
                      : 'cursor-not-allowed bg-[var(--border)] text-[var(--muted)]'}`}
                  >
                    <IconArrowRight />
                    Enviar dinero
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Buscar personas</h2>
            <p className="text-sm text-[var(--muted)]">Busca en el backend y agrega personas a tus favoritos.</p>
          </div>
          <span className="rounded-full bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] border border-[var(--border)]">
            {searching ? 'Buscando...' : `Personas encontradas: ${visiblePeople.length}`}
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

        {searching ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--muted)]">Cargando personas...</div>
        ) : visiblePeople.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--muted)]">
            No se encontraron personas con ese criterio.
          </div>
        ) : (
          <div className="grid gap-4">
            {visiblePeople.map((person) => {
              const id = person.id || person._id
              const favorite = isFavorite(id)
              return (
                <div key={id} className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text)]">{person.nombre || person.username || 'Sin nombre'}</h3>
                      <p className="text-sm text-[var(--muted)]">@{person.username || 'sin-usuario'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(person)}
                      disabled={actionLoading}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${favorite ? 'bg-yellow-400 text-white' : 'bg-[var(--primary)] text-white hover:opacity-90'}`}
                    >
                      {favorite ? 'Quitar favorito' : 'Agregar favorito'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const destination = getDestinationAccount(person)
                        if (!destination) return
                        navigate(`/loby/transactions?tab=transfer&dest=${encodeURIComponent(destination)}`)
                      }}
                      disabled={actionLoading || !getDestinationAccount(person)}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${getDestinationAccount(person)
                        ? 'bg-[var(--success)] text-white hover:opacity-90'
                        : 'cursor-not-allowed bg-[var(--border)] text-[var(--muted)]'}`}
                    >
                      Enviar dinero
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <p className="text-sm text-[var(--muted)]">Email: {person.email || 'N/A'}</p>
                    <p className="text-sm text-[var(--muted)]">Tel: {person.telefono || 'N/A'}</p>
                    <p className="text-sm text-[var(--muted)]">Rol: {person.rol || person.role || 'Usuario'}</p>
                    <p className="text-sm text-[var(--muted)]">Estado: {formatStatus(person.status)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
