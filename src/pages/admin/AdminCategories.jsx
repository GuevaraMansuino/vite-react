import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Search, Edit, Trash2, Tag, AlertTriangle,
  RefreshCw
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi'
import { useToast } from '../../hook/UseToast'

const AdminCategories = () => {
  const navigate = useNavigate()
  const { showToast, showError, showSuccess } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const categoriesData = await getCategories()
      setCategories(categoriesData)
      showSuccess('Categorías cargadas correctamente')
    } catch (error) {
      console.error('Error cargando categorías:', error)
      showError('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id)
      setCategories(categories.filter(c => c.id !== id))
      showSuccess('Categoría eliminada correctamente')
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error eliminando categoría:', error)
      showError('Error al eliminar categoría')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showError('El nombre de la categoría es requerido')
      return
    }

    try {
      const newCategory = await createCategory({
        id: formData.id || null,
        name: formData.name.trim(),
      })
      setCategories([...categories, newCategory])
      showSuccess('Categoría creada correctamente')
      setShowCreateModal(false)
      setFormData({ name: ''})
    } catch (error) {
      console.error('Error creando categoría:', error)
      showError('Error al crear categoría')
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()

    if (!formData.id.trim() || !formData.name.trim()) {
      showError('El ID y el nombre de la categoría son requeridos')
      return
    }

    try {
      const updatedCategory = await updateCategory(formData.id, {
        id: formData.id,
        name: formData.name.trim()
      })
      setCategories(categories.map(c =>
        c.id === formData.id ? updatedCategory : c
      ))
      showSuccess('Categoría actualizada correctamente')
      setShowEditModal(false)
      setEditingCategory(null)
      setFormData({ id: '', name: '' })
    } catch (error) {
      console.error('Error actualizando categoría:', error)
      showError('Error al actualizar categoría')
    }
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setFormData({
      id: String(category.id),
      name: category.name,
    })
    setShowEditModal(true)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando categorías...</p>
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
            <h1 className="text-4xl font-black text-white mb-2">CATEGORÍAS</h1>
            <p className="text-gray-400">{filteredCategories.length} categorías en total</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 flex items-center gap-2"
          >
            <Plus size={20} />
            <span>NUEVA CATEGORÍA</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
          />
        </div>

        {/* Refresh Button */}
        <button
          onClick={loadCategories}
          className="px-4 py-2 bg-zinc-950 border border-green-400/30 hover:border-green-400/60 text-gray-300 rounded-lg transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} />
          <span>Actualizar</span>
        </button>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Tag size={48} className="text-gray-600 mb-3" />
              <p className="text-gray-400">No se encontraron categorías</p>
            </div>
          ) : (
            filteredCategories.map(category => (
              <div key={category.id} className="bg-zinc-950 rounded-xl border border-green-400/30 p-6 hover:border-green-400/60 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Tag size={20} className="text-black" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(category.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-white font-bold text-lg">{category.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-mono bg-zinc-800 px-2 py-1 rounded">
                      ID: {category.id}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-xl border-2 border-green-400/40 p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-400/10 rounded-lg">
                <Plus className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Nueva Categoría</h3>
                <p className="text-gray-400 text-sm">Crear una nueva categoría</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Ropa Deportiva"
                  required
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setFormData({ name: '' })
                  }}
                  className="flex-1 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-xl border-2 border-blue-400/40 p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-400/10 rounded-lg">
                <Edit className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Editar Categoría</h3>
                <p className="text-gray-400 text-sm">Modificar la categoría seleccionada</p>
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
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  placeholder="ID de la categoría"
                  required
                  className="w-full px-4 py-3 bg-black border border-blue-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nuevo Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nuevo nombre de la categoría"
                  required
                  className="w-full px-4 py-3 bg-black border border-blue-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingCategory(null)
                    setFormData({ id: '', name: '' })
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
                <h3 className="text-white font-bold text-lg mb-1">¿Eliminar categoría?</h3>
                <p className="text-gray-400 text-sm">
                  Esta acción no se puede deshacer. La categoría será eliminada permanentemente.
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

export default AdminCategories
