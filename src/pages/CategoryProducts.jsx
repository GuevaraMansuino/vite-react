import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProducts } from '../api/productApi'
import { getCategories } from '../api/categoryApi'
import ProductCard from '../components/products/ProductCard'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import CartDrawer from '../components/cart/CartDrawer'

const CategoryProducts = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load all products and filter by category on frontend
        const allProducts = await getProducts(0, 1000) // Get a large number to ensure we have all products
        const filteredProducts = allProducts.filter(product => {
          // Handle different ways the category_id might be stored
          const productCategoryId = product.category_id || (product.category && typeof product.category === 'object' ? product.category.id : product.category)
          return productCategoryId == categoryId // Use loose equality to handle string/number comparison
        })
        setProducts(filteredProducts)

        // Load all categories and find the matching one
        try {
          const allCategories = await getCategories()
          const matchingCategory = allCategories.find(cat =>
            (cat.id_key || cat.id) == categoryId // Use loose equality
          )

          if (matchingCategory) {
            setCategory({
              name: matchingCategory.name,
              id: matchingCategory.id_key || matchingCategory.id
            })
          } else {
            // Fallback if category not found
            setCategory({ name: `Categoría ${categoryId}`, id: categoryId })
          }
        } catch (categoryErr) {
          console.warn('Could not load category details:', categoryErr)
          // Set a fallback category name
          setCategory({ name: `Categoría ${categoryId}`, id: categoryId })
        }

      } catch (err) {
        console.error('Error loading category products:', err)
        setError('Error al cargar los productos de la categoría')
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      loadCategoryAndProducts()
    }
  }, [categoryId])

  // Scroll to top when component mounts or category changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [categoryId])

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

            {category && (
              <div>
                <h1 className="text-4xl font-black text-white mb-2">
                  {category.name}
                </h1>
                <p className="text-gray-400">
                  {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
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
                    No hay productos en esta categoría
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    Explorar otras categorías
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id_key || product.id}
                      product={product}
                      onClick={() => handleProductClick(product.id_key || product.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}

export default CategoryProducts
