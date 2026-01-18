import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hook/UseAuth'
import { useToast } from '../hook/UseToast'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast, showError } = useToast()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.email || !formData.password) {
        showError('Por favor completa todos los campos')
        return
      }

      // Buscar cliente por email en el backend
      const response = await fetch(
        `https://final2025python-gero.onrender.com/clients?skip=0&limit=100`
      )
      
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor')
      }

      const clients = await response.json()
      
      // Buscar el cliente que coincida con el email
      const client = clients.find(c => c.email === formData.email)
      
      if (!client) {
        showError('Usuario no encontrado')
        return
      }

      // TODO: Validar password cuando el backend tenga autenticación
      // Por ahora, cualquier password funciona

      // Limpiar flag de admin para usuarios regulares
      localStorage.removeItem('isAdmin')

      // Guardar usuario completo con ID
      const userData = {
        id_key: client.id_key || client.id,
        email: client.email,
        name: client.name,
        lastname: client.lastname,
        role: 'customer'
      }

      login(userData)
      showToast(`¡Bienvenido ${client.name}!`, 'success')
      navigate('/')
      
    } catch (error) {
      console.error('Error en login:', error)
      showError('Error al iniciar sesión. Verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyYzU1ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver a la tienda</span>
        </button>

        <div className="bg-zinc-950 rounded-2xl border-2 border-green-400/30 shadow-2xl shadow-green-400/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl mb-4 shadow-lg shadow-green-400/50">
              <span className="text-black font-bold text-2xl">GS</span>
            </div>
            
            <h1 className="text-3xl font-black text-white mb-2">
              INICIAR <span className="text-green-400">SESIÓN</span>
            </h1>
            <p className="text-gray-400">Ingresa a tu cuenta de G-Store</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-green-400/30 bg-black text-green-400 focus:ring-green-400 focus:ring-offset-0"
                />
                <span>Recordarme</span>
              </label>
              <button
                type="button"
                className="text-green-400 hover:text-green-300 font-semibold"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 hover:shadow-green-400/70 disabled:shadow-none flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Ingresando...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>INICIAR SESIÓN</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-green-400/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-950 text-gray-500">o continúa con</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="px-4 py-3 bg-black border border-green-400/30 hover:border-green-400/60 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="hidden sm:inline">Google</span>
            </button>
            <button className="px-4 py-3 bg-black border border-green-400/30 hover:border-green-400/60 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="hidden sm:inline">Facebook</span>
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link 
              to="/register" 
              className="text-green-400 hover:text-green-300 font-semibold"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Admin Link */}
        <div className="mt-4 text-center">
          <Link
            to="/admin/login"
            className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
          >
            ¿Eres administrador? Ingresa aquí
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login