import React from 'react'
import { Grid, List, Filter } from 'lucide-react'
import ProductCard from './ProductCard'

const ProductGrid = () => {
  // Datos de ejemplo - Más adelante estos vendrán del backend
  const products = [
    { 
      id_key: 1, 
      name: 'Hoodie Cyber Black', 
      category: 'Hombre', 
      price: 89.99, 
      stock: 15,
      description: 'Hoodie urbano con detalles reflectivos'
    },
    { 
      id_key: 2, 
      name: 'T-Shirt Neon Vibes', 
      category: 'Mujer', 
      price: 45.99, 
      stock: 8,
      description: 'Remera con estampado neón exclusivo'
    },
    { 
      id_key: 3, 
      name: 'Jeans Dark Wash', 
      category: 'Hombre', 
      price: 129.99, 
      stock: 23,
      description: 'Jeans premium lavado oscuro'
    },
    { 
      id_key: 4, 
      name: 'Crop Top Holographic', 
      category: 'Mujer', 
      price: 39.99, 
      stock: 5,
      description: 'Crop top con efecto holográfico'
    },
    { 
      id_key: 5, 
      name: 'Bomber Jacket LED', 
      category: 'Hombre', 
      price: 199.99, 
      stock: 12,
      description: 'Campera bomber con luces LED integradas'
    },
    { 
      id_key: 6, 
      name: 'Dress Gradient Dream', 
      category: 'Mujer', 
      price: 149.99, 
      stock: 0,
      description: 'Vestido con degradado de colores'
    },
  ]

  return (
    <div className="py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black text-white mb-2">PRODUCTOS DESTACADOS</h2>
            <p className="text-gray-400">Descubre nuestra colección más vendida</p>
          </div>
          
          {/* Controls */}
          <div className="flex gap-3">
            <button className="p-3 bg-green-400/20 text-green-400 rounded-lg hover:bg-green-400/30 transition-colors border border-green-400/40">
              <Grid size={22} />
            </button>
            <button className="p-3 bg-zinc-900 text-gray-400 rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-800">
              <List size={22} />
            </button>
            <button className="px-5 py-3 bg-zinc-900 text-gray-300 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-2 border border-zinc-800 hover:border-green-400/30">
              <Filter size={20} />
              <span className="font-semibold">Filtros</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id_key} product={product} />
          ))}
        </div>

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