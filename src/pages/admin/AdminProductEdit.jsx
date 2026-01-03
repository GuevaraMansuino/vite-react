import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Save, Package, AlertTriangle,
  DollarSign, Hash, FileText, Tag
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getProductById, updateProduct } from '../../api/productApi'
import { getCategories } from '../../api/categoryApi'
import { useToast } from '../../hook/UseToast'

const AdminProductEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showToast, showError, showSuccess } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: ''
  })

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productData, categoriesData] = await Promise.all([
        getProductById(id),
        getCategories()
      ])

      setFormData({
        id: productData.id || '',
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price ? productData.price.toString() : '',
        stock: productData.stock ? productData.stock.toString() : '',
        category_id: productData.category_id ? productData.category_id.toString() : ''
      })

      setCategories(categoriesData)
      showSuccess('Producto cargado correctamente')
    } catch (error) {
      console.error('Error cargando producto:', error)
      showError('Error al cargar el producto')
      navigate('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      showError('El nombre del producto es requerido')
      return
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      showError('El precio debe ser un número positivo')
      return
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      showError('El stock debe ser un número positivo o cero')
      return
    }

    if (!formData.category_id) {
      showError('Debe seleccionar una categoría')
      return
    }

    try {
      setSaving(true)

      const updateData = {
        id: parseInt(formData.id),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category_id)
      }

      await updateProduct(formData.id, updateData)
      showSuccess('Producto actualizado correctamente')
      navigate('/admin/products')
    } catch (error) {
      console.error('Error actualizando producto:', error)
      showError('Error al actualizar el producto')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando producto...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white mb-2">EDITAR PRODUCTO</h1>
            <p className="text-gray-400">Modificar la información del producto</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-zinc-950 rounded-xl border border-green-400/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Hash size={16} className="inline mr-2" />
                  ID del Producto *
                </label>
                <input
                  type="number"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Modificar el ID del producto</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Package size={16} className="inline mr-2" />
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Hoodie Cyber Black"
                  required
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <DollarSign size={16} className="inline mr-2" />
                  Precio *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Hash size={16} className="inline mr-2" />
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Tag size={16} className="inline mr-2" />
                  Categoría *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <FileText size={16} className="inline mr-2" />
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe el producto..."
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-green-400/20">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="flex-1 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProductEdit
