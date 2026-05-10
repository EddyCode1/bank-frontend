import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../service/userService'

export default function UsersPage() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true)
            const result = await getUsers()
            if (result.success) {
                setUsers(result.data)
            }
            setLoading(false)
        }
        loadUsers()
    }, [])

    const filteredUsers = users.filter((user) =>
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleViewDetail = (userId) => {
        navigate(`/loby/users/${userId}`)
    }

    return (
        <div className="p-6" style={{ background: 'var(--bg)' }}>
            <div className="mb-6">
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Usuarios</h1>
                <p className="mt-1" style={{ color: 'var(--muted)' }}>Gestión y visualización de usuarios del sistema</p>
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
                                <th className="px-6 py-3 text-center text-sm font-semibold" style={{ color: 'var(--gris-oscuro)' }}>Acciones</th>
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
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleViewDetail(user.id || user._id)}
                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition hover:opacity-80"
                                            style={{
                                                border: '1px solid var(--primary)',
                                                color: 'var(--primary)',
                                                background: 'transparent'
                                            }}
                                        >
                                            Ver detalle
                                        </button>
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
        </div>
    )
}
