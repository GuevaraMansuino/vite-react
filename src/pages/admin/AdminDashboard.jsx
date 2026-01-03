import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Package, Users, ShoppingCart, DollarSign, 
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Activity, AlertCircle
} from 'lucide-react'
import { testConnection } from '../../api/axios.config'
import { getProducts } from '../../api/productApi'
import { getCategories } from '../../api/categoryApi'
import { getOrders } from '../../api/orderApi'
import { useToast } from '../../hook/UseToast'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { showToast, showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0,
    recentOrders: 0
  })

  useEffect(() => {
    checkConnection()
    loadDashboardData()
  }, [])

  const checkConnection = async () => {
    const result = await testConnection()
    setConnectionStatus(result)
    
    if (result.success) {
      showToast('✅ Conectado al backend', 'success')
    } else {
      showError('❌ Error de conexión con el backend')
    }
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Cargar productos
      const products = await getProducts(0, 1000)
      const lowStockProducts = products.filter(p => p.stock < 10)

      // Cargar categorías
      const categories = await getCategories()

      // Cargar órdenes
      const orders = await getOrders(0, 1000)
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        lowStock: lowStockProducts.length,
        recentOrders: orders.filter(o => {
          const orderDate = new Date(o.date)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return orderDate > weekAgo
        }).length
      })

    } catch (error) {
      console.error('Error cargando datos:', error)
      showError('Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color = 'green' }) => (
    <div className="bg-zinc-950 rounded-xl border-2 border-green-400/20 hover:border-green-400/40 transition-all p-6 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-black text-white">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-400/10 rounded-lg group-hover:bg-${color}-400/20 transition-colors`}>
          <Icon className={`text-${color}-400`} size={24} />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">DASHBOARD</h1>
          <p className="text-gray-400">Resumen general de tu tienda</p>
        </div>

        {/* Connection Status */}
        {connectionStatus && (
          <div className={`p-4 rounded-lg border-2 ${
            connectionStatus.success 
              ? 'bg-green-400/10 border-green-400/40' 
              : 'bg-red-400/10 border-red-400/40'
          }`}>
            <div className="flex items-center gap-3">
              {connectionStatus.success ? (
                <>
                  <Activity className="text-green-400" size={20} />
                  <div>
                    <p className="text-green-400 font-semibold">Backend conectado</p>
                    <p className="text-xs text-gray-400">{connectionStatus.data?.status}</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="text-red-400" size={20} />
                  <div>
                    <p className="text-red-400 font-semibold">Error de conexión</p>
                    <p className="text-xs text-gray-400">{connectionStatus.error}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Productos"
            value={stats.totalProducts}
            icon={Package}
            color="green"
          />
          <StatCard
            title="Categorías"
            value={stats.totalCategories}
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Órdenes Totales"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="purple"
          />
          <StatCard
            title="Ingresos"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="yellow"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <div className="bg-orange-400/10 border-2 border-orange-400/40 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-400/20 rounded-lg">
                <AlertCircle className="text-orange-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Stock Bajo</h3>
                <p className="text-gray-400 mb-3">
                  {stats.lowStock} productos con menos de 10 unidades
                </p>
                <button
                  onClick={() => navigate('/admin/products')}
                  className="text-orange-400 hover:text-orange-300 font-semibold text-sm"
                >
                  Ver productos →
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-green-400/10 border-2 border-green-400/40 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-400/20 rounded-lg">
                <Activity className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Actividad Reciente</h3>
                <p className="text-gray-400 mb-3">
                  {stats.recentOrders} órdenes en los últimos 7 días
                </p>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="text-green-400 hover:text-green-300 font-semibold text-sm"
                >
                  Ver órdenes →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/products/new')}
              className="p-6 bg-zinc-950 border-2 border-green-400/20 hover:border-green-400/60 rounded-xl transition-all text-left group"
            >
              <Package className="text-green-400 mb-3" size={32} />
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-green-400 transition-colors">
                Nuevo Producto
              </h3>
              <p className="text-gray-400 text-sm">Agregar producto al catálogo</p>
            </button>

            <button
              onClick={() => navigate('/admin/categories')}
              className="p-6 bg-zinc-950 border-2 border-green-400/20 hover:border-green-400/60 rounded-xl transition-all text-left group"
            >
              <TrendingUp className="text-blue-400 mb-3" size={32} />
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                Gestionar Categorías
              </h3>
              <p className="text-gray-400 text-sm">Organizar tu catálogo</p>
            </button>

            <button
              onClick={() => navigate('/admin/orders')}
              className="p-6 bg-zinc-950 border-2 border-green-400/20 hover:border-green-400/60 rounded-xl transition-all text-left group"
            >
              <ShoppingCart className="text-purple-400 mb-3" size={32} />
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-purple-400 transition-colors">
                Ver Órdenes
              </h3>
              <p className="text-gray-400 text-sm">Gestionar pedidos</p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard