import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService'
import UserFormModal from '../components/UserFormModal'
import DeleteUserModal from '../components/DeleteUserModal'

export default function UsersPage() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    
    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [notification, setNotification] = useState(null)

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 4000)
    }

    const loadUsers = async () => {
        setLoading(true)
        try {
            const result = await getUsers()
            if (result.success) {
                setUsers(result.data)
            }
        } catch {
            showNotification('Error al cargar usuarios', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        queueMicrotask(() => loadUsers())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const filteredUsers = users.filter((user) =>
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleViewDetail = (userId) => {
        navigate(`/loby/users/${userId}`)
    }

    const handleCreateUser = () => {
        setSelectedUser(null)
        setIsFormModalOpen(true)
    }

    const handleEditUser = (user) => {
        setSelectedUser(user)
        setIsFormModalOpen(true)
    }

    const handleDeleteClick = (user) => {
        setSelectedUser(user)
        setIsDeleteModalOpen(true)
    }

    const handleFormSubmit = async (userData) => {
        setActionLoading(true)
        try {
            if (selectedUser) {
                // Editar usuario existente
                const result = await updateUser(selectedUser.id || selectedUser._id, userData)
                if (result.success) {
                    showNotification('Usuario actualizado correctamente', 'success')
                    setIsFormModalOpen(false)
                    loadUsers()
                }
            } else {
                // Crear nuevo usuario
                const result = await createUser(userData)
                if (result.success) {
                    showNotification('Usuario creado correctamente', 'success')
                    setIsFormModalOpen(false)
                    loadUsers()
                }
            }
        } catch (error) {
            showNotification(
                error.response?.data?.message || error.message || 'Error al guardar usuario',
                'error'
            )
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
                loadUsers()
            }
        } catch (error) {
            showNotification(
                error.response?.data?.message || error.message || 'Error al eliminar usuario',
                'error'
            )
        } finally {
            setActionLoading(false)
        }
    }

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

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Usuarios</h1>
                    <p className="mt-1" style={{ color: 'var(--muted)' }}>Gestión y visualización de usuarios del sistema</p>
                </div>
                <button
                    onClick={handleCreateUser}
                    className="px-4 py-2 rounded-lg font-medium transition hover:opacity-90 flex items-center gap-2"
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                    }}
                >
                    <span className="text-xl">+</span>
                    Nuevo Usuario
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre, email o usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none transition"
                    style={{
                        border: '1px solid var(--gris-medio)',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        '--tw-ring-color': 'var(--primary)',
                    }}
                />
            </div>

            {/* Table */}
            <div className="rounded-lg shadow overflow-hidden" style={{ background: 'var(--surface)' }}>
                {loading ? (
                    <div className="p-6 text-center" style={{ color: 'var(--muted)' }}>
                        Cargando usuarios...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-6 text-center" style={{ color: 'var(--muted)' }}>
                        No hay usuarios disponibles
                    </div>
                ) : (
                    <table className="w-full">
                        <thead style={{ background: 'var(--gris-claro-fondo)', borderBottom: '1px solid var(--gris-medio)' }}>
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--gris-oscuro)' }}>Nombre</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--gris-oscuro)' }}>Usuario</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--gris-oscuro)' }}>Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--gris-oscuro)' }}>Teléfono</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--gris-oscuro)' }}>Rol</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold" style={{ color: 'var(--gris-oscuro)' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody style={{ borderTop: '1px solid var(--gris-medio)' }}>
                            {filteredUsers.map((user) => (
                                <tr key={user.id || user._id} className="hover:opacity-80 transition" style={{ borderBottom: '1px solid var(--gris-medio)' }}>
                                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--text)' }}>{user.nombre || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--muted)' }}>{user.username || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--muted)' }}>{user.email || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--muted)' }}>{user.telefono || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                            style={{
                                                background: 'rgba(47, 127, 191, 0.1)',
                                                color: 'var(--azul-vibrante)'
                                            }}
                                        >
                                            {user.rol || 'USER'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleViewDetail(user.id || user._id)}
                                                className="px-3 py-1.5 rounded-lg text-sm font-medium transition hover:opacity-80"
                                                style={{
                                                    border: '1px solid var(--azul-vibrante)',
                                                    color: 'var(--azul-vibrante)',
                                                    background: 'transparent'
                                                }}
                                                title="Ver detalle"
                                            >
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="px-3 py-1.5 rounded-lg text-sm font-medium transition hover:opacity-80"
                                                style={{
                                                    border: '1px solid var(--naranja)',
                                                    color: 'var(--naranja)',
                                                    background: 'transparent'
                                                }}
                                                title="Editar usuario"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(user)}
                                                className="px-3 py-1.5 rounded-lg text-sm font-medium transition hover:opacity-80"
                                                style={{
                                                    border: '1px solid var(--danger)',
                                                    color: 'var(--danger)',
                                                    background: 'transparent'
                                                }}
                                                title="Eliminar usuario"
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

            {/* Summary */}
            <div className="mt-6 p-4 rounded-lg border" style={{ background: 'var(--gris-claro-fondo)', borderColor: 'var(--gris-medio)' }}>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Total de usuarios: <span className="font-semibold" style={{ color: 'var(--text)' }}>{users.length}</span>
                </p>
            </div>

            {/* Modals */}
            <UserFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                user={selectedUser}
                isLoading={actionLoading}
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
