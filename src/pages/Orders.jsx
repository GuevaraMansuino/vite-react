import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Package, Clock, Truck, CheckCircle, XCircle, Eye, 
  Search, Filter, Calendar
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import CartDrawer from '../components/cart/CartDrawer'
import { useAuth } from '../hook/UseAuth'
import { useToast } from '../hook/UseToast'
import { getOrdersByClient } from '../api/orderApi'
import { ORDER_STATUS, DELIVERY_METHODS } from '../api/orderApi'

const Orders = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showError } = useToast()
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadOrders()
  }, [user])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const userOrders = await getOrdersByClient(user.id_key || user.id)
      setOrders(userOrders)
    } catch (error) {
      console.error('Error cargando órdenes:', error)
      showError('Error al cargar las órdenes')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return {
          label: 'Pendiente',
          icon: Clock,
          color: 'text-yellow-400',
          bg: 'bg-yellow-400/10',
          border: 'border-yellow-400/40'
        }
      case ORDER_STATUS.IN_PROGRESS:
        return {
          label: 'En Progreso',
          icon: Truck,
          color: 'text-blue-400',
          bg: 'bg-blue-400/10',
          border: 'border-blue-400/40'
        }
      case ORDER_STATUS.DELIVERED:
        return {
          label: 'Entregado',
          icon: CheckCircle,
          color: 'text-green-400',
          bg: 'bg-green-400/10',
          border: 'border-green-400/40'
        }
      case ORDER_STATUS.CANCELED:
        return {
          label: 'Cancelado',
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-400/10',
          border: 'border-red-400/40'
        }
      default:
        return {
          label: 'Desconocido',
          icon: Package,
          color: 'text-gray-400',
          bg: 'bg-gray-400/10',
          border: 'border-gray-400/40'
        }
    }
  }

  const getDeliveryMethodLabel = (method) => {
    switch (method) {
      case DELIVERY_METHODS.DRIVE_THRU:
        return 'Drive Thru'
      case DELIVERY_METHODS.ON_HAND:
        return 'Retiro en Tienda'
      case DELIVERY_METHODS.HOME_DELIVERY:
        return 'Entrega a Domicilio'
      default:
        return 'Sin especificar'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === parseInt(statusFilter)
    const matchesSearch = order.id_key.toString().includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  const OrderCard = ({ order }) => {
    const statusInfo = getStatusInfo(order.status)
    const StatusIcon = statusInfo.icon

    return (
      <div className="bg-zinc-950 rounded-xl border-2 border-green-400/20 hover:border-green-400/40 transition-all p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-400/30">
              <Package size={24} className="text-black" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Orden #{order.id_key}</h3>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Calendar size={14} />
                {new Date(order.date).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 ${statusInfo.bg} border ${statusInfo.border} rounded-lg`}>
            <StatusIcon size={18} className={statusInfo.color} />
            <span className={`font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Total</p>
            <p className="text-white font-bold text-xl">${order.total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Método de Entrega</p>
            <p className="text-white font-semibold">{getDeliveryMethodLabel(order.delivery_method)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Productos</p>
            <p className="text-white font-semibold">3 items</p>
          </div>
        </div>

        {/* Progress Bar */}
        {order.status !== ORDER_STATUS.CANCELED && (
          <div className="mb-4">
            <div className="flex justify-between mb-2 text-xs text-gray-400">
              <span>Pendiente</span>
              <span>En Progreso</span>
              <span>Entregado</span>
            </div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-500"
                style={{
                  width: order.status === ORDER_STATUS.PENDING 
                    ? '33%' 
                    : order.status === ORDER_STATUS.IN_PROGRESS 
                    ? '66%' 
                    : '100%'
                }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/orders/${order.id_key}`)}
            className="flex-1 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Eye size={18} />
            <span>Ver Detalle</span>
          </button>
          
          {order.status === ORDER_STATUS.DELIVERED && (
            <button className="px-6 py-3 bg-zinc-900 border border-green-400/30 hover:border-green-400/60 text-green-400 rounded-lg transition-all font-semibold">
              Volver a Comprar
            </button>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando órdenes...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2">MIS ÓRDENES</h1>
            <p className="text-gray-400">Historial completo de tus compras</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Buscar por número de orden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-green-400/30 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors appearance-none"
              >
                <option value="all">Todos los estados</option>
                <option value={ORDER_STATUS.PENDING}>Pendiente</option>
                <option value={ORDER_STATUS.IN_PROGRESS}>En Progreso</option>
                <option value={ORDER_STATUS.DELIVERED}>Entregado</option>
                <option value={ORDER_STATUS.CANCELED}>Cancelado</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-950 rounded-xl border border-green-400/20 p-4 text-center">
              <p className="text-3xl font-black text-green-400">{orders.length}</p>
              <p className="text-gray-400 text-sm">Total</p>
            </div>
            <div className="bg-zinc-950 rounded-xl border border-yellow-400/20 p-4 text-center">
              <p className="text-3xl font-black text-yellow-400">
                {orders.filter(o => o.status === ORDER_STATUS.PENDING).length}
              </p>
              <p className="text-gray-400 text-sm">Pendientes</p>
            </div>
            <div className="bg-zinc-950 rounded-xl border border-blue-400/20 p-4 text-center">
              <p className="text-3xl font-black text-blue-400">
                {orders.filter(o => o.status === ORDER_STATUS.IN_PROGRESS).length}
              </p>
              <p className="text-gray-400 text-sm">En Progreso</p>
            </div>
            <div className="bg-zinc-950 rounded-xl border border-green-400/20 p-4 text-center">
              <p className="text-3xl font-black text-green-400">
                {orders.filter(o => o.status === ORDER_STATUS.DELIVERED).length}
              </p>
              <p className="text-gray-400 text-sm">Entregados</p>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={64} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No hay órdenes</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No se encontraron órdenes con los filtros aplicados'
                  : 'Aún no has realizado ninguna compra'}
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all"
              >
                Ir a Comprar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map(order => (
                <OrderCard key={order.id_key} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Orders