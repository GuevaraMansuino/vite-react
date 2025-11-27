import React from 'react'
import { ShoppingCart, Heart, Star, Package } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useToast } from '../../hooks/useToast'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const handleAddToCart = () => {
    if (product.stock === 0) {
      showToast('Producto agotado', 'error')
      return
    }
    addToCart(product)
    showToast(`${product.name} agregado al carrito`, 'success')
  }

  return (
    <div className="group bg-black rounded-xl overflow-hidden border border-green-400/20 hover:border-green-400/60 transition-all hover:shadow-2xl hover:shadow-green-400/30 hover:-translate-y-2 duration-300">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Package size={80} className="text-green-400/20" />
        </div>

        {/* Badges */}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-4 left-4 px-4 py-2 bg-orange-500 text-black text-sm font-bold rounded-lg shadow-lg">
            ¡ÚLTIMAS {product.stock} UNIDADES!
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <span className="text-red-400 font-bold text-2xl tracking-wider">AGOTADO</span>
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 p-3 bg-black/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-400 hover:bg-green-400/10 transition-all opacity-0 group-hover:opacity-100 border border-green-400/20">
          <Heart size={22} />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
          <button className="px-6 py-2 bg-green-400/20 backdrop-blur-md border border-green-400/50 text-green-400 font-semibold rounded-lg hover:bg-green-400/30 transition-colors">
            Vista Rápida
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 bg-zinc-950">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-xs text-green-400 font-semibold tracking-wider uppercase mb-2">
              {product.category}
            </div>
            <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 leading-tight group-hover:text-green-400 transition-colors">
              {product.name}
            </h3>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">(24 reseñas)</span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-3xl font-black text-green-400">${product.price}</div>
            <div className="text-xs text-gray-500 mt-1">
              Stock: <span className={product.stock > 0 ? 'text-green-400 font-semibold' : 'text-red-400'}>
                {product.stock > 0 ? product.stock : 'Agotado'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 disabled:from-zinc-800 disabled:to-zinc-900 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 hover:shadow-green-400/70 disabled:shadow-none disabled:text-gray-600 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={20} />
          <span>{product.stock > 0 ? 'AGREGAR AL CARRITO' : 'AGOTADO'}</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard