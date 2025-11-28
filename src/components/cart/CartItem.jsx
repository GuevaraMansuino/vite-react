import React from 'react'
import { Minus, Plus, Trash2, Package } from 'lucide-react'
import { useCart } from '../../hook/useCart'
import { useToast } from '../../hook/useToast'

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart()
  const { showToast } = useToast()

  const handleRemove = () => {
    removeFromCart(item.id_key)
    showToast('Producto eliminado del carrito', 'info')
  }

  const handleIncrement = () => {
    if (item.quantity >= item.stock) {
      showToast('No hay más stock disponible', 'error')
      return
    }
    updateQuantity(item.id_key, item.quantity + 1)
  }

  const handleDecrement = () => {
    updateQuantity(item.id_key, item.quantity - 1)
  }

  return (
    <div className="bg-zinc-900/80 rounded-lg p-4 border border-green-400/20 hover:border-green-400/40 transition-all">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-black rounded-lg flex items-center justify-center flex-shrink-0">
          <Package size={32} className="text-green-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1 truncate">{item.name}</h3>
          <p className="text-green-400 font-bold text-lg">${item.price.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Stock disponible: {item.stock}</p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleDecrement}
              className="w-8 h-8 bg-zinc-800 hover:bg-green-400/20 text-green-400 rounded flex items-center justify-center transition-colors border border-green-400/20"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-white font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= item.stock}
              className="w-8 h-8 bg-zinc-800 hover:bg-green-400/20 text-green-400 rounded flex items-center justify-center transition-colors border border-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={handleRemove}
              className="ml-auto p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Subtotal */}
      <div className="mt-3 pt-3 border-t border-green-400/10 flex items-center justify-between">
        <span className="text-sm text-gray-400">Subtotal:</span>
        <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  )
}

export default CartItem