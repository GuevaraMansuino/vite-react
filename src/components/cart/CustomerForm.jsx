import React, { useState } from 'react'
import { X, User, Mail, Phone } from 'lucide-react'
import { useToast } from '../../hook/UseToast'

const CustomerForm = ({ onSubmit, onCancel }) => {
  const { showToast, showError } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    telephone: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.name || !formData.lastname || !formData.email || !formData.telephone) {
      showError('Por favor completa todos los campos')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showError('Por favor ingresa un email válido')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting customer form:', error)
      showError('Error al procesar los datos del cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-zinc-950 rounded-xl border-2 border-green-400/40 p-6 max-w-md w-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-green-400/10 rounded-lg">
            <User className="text-green-400" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Datos del Cliente</h3>
            <p className="text-gray-400 text-sm">Completa tu información para finalizar la compra</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Nombre
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Juan"
                required
                className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
              />
            </div>
          </div>

          {/* Lastname */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Apellido
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Pérez"
                required
                className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
              />
            </div>
          </div>

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

          {/* Telephone */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+54 123456789"
                required
                className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Formato: +código país + número</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 hover:shadow-green-400/70 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>Finalizar Compra</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerForm
