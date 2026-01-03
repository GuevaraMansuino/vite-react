import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  LogOut, Menu, X, ChevronRight, TrendingUp,
  Home
} from 'lucide-react'
import { useAuth } from '../../hook/UseAuth'
import { useToast } from '../../hook/UseToast'

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const { showToast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    localStorage.removeItem('isAdmin')
    showToast('Sesión cerrada', 'info')
    navigate('/admin/login')
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: Package,
      label: 'Productos',
      path: '/admin/products',
    },
    {
      icon: TrendingUp,
      label: 'Categorías',
      path: '/admin/categories',
    },
    {
      icon: ShoppingCart,
      label: 'Órdenes',
      path: '/admin/orders',
    },
    {
      icon: Users,
      label: 'Clientes',
      path: '/admin/clients',
    },
  ]

  const MenuItem = ({ icon: Icon, label, path }) => {
    const isActive = location.pathname === path
    
    return (
      <button
        onClick={() => {
          navigate(path)
          setSidebarOpen(false)
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
            ? 'bg-green-400/20 text-green-400 border-l-4 border-green-400'
            : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
        {isActive && <ChevronRight size={16} className="ml-auto" />}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-green-400/30 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-green-400/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-400/50">
              <span className="text-black font-bold text-xl">GS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">G-Store</h1>
              <p className="text-xs text-gray-400">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <MenuItem key={item.path} {...item} />
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-400/30 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all"
          >
            <Home size={20} />
            <span className="font-medium">Ir a la Tienda</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-green-400/30 shadow-lg shadow-green-400/10">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">Administrador</p>
                <p className="text-xs text-gray-400">admin@G-Store.com</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center font-bold text-black">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout