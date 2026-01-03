import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Search, Edit, Trash2, Package, AlertTriangle,
  Filter, RefreshCw, DollarSign, Hash, FileText, Tag
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getProducts, deleteProduct, updateProduct } from '../../api/productApi'
import { getCategories } from '../../api/categoryApi'
import { useToast } from '../../hook/UseToast'

const AdminProducts = () => {
  const navigate = useNavigate()
  const { showToast, showError, showSuccess } = useToast()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    stock: '',
    category_id: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        getProducts(0, 1000),
        getCategories()
      ])

      setProducts(productsData)
      setCategories(categoriesData)
      showSuccess('Productos cargados correctamente')
    } catch (error) {
      console.error('Error cargando productos:', error)
      showError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
      showSuccess('Producto eliminado correctamente')
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error eliminando producto:', error)
      showError('Error al eliminar producto')
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()

    if (!formData.id.trim() || !formData.name.trim()) {
      showError('El ID y el nombre del producto son requeridos')
      return
    }

    try {
      const updatedProduct = await updateProduct(formData.id, {
        id: parseInt(formData.id),
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category_id)
      })
      setProducts(products.map(p =>
        p.id === parseInt(formData.id) ? updatedProduct : p
      ))
      showSuccess('Producto actualizado correctamente')
      setShowEditModal(false)
      setEditingProduct(null)
      setFormData({ id: '', name: '', price: '', stock: '', category_id: '' })
    } catch (error) {
      console.error('Error actualizando producto:', error)
      showError('Error al actualizar producto')
    }
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      id: String(product.id),
      name: product.name,
      price: product.price ? product.price.toString() : '',
      stock: product.stock ? product.stock.toString() : '',
      category_id: product.category_id ? product.category_id.toString() : ''
    })
    setShowEditModal(true)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const productCategoryId = product.category_id || (product.category && typeof product.category === 'object' ? product.category.id : product.category)
    const matchesCategory = !selectedCategory || productCategoryId === parseInt(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const getCategoryName = (product) => {
    // Try different ways to get category name
    if (product.category) {
      if (typeof product.category === 'object' && product.category.name) {
        return product.category.name
      }
      if (typeof product.category === 'string') {
        return product.category
      }
    }
    if (product.category_id) {
      const category = categories.find(c => c.id === product.category_id)
      return category ? category.name : 'Sin categoría'
    }
    return 'Sin categoría'
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando productos...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">PRODUCTOS</h1>
            <p className="text-gray-400">{filteredProducts.length} productos en total</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 flex items-center gap-2"
          >
            <Plus size={20} />
            <span>NUEVO PRODUCTO</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-green-400/30 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors appearance-none cursor-pointer"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat, index) => (
                <option key={cat.id || cat.id_key || index} value={cat.id || cat.id_key}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={loadData}
          className="px-4 py-2 bg-zinc-950 border border-green-400/30 hover:border-green-400/60 text-gray-300 rounded-lg transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} />
          <span>Actualizar</span>
        </button>

        {/* Products Table */}
        <div className="bg-zinc-950 rounded-xl border border-green-400/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black border-b border-green-400/30">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-400/10">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Package size={48} className="mx-auto text-gray-600 mb-3" />
                      <p className="text-gray-400">No se encontraron productos</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-white font-mono text-sm bg-zinc-800 px-2 py-1 rounded">
                          {product.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-zinc-800 to-black rounded-lg flex items-center justify-center">
                            <Package size={16} className="text-green-400" />
                          </div>
                          <p className="text-white font-semibold">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm font-medium">
                          {getCategoryName(product)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">${product.price.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {product.stock < 10 && (
                            <AlertTriangle size={16} className="text-orange-400" />
                          )}
                          <span className={`font-semibold ${
                            product.stock === 0
                              ? 'text-red-400'
                              : product.stock < 10
                              ? 'text-orange-400'
                              : 'text-green-400'
                          }`}>
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-xl border-2 border-blue-400/40 p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-400/10 rounded-lg">
                <Edit className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Editar Producto</h3>
                <p className="text-gray-400 text-sm">Modificar el producto seleccionado</p>
              </div>
            </div>

            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  ID *
                </label>
                <input
                  type="text"
                  value={formData.id}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nombre del producto"
                  required
                  className="w-full px-4 py-3 bg-black border border-blue-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-black border border-blue-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-black border border-blue-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-blue-400/30 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat, index) => (
                    <option key={cat.id || cat.id_key || index} value={cat.id || cat.id_key}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingProduct(null)
                    setFormData({ id: '', name: '', price: '', stock: '', category_id: '' })
                  }}
                  className="flex-1 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-xl border-2 border-red-400/40 p-6 max-w-md w-full">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-400/10 rounded-lg">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">¿Eliminar producto?</h3>
                <p className="text-gray-400 text-sm">
                  Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminProducts