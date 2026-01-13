import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, X } from 'lucide-react'

const Hero = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="relative h-[600px] bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyYzU1ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none" />

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 text-sm font-semibold mb-6 backdrop-blur-sm">
            <Sparkles size={16} />
            <span>Nueva Colección 2025</span>
          </div>

          {/* Title */}
          <h1 className="text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent drop-shadow-2xl">
              BIENVENIDO A
            </span>
            <br />
            <span className="text-white">G-STORE !!</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
            Descubre nuestra nueva colección de ropa urbana con diseños únicos, lo ultimo en moda para salir Fachero en todas las fotos. 
            <span className="text-green-400 font-semibold"> Vestite Fachero Vestite con G-Store.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 z-20">
            <button
              onClick={() => navigate('/products')}
              className="group px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-black rounded-lg transition-all shadow-2xl shadow-green-400/50 hover:shadow-green-400/70 text-lg flex items-center gap-2 pointer-events-auto"
            >
              <span>VER COLECCIÓN</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => setShowModal(true)}
              className="px-10 py-5 bg-black/80 backdrop-blur-sm border-2 border-green-400/40 hover:border-green-400/80 text-white font-black rounded-lg transition-all hover:bg-green-400/10 text-lg pointer-events-auto"
            >
              MÁS INFO
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

      {/* Info Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-zinc-950 border-2 border-green-400/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl shadow-green-400/20 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-green-400 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-black text-white mb-6">
              LA LEYENDA DE <span className="text-green-400">G-STORE</span>
            </h2>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p className="text-lg font-medium text-white">
                Descubre nuestra nueva colección de ropa urbana con diseños únicos, lo último en moda para salir Fachero en todas las fotos. 
                <span className="text-green-400"> Vestite Fachero, Vestite con G-Store.</span>
              </p>
              
              <div className="p-4 bg-green-400/5 rounded-lg border border-green-400/10 mt-4">
                <h3 className="text-green-400 font-bold mb-2">El Origen de la Facha</h3>
                <p className="text-sm italic">
                  "Todo comenzó una noche de 2024, cuando nuestro fundador se cansó de ser un NPC en la vida real. Harto de la ropa aburrida que te hace invisible en el boliche, tuvo una visión entre sueños (probablemente por comer pizza fría antes de dormir): crear ropa que no solo te vista, sino que te de +100 de Carisma. Así nació G-Store, forjada en las profundidades del estilo urbano para que nunca más tengas que usar filtros en Instagram. Porque la verdadera facha no se compra... bueno, en realidad sí, acá mismo."
                </p>
              </div>
            </div>

            <button 
              onClick={() => { setShowModal(false); navigate('/products'); }}
              className="w-full mt-8 py-4 bg-gradient-to-r from-green-400 to-emerald-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-green-400/40 transition-all"
            >
              IR A BUSCAR MI OUTFIT
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Hero