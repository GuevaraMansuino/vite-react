import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black border-t border-green-400/30 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-400/50">
                <span className="text-black font-bold text-2xl">NT</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                NeonThreads
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Moda urbana con estilo neón para los que se atreven a brillar en la oscuridad.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">COMPRAR</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-green-400 transition-colors">Hombre</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Mujer</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Accesorios</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Sale</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">AYUDA</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-green-400 transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Envíos</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Devoluciones</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">NEWSLETTER</h3>
            <p className="text-gray-400 text-sm mb-4">Recibe ofertas exclusivas</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 bg-zinc-950 border border-green-400/30 rounded-lg text-white text-sm focus:outline-none focus:border-green-400 transition-colors"
              />
              <button className="px-5 py-3 bg-gradient-to-r from-green-400 to-emerald-600 text-black font-bold rounded-lg hover:from-green-500 hover:to-emerald-700 transition-all shadow-lg shadow-green-400/30">
                →
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-green-400/20 text-center text-gray-500 text-sm">
          © 2025 NeonThreads. Todos los derechos reservados. | Diseño con 💚 para la comunidad urbana
        </div>
      </div>
    </footer>
  )
}

export default Footer