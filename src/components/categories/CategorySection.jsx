import React from 'react'

const CategorySection = () => {
  const categories = [
    { 
      name: 'Hombre', 
      icon: '👔', 
      count: '156 productos',
      gradient: 'from-blue-500/10 to-cyan-500/10'
    },
    { 
      name: 'Mujer', 
      icon: '👗', 
      count: '243 productos',
      gradient: 'from-pink-500/10 to-purple-500/10'
    },
    { 
      name: 'Accesorios', 
      icon: '👜', 
      count: '89 productos',
      gradient: 'from-yellow-500/10 to-orange-500/10'
    },
    { 
      name: 'Zapatos', 
      icon: '👟', 
      count: '127 productos',
      gradient: 'from-green-500/10 to-emerald-500/10'
    },
  ]

  return (
    <div className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-white mb-2">CATEGORÍAS</h2>
          <p className="text-gray-400">Explora nuestra colección por categoría</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="relative p-8 bg-zinc-950 rounded-2xl border-2 border-green-400/20 hover:border-green-400/60 transition-all hover:shadow-2xl hover:shadow-green-400/30 group overflow-hidden"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <div className="text-white font-bold text-xl group-hover:text-green-400 transition-colors mb-1">
                  {cat.name}
                </div>
                <div className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">
                  {cat.count}
                </div>
              </div>

              {/* Hover Border Animation */}
              <div className="absolute inset-0 border-2 border-green-400 rounded-2xl opacity-0 group-hover:opacity-20 animate-pulse"></div>
            </button>
          ))}
        </div>

        {/* View All Categories */}
        <div className="mt-10 text-center">
          <button className="text-green-400 font-semibold hover:text-green-300 transition-colors flex items-center gap-2 mx-auto">
            Ver todas las categorías
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategorySection