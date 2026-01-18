import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Eye, RefreshCw, ShoppingCart, AlertTriangle,
  Filter, Calendar, DollarSign, User, Package, Truck, CheckCircle
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getOrders, updateOrder, ORDER_STATUS, DELIVERY_METHODS } from '../../api/orderApi'
import { getClients } from '../../api/clientApi'
import { useToast } from '../../hook/UseToast'

const AdminOrders = () => {
  const navigate = useNavigate()
  const { showToast, showError, showSuccess } = useToast()
  const [orders, setOrders] = useState([])
  const [clientsMap, setClientsMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 50

  useEffect(() => {
    loadClients().then((clientsMap) => loadOrders(clientsMap))
  }, [])

  const loadOrders = async (clientsMapParam = null, reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setSkip(0)
        setOrders([])
      }

      const newSkip = reset ? 0 : skip
      const data = await getOrders(newSkip, limit)

      if (data.length < limit) {
        setHasMore(false)
      }

      // Use provided clientsMap or state
      const currentClientsMap = clientsMapParam || clientsMap

      // Enrich orders with client data
      const enrichedData = data.map(order => {
        const clientId = (order.client_id || order.clientId)?.toString()
        console.log('Order:', order.id_key, 'client_id:', clientId, 'client:', order.client, 'clientsMap keys:', Object.keys(currentClientsMap))
        const client = order.client || (clientId ? currentClientsMap[clientId] : null)
        console.log('Resolved client:', client, 'clientId type:', typeof clientId, 'clientsMap[clientId]:', currentClientsMap[clientId])
        return {
          ...order,
          client: client
        }
      })

      setOrders(prev => {
        if (reset) {
          return enrichedData
        } else {
          // Filter out duplicates based on id_key
          const existingIds = new Set(prev.map(order => order.id_key))
          const newOrders = enrichedData.filter(order => !existingIds.has(order.id_key))
          return [...prev, ...newOrders]
        }
      })
      setSkip(newSkip + limit)
    } catch (error) {
      console.error('Error cargando órdenes:', error)
      showError('Error al cargar órdenes')
    } finally {
      setLoading(false)
    }
  }

  const loadClients = async () => {
    console.log('Starting loadClients...')
    try {
      console.log('Loading clients...')
      let allClients = []
      let skip = 0
      const limit = 50
      let hasMore = true

      while (hasMore) {
        console.log('Fetching clients with skip:', skip, 'limit:', limit)
        const clients = await getClients(skip, limit)
        console.log('Loaded clients batch:', clients.length, clients)
        if (clients.length < limit) {
          hasMore = false
        }
        allClients = [...allClients, ...clients]
        skip += limit
      }

      console.log('Total clients loaded:', allClients.length)
      const clientsMap = {}
      allClients.forEach(client => {
        clientsMap[client.id.toString()] = client
        console.log('Mapping client:', client.id, client.name)
      })
      console.log('Clients map:', clientsMap)
      setClientsMap(clientsMap)
      return clientsMap
    } catch (error) {
      console.error('Error cargando clientes:', error)
      showError('Error al cargar clientes')
      setLoading(false)
      return {}
    }
  }

  const handleStatusChange = async (orderId, newStatus, order) => {
    console.log('handleStatusChange called with orderId:', orderId, 'type:', typeof orderId, 'newStatus:', newStatus, 'order:', order)
    if (!orderId || orderId <= 0) {
      console.log('Invalid orderId detected:', orderId)
      showError('ID de orden no válido')
      return
    }

    // Backend expects integer status values
    const statusValue = newStatus

    try {
      const updateData = {
        status: statusValue,
        total: order.total,
        client_id: order.client_id || order.clientId,
        delivery_method: order.delivery_method
      }
      console.log('Sending update data:', updateData)
      await updateOrder(orderId, updateData)
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ))
      showSuccess('Estado de orden actualizado')
    } catch (error) {
      console.error('Error actualizando orden:', error)
      console.error('Error response:', error.response?.data)
      if (error.response?.data?.detail) {
        console.error('Validation errors:')
        error.response.data.detail.forEach((err, index) => {
          console.error(`Error ${index + 1}:`, err)
        })
      }
      showError('Error al actualizar orden')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'
      case ORDER_STATUS.IN_PROGRESS:
        return 'bg-blue-400/10 text-blue-400 border-blue-400/30'
      case ORDER_STATUS.DELIVERED:
        return 'bg-green-400/10 text-green-400 border-green-400/30'
      case ORDER_STATUS.CANCELED:
        return 'bg-red-400/10 text-red-400 border-red-400/30'
      default:
        return 'bg-gray-400/10 text-gray-400 border-gray-400/30'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'Pendiente'
      case ORDER_STATUS.IN_PROGRESS:
        return 'En Progreso'
      case ORDER_STATUS.DELIVERED:
        return 'Entregado'
      case ORDER_STATUS.CANCELED:
        return 'Cancelado'
      default:
        return 'Desconocido'
    }
  }

  const getDeliveryMethodText = (method) => {
    switch (method) {
      case DELIVERY_METHODS.DRIVE_THRU:
        return 'Drive Thru'
      case DELIVERY_METHODS.ON_HAND:
        return 'En Mano'
      case DELIVERY_METHODS.HOME_DELIVERY:
        return 'Domicilio'
      default:
        return 'Desconocido'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm ||
      order.id_key.toString().includes(searchTerm) ||
      (order.client && order.client.name && order.client.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = !selectedStatus || order.status === parseInt(selectedStatus)
    return matchesSearch && matchesStatus
  })

  // Calculate totals
  const totalOrders = filteredOrders.length
  const pendingOrders = filteredOrders.filter(order => order.status === ORDER_STATUS.PENDING).length
  const canceledOrders = filteredOrders.filter(order => order.status === ORDER_STATUS.CANCELED).length
  const deliveredOrders = filteredOrders.filter(order => order.status === ORDER_STATUS.DELIVERED).length
  const inProgressOrders = filteredOrders.filter(order => order.status === ORDER_STATUS.IN_PROGRESS).length

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Cargando órdenes...</p>
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
            <h1 className="text-4xl font-black text-white mb-2">ÓRDENES</h1>
            <p className="text-gray-400">{filteredOrders.length} órdenes en total</p>
          </div>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-zinc-950 border border-green-400/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} className="text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Total de Órdenes</p>
                <p className="text-white text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-950 border border-yellow-400/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="text-yellow-400" />
              <div>
                <p className="text-gray-400 text-sm">Órdenes Pendientes</p>
                <p className="text-white text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-950 border border-blue-400/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Truck size={24} className="text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Órdenes en Progreso</p>
                <p className="text-white text-2xl font-bold">{inProgressOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-950 border border-red-400/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Package size={24} className="text-red-400" />
              <div>
                <p className="text-gray-400 text-sm">Órdenes Canceladas</p>
                <p className="text-white text-2xl font-bold">{canceledOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-950 border border-green-400/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Órdenes Entregadas</p>
                <p className="text-white text-2xl font-bold">{deliveredOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por ID de orden o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-green-400/30 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors appearance-none cursor-pointer"
            >
              <option value="">Todos los estados</option>
              <option value={ORDER_STATUS.PENDING}>Pendiente</option>
              <option value={ORDER_STATUS.IN_PROGRESS}>En Progreso</option>
              <option value={ORDER_STATUS.DELIVERED}>Entregado</option>
              <option value={ORDER_STATUS.CANCELED}>Cancelado</option>
            </select>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => loadOrders(true)}
          className="px-4 py-2 bg-zinc-950 border border-green-400/30 hover:border-green-400/60 text-gray-300 rounded-lg transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} />
          <span>Actualizar</span>
        </button>

        {/* Orders Table */}
        <div className="bg-zinc-950 rounded-xl border border-green-400/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black border-b border-green-400/30">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    N°
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-green-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-400/10">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <ShoppingCart size={48} className="mx-auto text-gray-600 mb-3" />
                      <p className="text-gray-400">No se encontraron órdenes</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => {
                    console.log('Order in map:', order.id, 'type:', typeof order.id)
                    return (
                      <tr key={order.id || index} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-white font-mono text-sm bg-zinc-800 px-2 py-1 rounded">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-zinc-800 to-black rounded-lg flex items-center justify-center">
                              <User size={16} className="text-green-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">
                                {order.client ? order.client.name : 'Cliente desconocido'}
                              </p>
                              {order.client && order.client.email && (
                                <p className="text-gray-400 text-sm">{order.client.email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500" />
                            <span className="text-gray-300 text-sm">
                              {formatDate(order.date || order.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-full text-sm font-medium">
                            {getDeliveryMethodText(order.delivery_method)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, parseInt(e.target.value), order)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer ${getStatusColor(order.status)}`}
                        >
                            <option value={ORDER_STATUS.PENDING}>Pendiente</option>
                            <option value={ORDER_STATUS.IN_PROGRESS}>En Progreso</option>
                            <option value={ORDER_STATUS.DELIVERED}>Entregado</option>
                            <option value={ORDER_STATUS.CANCELED}>Cancelado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-green-400" />
                            <p className="text-white font-bold">${order.total?.toFixed(2) || '0.00'}</p>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={() => loadOrders()}
              disabled={loading}
              className="px-8 py-3 bg-green-400/10 border border-green-400/30 text-green-400 rounded-lg hover:bg-green-400/20 hover:border-green-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : 'Cargar más órdenes'}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
