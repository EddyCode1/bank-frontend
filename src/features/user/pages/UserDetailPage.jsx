import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserById } from '../service/userService'

export default function UserDetailPage() {
    const { userId } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('datos')

    useEffect(() => {
        const loadUserDetail = async () => {
            setLoading(true)
            const result = await getUserById(userId)
            if (result.success) {
                setUser(result.data)

                // Si el usuario tiene cuentas, cargarlas
                if (result.data.cuentas && Array.isArray(result.data.cuentas)) {
                    setAccounts(result.data.cuentas)
                }
            }
            setLoading(false)
        }
        loadUserDetail()
    }, [userId])

    if (loading) {
        return (
            <div className="p-6" style={{ background: 'var(--bg)' }}>
                <div className="text-center" style={{ color: 'var(--muted)' }}>
                    Cargando información del usuario...
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="p-6" style={{ background: 'var(--bg)' }}>
                <div className="text-center">
                    <p className="mb-4" style={{ color: 'var(--muted)' }}>No se encontró el usuario</p>
                    <button
                        onClick={() => navigate('/loby/users')}
                        className="px-4 py-2 rounded-lg transition hover:opacity-80 text-white"
                        style={{ background: 'var(--primary)' }}
                    >
                        Volver a usuarios
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6" style={{ background: 'var(--bg)' }}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/loby/users')}
                    className="px-4 py-2 rounded-lg transition hover:opacity-80"
                    style={{
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        background: 'transparent'
                    }}
                >
                    ← Volver
                </button>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>{user.nombre || 'Sin nombre'}</h1>
                    <p style={{ color: 'var(--muted)' }}>@{user.username || 'N/A'}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-4" style={{ borderBottom: '1px solid var(--gris-medio)' }}>
                <button
                    onClick={() => setActiveTab('datos')}
                    className="pb-3 px-4 font-medium transition"
                    style={{
                        borderBottom: activeTab === 'datos' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'datos' ? 'var(--primary)' : 'var(--muted)',
                    }}
                >
                    Datos Personales
                </button>
                <button
                    onClick={() => setActiveTab('cuentas')}
                    className="pb-3 px-4 font-medium transition"
                    style={{
                        borderBottom: activeTab === 'cuentas' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'cuentas' ? 'var(--primary)' : 'var(--muted)',
                    }}
                >
                    Cuentas ({accounts.length})
                </button>
            </div>

            {/* Tab Content */}
            <div className="rounded-lg shadow p-6" style={{ background: 'var(--surface)' }}>
                {activeTab === 'datos' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Información básica */}
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gris-oscuro)' }}>Nombre Completo</label>
                                <div className="px-4 py-2 rounded-lg" style={{ background: 'var(--gris-claro-fondo)', color: 'var(--text)' }}>
                                    {user.nombre || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gris-oscuro)' }}>Usuario</label>
                                <div className="px-4 py-2 rounded-lg" style={{ background: 'var(--gris-claro-fondo)', color: 'var(--text)' }}>
                                    {user.username || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gris-oscuro)' }}>Email</label>
                                <div className="px-4 py-2 rounded-lg" style={{ background: 'var(--gris-claro-fondo)', color: 'var(--text)' }}>
                                    {user.email || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gris-oscuro)' }}>Teléfono</label>
                                <div className="px-4 py-2 rounded-lg" style={{ background: 'var(--gris-claro-fondo)', color: 'var(--text)' }}>
                                    {user.telefono || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gris-oscuro)' }}>Rol</label>
                                <div className="px-4 py-2 rounded-lg" style={{ background: 'var(--gris-claro-fondo)' }}>
                                    <span
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        style={{
                                            background: 'rgba(47, 127, 191, 0.1)',
                                            color: 'var(--azul-vibrante)'
                                        }}
                                    >
                                        {user.rol || 'USER'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gris-oscuro)' }}>ID</label>
                                <div className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--gris-claro-fondo)', color: 'var(--text)' }}>
                                    {user.id || user._id || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Información adicional */}
                        {(user.direccion || user.ciudad || user.pais) && (
                            <div style={{ borderTop: '1px solid var(--gris-medio)', paddingTop: '24px' }}>
                                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Dirección</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    {user.direccion && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gris-oscuro)' }}>Dirección</label>
                                            <div className="px-4 py-2 rounded-lg" style={{ background: 'var(--gris-claro-fondo)', color: 'var(--text)' }}>
                                                {user.direccion}
                                            </div>
                                        </div>
                                    )}
                                    {user.ciudad && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gris-oscuro)' }}>Ciudad</label>
                                            <div className="px-4 py-2 rounded-lg" style={{ background: 'var(--gris-claro-fondo)', color: 'var(--text)' }}>
                                                {user.ciudad}
                                            </div>
                                        </div>
                                    )}
                                    {user.pais && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gris-oscuro)' }}>País</label>
                                            <div className="px-4 py-2 rounded-lg" style={{ background: 'var(--gris-claro-fondo)', color: 'var(--text)' }}>
                                                {user.pais}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'cuentas' && (
                    <div>
                        {accounts.length === 0 ? (
                            <p className="text-center py-8" style={{ color: 'var(--muted)' }}>Este usuario no tiene cuentas asociadas</p>
                        ) : (
                            <div className="space-y-4">
                                {accounts.map((account) => (
                                    <div
                                        key={account.id || account._id}
                                        className="border rounded-lg p-4 transition hover:shadow-md"
                                        style={{ borderColor: 'var(--gris-medio)' }}
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm" style={{ color: 'var(--muted)' }}>Número de Cuenta</p>
                                                <p className="font-semibold" style={{ color: 'var(--text)' }}>{account.numero || account.accountNumber || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm" style={{ color: 'var(--muted)' }}>Tipo</p>
                                                <p className="font-semibold" style={{ color: 'var(--text)' }}>{account.tipo || account.type || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm" style={{ color: 'var(--muted)' }}>Saldo</p>
                                                <p className="font-semibold" style={{ color: 'var(--success)' }}>${parseFloat(account.saldo || account.balance || 0).toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm" style={{ color: 'var(--muted)' }}>Estado</p>
                                                <span
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                    style={{
                                                        background: (account.estado || account.status || 'active').toLowerCase() === 'active'
                                                            ? 'rgba(31, 161, 135, 0.1)'
                                                            : 'rgba(239, 68, 68, 0.1)',
                                                        color: (account.estado || account.status || 'active').toLowerCase() === 'active'
                                                            ? 'var(--verde-jade)'
                                                            : 'var(--naranja-rojizo)'
                                                    }}
                                                >
                                                    {account.estado || account.status || 'Active'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
