import React, { useState } from 'react'
import { ShoppingCart, User, Search, Menu, X, Home, Package, TrendingUp, Heart } from 'lucide-react'
import { useCart } from '../../hook/UseCart'
import { useAuth } from '../../hook/UseAuth'

const Navbar = () => {
  const { itemCount, setIsOpen } = useCart()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-green-400/30 shadow-lg shadow-green-400/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-400/50">
              <span className="text-black font-bold text-xl">NT</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              NeonThreads
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink icon={<Home size={18} />} text="Inicio" />
            <NavLink icon={<Package size={18} />} text="Productos" />
            <NavLink icon={<TrendingUp size={18} />} text="Novedades" />
            <NavLink icon={<Heart size={18} />} text="Favoritos" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
              <User size={20} />
            </button>
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
            <MobileNavLink icon={<Home size={18} />} text="Inicio" />
            <MobileNavLink icon={<Package size={18} />} text="Productos" />
            <MobileNavLink icon={<TrendingUp size={18} />} text="Novedades" />
            <MobileNavLink icon={<Heart size={18} />} text="Favoritos" />
          </div>
        </div>
      )}
    </nav>
  )
}

const NavLink = ({ icon, text }) => (
  <button className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors font-medium">
    {icon}
    <span>{text}</span>
  </button>
)

const MobileNavLink = ({ icon, text }) => (
  <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-green-400 hover:bg-zinc-800/50 rounded-lg transition-all">
    {icon}
    <span>{text}</span>
  </button>
)

export default Navbar