import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../../api/categoryApi'

const CategorySection = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Default gradients for categories
  const gradients = [
    'from-blue-500/10 to-cyan-500/10',
    'from-pink-500/10 to-purple-500/10',
    'from-yellow-500/10 to-orange-500/10',
    'from-green-500/10 to-emerald-500/10',
    'from-purple-500/10 to-indigo-500/10',
    'from-red-500/10 to-pink-500/10'
  ]

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const data = await getCategories()
        // Map backend data to frontend format
        const mappedCategories = data.map((cat, index) => ({
          id: cat.id_key || cat.id,
          name: cat.name,
          count: 'Ver productos', // Placeholder since backend doesn't provide count
          gradient: gradients[index % gradients.length] // Cycle through gradients
        }))
        setCategories(mappedCategories)
      } catch (err) {
        console.error('Error loading categories:', err)
        setError('Error al cargar categorías')
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return (
    <div className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="mb-10">
          <h2 className="text-4xl font-black text-white mb-2">CATEGORÍAS</h2>
          <p className="text-gray-400">Explora nuestra colección por categoría</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-green-400 text-lg">Cargando categorías...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-400 text-lg">{error}</div>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="relative flex-shrink-0 w-64 p-8 bg-zinc-950 rounded-2xl border-2 border-green-400/20 hover:border-green-400/60 transition-all hover:shadow-2xl hover:shadow-green-400/30 group overflow-hidden"
              >

                {/* Fondo gradiente */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                <div className="relative z-10 flex flex-col items-center">

                  {/* ICONO */}
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 text-6xl flex items-center justify-center">

                    {/* Si es string y contiene "/" = es imagen */}
                    {typeof cat.icon === "string" && cat.icon.includes("/") ? (
                      <img
                        src={cat.icon}
                        alt={cat.name}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <span>{cat.icon}</span>
                    )}

                  </div>

                  {/* Texto */}
                  <div className="text-white font-bold text-xl group-hover:text-green-400 transition-colors mb-1">
                    {cat.name}
                  </div>
                  <div className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">
                    {cat.count}
                  </div>
                </div>

                {/* Borde animado */}
                <div className="absolute inset-0 border-2 border-green-400 rounded-2xl opacity-0 group-hover:opacity-20 animate-pulse"></div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button className="text-green-400 font-semibold hover:text-green-300 transition-colors flex items-center gap-2 mx-auto">
            Ver todas las categorías <span className="text-xl">→</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default CategorySection
