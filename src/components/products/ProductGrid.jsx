import React, { useState, useEffect } from 'react'
import { Grid, List, Filter } from 'lucide-react'
import ProductCard from './ProductCard'
import { getProducts } from '../../api/productApi'

const ProductGrid = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        console.log('Productos recibidos:', data)
        console.log('Tipo de data:', typeof data)
        console.log('Es array?', Array.isArray(data))
        if (Array.isArray(data) && data.length > 0) {
          console.log('Primer producto:', data[0])
        }

        // Datos de prueba temporales
        const mockProducts = [
          {
            id_key: 1,
            name: 'Producto de Prueba',
            description: 'Esta es una descripción de prueba',
            price: 99.99,
            stock: 10,
            category: { id: 1, name: 'Categoría de Prueba' }
          }
        ]

        // Usar datos reales si existen, sino usar mock
        const productsToUse = (Array.isArray(data) && data.length > 0) ? data : mockProducts
        setProducts(productsToUse)
        setLoading(false)
      } catch (err) {
        setError('Error al cargar productos')
        setLoading(false)
        console.error('Error fetching products:', err)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black text-white mb-2">PRODUCTOS DESTACADOS</h2>
            <p className="text-gray-400">Descubre nuestra colección más vendida</p>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-green-400 text-lg">Cargando productos...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-400 text-lg">{error}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id_key} product={product} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="px-10 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-lg transition-all border-2 border-green-400/30 hover:border-green-400/60">
            CARGAR MÁS PRODUCTOS
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductGrid