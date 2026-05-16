import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, createUser, updateUser, deleteUser } from '../service/userService'
import UserFormModal from '../components/UserFormModal'
import DeleteUserModal from '../components/DeleteUserModal'

export default function UsersPage() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [totalUsers, setTotalUsers] = useState(0)

    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [notification, setNotification] = useState(null)
    const [formError, setFormError] = useState(null)

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 4000)
    }

    const loadUsers = async (page = 1) => {
        setLoading(true)
        try {
            const result = await getUsers({
                search: searchTerm.trim() || undefined,
                page,
                limit: pageSize,
            })
            if (result.success) {
                setUsers(result.data.items)
                setTotalUsers(result.data.total)
                setCurrentPage(page)
            } else {
                showNotification(result.error || 'Error al cargar usuarios', 'error')
            }
        } catch (error) {
            showNotification('Error al cargar usuarios', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSearch = (event) => {
        event?.preventDefault()
        loadUsers(1)
    }

    const handleViewDetail = (userId) => {
        navigate(`/loby/users/${userId}`)
    }

    const handleCreateUser = () => {
        setSelectedUser(null)
        setFormError(null)
        setIsFormModalOpen(true)
    }

    const handleEditUser = (user) => {
        setSelectedUser(user)
        setFormError(null)
        setIsFormModalOpen(true)
    }

    const handleDeleteClick = (user) => {
        setSelectedUser(user)
        setIsDeleteModalOpen(true)
    }

    const toggleUserStatus = async (user) => {
        const nextStatus = (user.status || 'active').toLowerCase() === 'active' ? 'inactive' : 'active'
        setActionLoading(true)
        try {
            const result = await updateUser(user.id || user._id, { status: nextStatus })
            if (result.success) {
                showNotification(`Usuario ${nextStatus === 'active' ? 'activado' : 'desactivado'} correctamente`, 'success')
                loadUsers(currentPage)
            } else {
                showNotification(result.error || 'Error al cambiar estado', 'error')
            }
        } catch (error) {
            showNotification(error.message || 'Error inesperado al cambiar estado', 'error')
        } finally {
            setActionLoading(false)
        }
    }

    const handleFormSubmit = async (userData) => {
        setActionLoading(true)
        setFormError(null)
        try {
            if (selectedUser) {
                const result = await updateUser(selectedUser.id || selectedUser._id, userData)
                if (result.success) {
                    showNotification('Usuario actualizado correctamente', 'success')
                    setIsFormModalOpen(false)
                    loadUsers(currentPage)
                } else {
                    setFormError(result.error || 'Error al actualizar usuario')
                }
            } else {
                const result = await createUser(userData)
                if (result.success) {
                    if (result.warning) {
                        showNotification(result.warning, 'error')
                    } else {
                        showNotification('Usuario creado correctamente', 'success')
                    }
                    setIsFormModalOpen(false)
                    setFormError(null)
                    loadUsers(1)
                } else {
                    setFormError(result.error || 'Error al crear usuario')
                }
            }
        } catch (error) {
            setFormError(error.message || 'Error inesperado al guardar usuario')
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteConfirm = async (userId) => {
        setActionLoading(true)
        try {
            const result = await deleteUser(userId)
            if (result.success) {
                showNotification('Usuario eliminado correctamente', 'success')
                setIsDeleteModalOpen(false)
                loadUsers(currentPage)
            } else {
                showNotification(result.error || 'Error al eliminar usuario', 'error')
            }
        } catch (error) {
            showNotification(
                error.message || 'Error inesperado al eliminar usuario',
                'error'
            )
        } finally {
            setActionLoading(false)
        }
    }

    const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize))

    return (
        <div className="p-6" style={{ background: 'var(--bg)' }}>
            {/* Notification */}
            {notification && (
                <div
                    className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in"
                    style={{
                        background: notification.type === 'error' ? 'var(--danger)' : 'var(--success)',
                        color: 'white',
                    }}
                >
                    {notification.message}
                </div>
            )}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Usuarios</h1>
                    <p className="mt-1" style={{ color: 'var(--muted)' }}>Gestión y visualización de usuarios del sistema</p>
                </div>
                <button
                    onClick={handleCreateUser}
                    className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    + Nuevo Usuario
                </button>
            </div>

            <form onSubmit={handleSearch} className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                    type="text"
                    placeholder="Buscar por nombre, email o usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--border)] px-4 py-3 bg-white text-[var(--text)]"
                />
                <button
                    type="submit"
                    className="rounded-2xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    Buscar
                </button>
            </form>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center" style={{ color: 'var(--muted)' }}>
                        Cargando usuarios...
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-6 text-center" style={{ color: 'var(--muted)' }}>
                        No hay usuarios disponibles
                    </div>
                ) : (
                    <table className="min-w-full border-separate border-spacing-0 text-left">
                        <thead className="bg-[var(--gris-claro-fondo)] border-b border-[var(--border)]">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-[var(--gris-oscuro)]">Nombre</th>
                                <th className="px-6 py-4 text-sm font-semibold text-[var(--gris-oscuro)]">Usuario</th>
                                <th className="px-6 py-4 text-sm font-semibold text-[var(--gris-oscuro)]">Email</th>
                                <th className="px-6 py-4 text-sm font-semibold text-[var(--gris-oscuro)]">Teléfono</th>
                                <th className="px-6 py-4 text-sm font-semibold text-[var(--gris-oscuro)]">Rol</th>
                                <th className="px-6 py-4 text-sm font-semibold text-[var(--gris-oscuro)]">Estado</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--gris-oscuro)]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id || user._id} className="border-b border-[var(--border)] hover:bg-[var(--gris-claro-fondo)] transition">
                                    <td className="px-6 py-4 text-sm text-[var(--text)]">{user.nombre || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--muted)]">{user.username || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--muted)]">{user.email || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--muted)]">{user.telefono || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="inline-flex items-center rounded-full bg-[rgba(47,127,191,0.1)] px-3 py-1 text-xs font-semibold text-[var(--azul-vibrante)]">
                                            {user.rol || 'USER'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${((user.status || 'active').toLowerCase() === 'active') ? 'bg-[rgba(31,161,135,0.12)] text-[var(--verde-jade)]' : 'bg-[rgba(239,68,68,0.12)] text-[var(--danger)]'}`}>
                                            {(user.status || 'active').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <button
                                                onClick={() => handleViewDetail(user.id || user._id)}
                                                className="rounded-2xl border border-[var(--azul-vibrante)] px-3 py-2 text-sm font-semibold text-[var(--azul-vibrante)] transition hover:opacity-90"
                                            >
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="rounded-2xl border border-[var(--naranja)] px-3 py-2 text-sm font-semibold text-[var(--naranja)] transition hover:opacity-90"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => toggleUserStatus(user)}
                                                className="rounded-2xl border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition hover:opacity-90"
                                            >
                                                {((user.status || 'active').toLowerCase() === 'active') ? 'Desactivar' : 'Activar'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(user)}
                                                className="rounded-2xl border border-[var(--danger)] px-3 py-2 text-sm font-semibold text-[var(--danger)] transition hover:opacity-90"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mt-6 flex flex-col gap-4 justify-between rounded-2xl border border-[var(--border)] bg-[var(--gris-claro-fondo)] p-4 sm:flex-row sm:items-center">
                <p className="text-sm text-[var(--muted)]">Total de usuarios: {totalUsers}</p>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => loadUsers(currentPage - 1)}
                        className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-[var(--muted)]">Página {currentPage} de {totalPages}</span>
                    <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => loadUsers(currentPage + 1)}
                        className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            <UserFormModal
                isOpen={isFormModalOpen}
                onClose={() => { setIsFormModalOpen(false); setFormError(null) }}
                onSubmit={handleFormSubmit}
                user={selectedUser}
                isLoading={actionLoading}
                submitError={formError}
            />
            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                user={selectedUser}
                isLoading={actionLoading}
            />
        </div>
    )
}
