import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../api/productApi'
import ProductCard from '../components/products/ProductCard'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import CartDrawer from '../components/cart/CartDrawer'

const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 12

  useEffect(() => {
    loadProducts()
  }, [])

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  const loadProducts = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setSkip(0)
        setProducts([])
      }

      const newSkip = reset ? 0 : skip
      const data = await getProducts(newSkip, limit)

      if (data.length < limit) {
        setHasMore(false)
      }

      // Ensure no duplicates by using a Map to track unique products
      setProducts(prev => {
        const existingProducts = reset ? [] : prev
        const productMap = new Map()

        // Add existing products to map
        existingProducts.forEach(product => {
          const productId = product.id_key || product.id
          productMap.set(productId, product)
        })

        // Add new products, overwriting any duplicates
        data.forEach(product => {
          const productId = product.id_key || product.id
          productMap.set(productId, product)
        })

        // Convert map back to array
        return Array.from(productMap.values())
      })
      setSkip(newSkip + limit)
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      loadProducts()
    }
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
                TODOS LOS PRODUCTOS
              </h1>
              <p className="text-gray-400">
                Explora nuestra colección completa de productos
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && products.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="text-green-400 text-lg">Cargando productos...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center py-12">
              <div className="text-red-400 text-lg">{error}</div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-4">
                    No hay productos disponibles
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    Volver al inicio
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id_key || product.id}
                        product={product}
                        onClick={() => handleProductClick(product.id_key || product.id)}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center">
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-8 py-3 bg-green-400/10 border border-green-400/30 text-green-400 rounded-lg hover:bg-green-400/20 hover:border-green-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Cargando...' : 'Cargar más productos'}
                      </button>
                    </div>
                  )}

                  {/* End of products message */}
                  {!hasMore && products.length > 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-sm">
                        Has visto todos los productos disponibles
                      </div>
                    </div>
                  )}
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

export default Products
