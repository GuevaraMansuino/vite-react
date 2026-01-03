import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { WishlistContext } from '../context/WishlistContext'
import ProductCard from '../components/products/ProductCard'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import CartDrawer from '../components/cart/CartDrawer'

const Wishlist = () => {
  const navigate = useNavigate()
  const { wishlist, removeFromWishlist, clearWishlist, isLoading } = useContext(WishlistContext)

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="min-h-screen bg-black pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="text-green-400 hover:text-green-300 transition-colors mb-4 flex items-center gap-2"
            >
              ← Volver al inicio
            </button>

            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                MIS FAVORITOS
              </h1>
              <p className="text-gray-400">
                Tus productos favoritos guardados
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-green-400 text-lg">Cargando favoritos...</div>
            </div>
          )}

          {/* Wishlist Content */}
          {!isLoading && (
            <>
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-4">
                    No tienes productos en favoritos
                  </div>
                  <button
                    onClick={() => navigate('/products')}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    Explorar productos
                  </button>
                </div>
              ) : (
                <>
                  {/* Clear All Button */}
                  <div className="mb-6 text-right">
                    <button
                      onClick={clearWishlist}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
                    >
                      Limpiar todos los favoritos
                    </button>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                      <div key={product.id_key || product.id} className="relative">
                        <ProductCard
                          product={product}
                          onClick={() => handleProductClick(product.id_key || product.id)}
                        />

                        {/* Remove from wishlist button */}
                        <button
                          onClick={() => removeFromWishlist(product.id_key || product.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
                          title="Remover de favoritos"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}

export default Wishlist
