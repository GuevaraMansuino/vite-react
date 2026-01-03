import React, { useState, useEffect } from 'react'
import {
  Search, Eye, Trash2, Users, AlertTriangle,
  RefreshCw, Mail, Phone, Calendar, Shield
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getClients, deleteClient } from '../../api/clientApi'
import { useToast } from '../../hook/UseToast'

const AdminClients = () => {
  const { showToast, showError, showSuccess } = useToast()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const clientsData = await getClients(0, 1000)
      setClients(clientsData)
      showSuccess('Clientes cargados correctamente')
    } catch (error) {
      console.error('Error cargando clientes:', error)
      showError('Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteClient(id)
      setClients(clients.filter(c => c.id !== id))
      showSuccess('Cliente eliminado correctamente')
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error eliminando cliente:', error)
      showError('Error al eliminar cliente')
    }
  }

  const openDetailsModal = (client) => {
    setSelectedClient(client)
    setShowDetailsModal(true)
  }

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase()
    return (
      client.name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.phone?.toLowerCase().includes(searchLower)
    )
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando clientes...</p>
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
            <h1 className="text-4xl font-black text-white mb-2">CLIENTES</h1>
            <p className="text-gray-400">{filteredClients.length} clientes en total</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
          />
        </div>

        {/* Refresh Button */}
        <button
          onClick={loadClients}
          className="px-4 py-2 bg-zinc-950 border border-green-400/30 hover:border-green-400/60 text-gray-300 rounded-lg transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} />
          <span>Actualizar</span>
        </button>

        {/* Clients Table */}
        <div className="bg-zinc-950 rounded-xl border border-green-400/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black border-b border-green-400/30">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-400/10">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Users size={48} className="mx-auto text-gray-600 mb-3" />
                      <p className="text-gray-400">No se encontraron clientes</p>
                    </td>
                  </tr>
                ) : (
                  filteredClients.map(client => (
                    <tr key={client.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-white font-mono text-sm bg-zinc-800 px-2 py-1 rounded">
                          {client.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-zinc-800 to-black rounded-lg flex items-center justify-center">
                            <Users size={16} className="text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{client.name || 'Sin nombre'}</p>
                            {client.role && (
                              <span className="px-2 py-1 bg-green-400/10 text-green-400 rounded-full text-xs font-medium">
                                {client.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Mail size={14} />
                              <span>{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Phone size={14} />
                              <span>{client.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Calendar size={14} />
                          <span>{formatDate(client.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailsModal(client)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(client.id)}
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

      {/* Client Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-xl border-2 border-blue-400/40 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-400/10 rounded-lg">
                <Eye className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Detalles del Cliente</h3>
                <p className="text-gray-400 text-sm">Información completa del cliente</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* ID */}
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  ID del Cliente
                </label>
                <p className="text-white font-mono bg-zinc-800 px-3 py-2 rounded">
                  {selectedClient.id}
                </p>
              </div>

              {/* Personal Info */}
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Users size={16} />
                  Información Personal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">
                      Nombre
                    </label>
                    <p className="text-white">{selectedClient.name || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">
                      Rol
                    </label>
                    <span className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm font-medium">
                      {selectedClient.role || 'Cliente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Mail size={16} />
                  Información de Contacto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">
                      Email
                    </label>
                    <p className="text-white">{selectedClient.email || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">
                      Teléfono
                    </label>
                    <p className="text-white">{selectedClient.phone || 'No especificado'}</p>
                  </div>
                </div>
              </div>

              {/* Registration Info */}
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  Información de Registro
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">
                      Fecha de Registro
                    </label>
                    <p className="text-white">{formatDate(selectedClient.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">
                      Última Actualización
                    </label>
                    <p className="text-white">{formatDate(selectedClient.updated_at)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedClient.address || selectedClient.city || selectedClient.country ? (
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Shield size={16} />
                    Información Adicional
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedClient.address && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">
                          Dirección
                        </label>
                        <p className="text-white">{selectedClient.address}</p>
                      </div>
                    )}
                    {selectedClient.city && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">
                          Ciudad
                        </label>
                        <p className="text-white">{selectedClient.city}</p>
                      </div>
                    )}
                    {selectedClient.country && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">
                          País
                        </label>
                        <p className="text-white">{selectedClient.country}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedClient(null)
                }}
                className="flex-1 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
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
                <h3 className="text-white font-bold text-lg mb-1">¿Eliminar cliente?</h3>
                <p className="text-gray-400 text-sm">
                  Esta acción no se puede deshacer. El cliente será eliminado permanentemente.
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

export default AdminClients
