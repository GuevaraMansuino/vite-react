import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, Filter, X, SlidersHorizontal } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import CartDrawer from '../components/cart/CartDrawer'
import ProductCard from '../components/products/ProductCard'
import { getProducts } from '../api/productApi'
import { getCategories } from '../api/categoryApi'
import { useToast } from '../hook/UseToast'

const Search = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { showError } = useToast()
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState('newest')
  const [onlyInStock, setOnlyInStock] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchTerm(query)
      performSearch(query)
    }
  }, [searchParams])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error cargando categorías:', error)
    }
  }

  const performSearch = async (query) => {
    if (!query.trim()) {
      setProducts([])
      return
    }

    try {
      setLoading(true)
      const allProducts = await getProducts(0, 1000)
      
      // Filtrar por término de búsqueda
      let filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )

      // Aplicar filtros adicionales
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category_id === parseInt(selectedCategory))
      }

      if (onlyInStock) {
        filtered = filtered.filter(p => p.stock > 0)
      }

      filtered = filtered.filter(p => 
        p.price >= priceRange[0] && p.price <= priceRange[1]
      )

      // Ordenar
      switch (sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        default: // newest
          filtered.sort((a, b) => b.id_key - a.id_key)
      }

      setProducts(filtered)
    } catch (error) {
      console.error('Error en búsqueda:', error)
      showError('Error al buscar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm })
      performSearch(searchTerm)
    }
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange([0, 10000])
    setSortBy('newest')
    setOnlyInStock(false)
    performSearch(searchTerm)
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-14 pr-32 py-5 bg-zinc-950 border-2 border-green-400/30 rounded-xl text-white text-lg placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* Results Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">
                {searchTerm ? (
                  <>
                    Resultados para: <span className="text-green-400">"{searchTerm}"</span>
                  </>
                ) : (
                  'Buscar Productos'
                )}
              </h1>
              <p className="text-gray-400">
                {loading ? 'Buscando...' : `${products.length} productos encontrados`}
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-zinc-950 border-2 border-green-400/30 hover:border-green-400/60 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <SlidersHorizontal size={20} />
              <span className="font-semibold">Filtros</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'} space-y-6`}>
              <div className="bg-zinc-950 rounded-xl border-2 border-green-400/30 p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Filtros</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-green-400 hover:text-green-300"
                  >
                    Limpiar
                  </button>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-white font-semibold mb-3">Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      performSearch(searchTerm)
                    }}
                    className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                  >
                    <option value="">Todas</option>
                    {categories.map(cat => (
                      <option key={cat.id_key} value={cat.id_key}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Rango de Precio: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([0, parseInt(e.target.value)])
                      performSearch(searchTerm)
                    }}
                    className="w-full accent-green-400"
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-white font-semibold mb-3">Ordenar por</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      performSearch(searchTerm)
                    }}
                    className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="name">Nombre A-Z</option>
                  </select>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => {
                        setOnlyInStock(e.target.checked)
                        performSearch(searchTerm)
                      }}
                      className="w-5 h-5 rounded border-green-400/30 bg-black text-green-400 focus:ring-green-400 focus:ring-offset-0"
                    />
                    <span className="text-white font-semibold">Solo con stock</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Buscando productos...</p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <SearchIcon size={64} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No se encontraron resultados</h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm 
                      ? `No encontramos productos que coincidan con "${searchTerm}"`
                      : 'Intenta buscar algo'}
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all"
                  >
                    Ver todos los productos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id_key} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Search