import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X, Home, Package, TrendingUp, Heart, LogOut } from 'lucide-react'
import { useCart } from '../../hook/UseCart'
import { useAuth } from '../../hook/UseAuth'
import { useToast } from '../../hook/UseToast'

const Navbar = () => {
  const navigate = useNavigate()
  const { itemCount, setIsOpen } = useCart()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    showToast('Sesión cerrada', 'info')
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-green-400/30 shadow-lg shadow-green-400/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-400/50">
              <span className="text-black font-bold text-xl">GS</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              G-STORE
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink icon={<Home size={18} />} text="Inicio" onClick={() => navigate('/')} />
            <NavLink icon={<Package size={18} />} text="Productos" onClick={() => navigate('/products')} />
            <NavLink icon={<Heart size={18} />} text="Favoritos" onClick={() => navigate('/wishlist')} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
              <Search size={20} />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => user ? setUserMenuOpen(!userMenuOpen) : navigate('/login')}
                className="p-2 text-gray-400 hover:text-green-400 transition-colors"
              >
                <User size={20} />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && user && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-950 border-2 border-green-400/30 rounded-lg shadow-2xl shadow-green-400/20 py-2 z-20">
                    <div className="px-4 py-3 border-b border-green-400/20">
                      <p className="text-white font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        // Check if user is admin
                        const isAdmin = user.role === 'admin' || localStorage.getItem('isAdmin') === 'true'
                        navigate(isAdmin ? '/admin/dashboard' : '/profile')
                        setUserMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:text-green-400 hover:bg-zinc-900/50 transition-colors flex items-center gap-2"
                    >
                      <User size={16} />
                      <span>{user.role === 'admin' || localStorage.getItem('isAdmin') === 'true' ? 'Panel Admin' : 'Mi Perfil'}</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/orders')
                        setUserMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:text-green-400 hover:bg-zinc-900/50 transition-colors flex items-center gap-2"
                    >
                      <Package size={16} />
                      <span>Mis Órdenes</span>
                    </button>
                    <div className="border-t border-green-400/20 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-gray-400 hover:text-green-400 transition-colors"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-lg shadow-green-400/50">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-green-400"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-green-400/30">
          <div className="px-4 py-2 space-y-1">
            <MobileNavLink icon={<Home size={18} />} text="Inicio" onClick={() => { navigate('/'); setMobileMenuOpen(false) }} />
            <MobileNavLink icon={<Package size={18} />} text="Productos" onClick={() => { navigate('/products'); setMobileMenuOpen(false) }} />
            <MobileNavLink icon={<Heart size={18} />} text="Favoritos" onClick={() => { navigate('/wishlist'); setMobileMenuOpen(false) }} />
            
            {!user && (
              <>
                <div className="border-t border-green-400/20 my-2"></div>
                <MobileNavLink icon={<User size={18} />} text="Iniciar Sesión" onClick={() => { navigate('/login'); setMobileMenuOpen(false) }} />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

const NavLink = ({ icon, text, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors font-medium"
  >
    {icon}
    <span>{text}</span>
  </button>
)

const MobileNavLink = ({ icon, text, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-green-400 hover:bg-zinc-800/50 rounded-lg transition-all"
  >
    {icon}
    <span>{text}</span>
  </button>
)

export default Navbar