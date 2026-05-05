import React, { useState, useEffect } from 'react'
import ProductList from '../components/ProductList'
import ProductForm from '../components/ProductForm'
import useAuthStore from '../../auth/store/useAuthStore'
import useProductStore from '../store/useProductStore'

export default function ProductPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ADMIN' || !user

  const {
    products = [],
    loading,
    error,
    filters,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilters,
  } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, filters])

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const onSubmit = async (data) => {
    if (editingProduct) {
      await updateProduct(editingProduct._id, data)
    } else {
      await createProduct(data)
    }
    handleCloseForm()
  }

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
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Categoría</span>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none"
              style={{ borderColor: '#94A3B8', color: '#1E293B' }}
            >
              <option value="">Todas las categorías</option>
              <option value="PRODUCTO">Producto</option>
              <option value="SERVICIO">Servicio</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Estado de Cuenta</span>
            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
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
          <ProductList products={products} isAdmin={isAdmin} onEdit={handleEdit} onDelete={deleteProduct} />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed" style={{ borderColor: '#94A3B8' }}>
            <p className="text-xl font-semibold" style={{ color: '#94A3B8' }}>No hay registros para mostrar</p>
          </div>
        )}
      </div>
    </div>
  )
}