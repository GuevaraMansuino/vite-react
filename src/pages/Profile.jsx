import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, Phone, MapPin, Plus,
  Trash2, Shield, Package, Edit
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import CartDrawer from '../components/cart/CartDrawer'
import { useAuth } from '../hook/UseAuth'
import { useToast } from '../hook/UseToast'
import { getClientById, getClientAddresses, createAddress, updateAddress, deleteAddress, updateClient } from '../api/clientApi'
import { getOrdersByClient } from '../api/orderApi'

const Profile = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()

  const [profileData, setProfileData] = useState({
    name: '',
    lastname: '',
    email: '',
    telephone: ''
  })

  const [addresses, setAddresses] = useState([])
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    favoriteProducts: 0,
    memberSince: ''
  })

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [addressForm, setAddressForm] = useState({
    street: '',
    number: '',
    city: '',
    isDefault: false
  })

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    lastname: '',
    email: '',
    telephone: ''
  })

  useEffect(() => {
    if (!user) {
      window.location.reload()
      return
    }
    loadUserData()
  }, [user])

  useEffect(() => {
    if (editingAddress) {
      setAddressForm({
        street: editingAddress.street || '',
        number: editingAddress.number || '',
        city: editingAddress.city || '',
        isDefault: editingAddress.isDefault || false
      })
      setShowAddressModal(true)
    }
  }, [editingAddress])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const userId = user.id_key || user.id
      if (userId) {
        // Fetch user profile data
        const userData = await getClientById(userId)
        setProfileData({
          name: userData.name || '',
          lastname: userData.lastname || '',
          email: userData.email || '',
          telephone: userData.telephone || ''
        })

        // Fetch user addresses
        const userAddresses = await getClientAddresses(userId)
        setAddresses(userAddresses || [])

        // Fetch user statistics
        const userOrders = await getOrdersByClient(userId)
        setStatistics({
          totalOrders: userOrders.length || 0,
          favoriteProducts: 0, // TODO: Implement favorites API
          memberSince: userData.created_at ? new Date(userData.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long'
          }) : 'N/A'
        })

        // Set recent orders (last 3)
        setRecentOrders(userOrders.slice(0, 3))
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error)
      showError('Error al cargar los datos del perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAddress = async () => {
    try {
      const userId = user.id_key || user.id
      const addressData = {
        ...addressForm,
        client_id: userId
      }

      if (editingAddress) {
        // Update existing address
        await updateAddress(editingAddress.id, addressData)
        setAddresses(addresses.map(addr =>
          addr.id === editingAddress.id ? { ...addr, ...addressData } : addr
        ))
      } else {
        // Create new address
        const createData = {
          street: addressForm.street,
          number: addressForm.number,
          city: addressForm.city,
          isDefault: addressForm.isDefault,
          client_id: userId
        }
        const newAddress = await createAddress(createData)
        setAddresses([...addresses, newAddress])
      }

      // Reset form and close modal
      setShowAddressModal(false)
      setEditingAddress(null)
      setAddressForm({ street: '', number: '', city: '', isDefault: false })
    } catch (error) {
      console.error('Error guardando dirección:', error)
      showError('Error al guardar la dirección')
    }
  }

  const handleSaveProfile = async () => {
    try {
      const userId = user.id_key || user.id
      await updateClient(userId, profileForm)
      setProfileData(profileForm)
      setIsEditingProfile(false)
      showSuccess('Perfil actualizado exitosamente')
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      showError('Error al actualizar el perfil')
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando perfil...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2">MI PERFIL</h1>
            <p className="text-gray-400">Gestiona tu información personal</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Avatar Card */}
              <div className="bg-zinc-950 rounded-xl border-2 border-green-400/30 p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-black font-bold text-3xl shadow-lg shadow-green-400/50">
                      {profileData.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {profileData.name} {profileData.lastname}
                  </h3>
                  <p className="text-gray-400 text-sm">{profileData.email}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-zinc-950 rounded-xl border-2 border-green-400/30 p-6 space-y-4">
                <h3 className="font-bold text-white mb-4">Estadísticas</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Órdenes totales:</span>
                  <span className="text-white font-bold">{statistics.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Productos favoritos:</span>
                  <span className="text-white font-bold">{statistics.favoriteProducts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Miembro desde:</span>
                  <span className="text-white font-bold">{statistics.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-zinc-950 rounded-xl border-2 border-green-400/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white">Información Personal</h2>
                  <button
                    onClick={() => {
                      if (isEditingProfile) {
                        // Cancel editing
                        setIsEditingProfile(false)
                        setProfileForm({
                          name: profileData.name || '',
                          lastname: profileData.lastname || '',
                          email: profileData.email || '',
                          telephone: profileData.telephone || ''
                        })
                      } else {
                        // Start editing
                        setIsEditingProfile(true)
                        setProfileForm({
                          name: profileData.name || '',
                          lastname: profileData.lastname || '',
                          email: profileData.email || '',
                          telephone: profileData.telephone || ''
                        })
                      }
                    }}
                    className="px-4 py-2 bg-green-400/20 border border-green-400/40 text-green-400 rounded-lg hover:bg-green-400/30 transition-colors flex items-center gap-2"
                  >
                    <Edit size={18} />
                    <span>{isEditingProfile ? 'Cancelar' : 'Editar'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Nombre
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                          placeholder="Ingresa tu nombre"
                        />
                      ) : (
                        <div className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white">
                          {profileData.name || 'No especificado'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lastname */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Apellido
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.lastname}
                          onChange={(e) => setProfileForm({ ...profileForm, lastname: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                          placeholder="Ingresa tu apellido"
                        />
                      ) : (
                        <div className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white">
                          {profileData.lastname || 'No especificado'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                          placeholder="Ingresa tu email"
                        />
                      ) : (
                        <div className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white">
                          {profileData.email || 'No especificado'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileForm.telephone}
                          onChange={(e) => setProfileForm({ ...profileForm, telephone: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                          placeholder="Ingresa tu teléfono"
                        />
                      ) : (
                        <div className="w-full pl-12 pr-4 py-3 bg-black border border-green-400/30 rounded-lg text-white">
                          {profileData.telephone || 'No especificado'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setIsEditingProfile(false)
                        setProfileForm({
                          name: profileData.name || '',
                          lastname: profileData.lastname || '',
                          email: profileData.email || '',
                          telephone: profileData.telephone || ''
                        })
                      }}
                      className="flex-1 py-3 bg-zinc-900 border border-green-400/30 text-gray-300 rounded-lg hover:border-green-400/60 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>

              {/* Addresses */}
              <div className="bg-zinc-950 rounded-xl border-2 border-green-400/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white">Mis Direcciones</h2>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2 bg-green-400/20 border border-green-400/40 text-green-400 rounded-lg hover:bg-green-400/30 transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    <span>Agregar</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map(address => (
                    <div
                      key={address.id}
                      className="p-4 bg-black border-2 border-green-400/20 rounded-lg hover:border-green-400/40 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <MapPin className="text-green-400 mt-1" size={20} />
                          <div>
                            <p className="text-white font-semibold">
                              {address.street} {address.number}
                            </p>
                            <p className="text-gray-400 text-sm">{address.city}</p>
                            {address.isDefault && (
                              <span className="inline-block mt-2 px-2 py-1 bg-green-400/20 text-green-400 text-xs font-bold rounded">
                                PREDETERMINADA
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!address.isDefault && (
                            <button
                              onClick={() => setAddresses(addresses.map(addr => ({
                                ...addr,
                                isDefault: addr.id === address.id
                              })))}
                              className="p-2 text-green-400 hover:bg-green-400/10 rounded transition-colors"
                              title="Establecer como predeterminada"
                            >
                              <Shield size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => setEditingAddress(address)}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setAddresses(addresses.filter(addr => addr.id !== address.id))}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders */}
              <div className="bg-zinc-950 rounded-xl border-2 border-green-400/30 p-6">
                <h2 className="text-2xl font-black text-white mb-6">Mis Órdenes</h2>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full p-4 bg-black border-2 border-green-400/20 hover:border-green-400/40 rounded-lg text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold group-hover:text-green-400 transition-colors">
                        Ver Todas las Órdenes
                      </p>
                      <p className="text-gray-400 text-sm">Historial completo de tus compras</p>
                    </div>
                    <Package className="text-gray-400 group-hover:text-green-400" size={20} />
                  </div>
                </button>
              </div>

              {/* Security */}
              <div className="bg-zinc-950 rounded-xl border-2 border-green-400/30 p-6">
                <h2 className="text-2xl font-black text-white mb-6">Seguridad</h2>
                <button className="w-full p-4 bg-black border-2 border-green-400/20 hover:border-green-400/40 rounded-lg text-left transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold group-hover:text-green-400 transition-colors">
                        Cambiar Contraseña
                      </p>
                      <p className="text-gray-400 text-sm">Última actualización: hace 3 meses</p>
                    </div>
                    <Edit size={18} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-950 border-2 border-green-400/30 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingAddress ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
            </h3>

            <div className="space-y-4">
              {/* Street */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Calle
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="Ej: Av. Principal"
                />
              </div>

              {/* Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  value={addressForm.number}
                  onChange={(e) => setAddressForm({ ...addressForm, number: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="Ej: 123"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="Ej: Buenos Aires"
                />
              </div>

              {/* Default Address */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="w-4 h-4 text-green-400 bg-black border-green-400/30 rounded focus:ring-green-400 focus:ring-2"
                />
                <label htmlFor="isDefault" className="text-sm font-semibold text-gray-300">
                  Establecer como dirección predeterminada
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddressModal(false)
                  setEditingAddress(null)
                  setAddressForm({ street: '', number: '', city: '', isDefault: false })
                }}
                className="flex-1 py-3 bg-zinc-900 border border-green-400/30 text-gray-300 rounded-lg hover:border-green-400/60 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-1 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all"
              >
                {editingAddress ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile
