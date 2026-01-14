import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Package, Upload } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { createProduct } from '../../api/productApi'
import { getCategories } from '../../api/categoryApi'
import { useToast } from '../../hook/UseToast'

const AdminProductNew = () => {
  const navigate = useNavigate()
  const { showToast, showError, showSuccess } = useToast()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories()
      console.log('Categories loaded:', categoriesData)
      console.log('All category structures:')
      categoriesData.forEach((cat, index) => {
        console.log(`Category ${index}:`, cat)
        console.log(`  ID: ${cat.id}, ID_KEY: ${cat.id_key}, Name: ${cat.name}`)
      })
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error cargando categorías:', error)
      showError('Error al cargar categorías')
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

    console.log('Form data:', formData)
    console.log('Category ID:', formData.category_id, 'Type:', typeof formData.category_id)

    // Validación básica
    if (!formData.name || !formData.price || !formData.category_id) {
      showError('Por favor completa todos los campos requeridos')
      return
    }

    if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      showError('El precio debe ser un número válido mayor o igual a 0')
      return
    }

    if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      showError('El stock debe ser un número válido mayor o igual a 0')
      return
    }

    setLoading(true)

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        category_id: parseInt(formData.category_id)
      }

      await createProduct(productData)
      showSuccess('Producto creado correctamente')
      navigate('/admin/products')
    } catch (error) {
      console.error('Error creando producto:', error)
      showError('Error al crear el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-zinc-900/50 rounded-lg transition-colors"
            title="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white mb-2">NUEVO PRODUCTO</h1>
            <p className="text-gray-400">Crea un nuevo producto para la tienda</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-zinc-950 rounded-xl border border-green-400/30 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
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
                  Precio *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Ej: 89.99"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Ej: 15"
                  min="0"
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
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
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
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

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-green-400/20">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 hover:shadow-green-400/70 disabled:shadow-none flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>CREAR PRODUCTO</span>
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

export default AdminProductNew
