import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hook/UseAuth'
import { useToast } from '../../hook/UseToast'

const AdminLogin = () => {
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
      // Por ahora, validación simple
      // TODO: Implementar autenticación real con el backend
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@G-Store.com'
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

      if (formData.email === adminEmail && formData.password === adminPassword) {
        const adminUser = {
          id: 1,
          email: formData.email,
          name: 'Administrador',
          role: 'admin'
        }
        
        login(adminUser)
        localStorage.setItem('isAdmin', 'true')
        showToast('¡Bienvenido, Administrador!', 'success')
        navigate('/admin/dashboard')
      } else {
        showError('Credenciales incorrectas')
      }
    } catch (error) {
      console.error('Error en login:', error)
      showError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-zinc-950 rounded-2xl border-2 border-green-400/30 shadow-2xl shadow-green-400/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl mb-4 shadow-lg shadow-green-400/50">
              <ShieldCheck size={32} className="text-black" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">
              PANEL DE <span className="text-green-400">ADMIN</span>
            </h1>
            <p className="text-gray-400">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@G-Store.com"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 hover:shadow-green-400/70 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Ingresando...</span>
                </>
              ) : (
                <>
                  <Lock size={20} />
                  <span>INGRESAR</span>
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              <span className="text-green-400 font-semibold">Demo:</span> admin@G-Store.com / admin123
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-green-400 text-sm transition-colors"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin