import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

const Hero = () => {
  return (
    <div className="relative h-[600px] bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyYzU1ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 text-sm font-semibold mb-6 backdrop-blur-sm">
            <Sparkles size={16} />
            <span>Nueva Colección 2025</span>
          </div>

          {/* Title */}
          <h1 className="text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent drop-shadow-2xl">
              ESTILO NEÓN
            </span>
            <br />
            <span className="text-white">PARA TU VIDA</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
            Descubre la nueva colección de ropa urbana con diseños únicos que brillan en la oscuridad. 
            <span className="text-green-400 font-semibold"> Viste con actitud.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="group px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-black rounded-lg transition-all shadow-2xl shadow-green-400/50 hover:shadow-green-400/70 text-lg flex items-center gap-2">
              <span>VER COLECCIÓN</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-10 py-5 bg-black/80 backdrop-blur-sm border-2 border-green-400/40 hover:border-green-400/80 text-white font-black rounded-lg transition-all hover:bg-green-400/10 text-lg">
              MÁS INFO
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12">
            <div>
              <div className="text-3xl font-black text-green-400">500+</div>
              <div className="text-sm text-gray-400">Productos</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-400">10k+</div>
              <div className="text-sm text-gray-400">Clientes</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-400">4.9★</div>
              <div className="text-sm text-gray-400">Valoración</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  )
}

export default Hero