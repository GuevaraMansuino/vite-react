import React, { useState, useEffect } from 'react'
import { X, CreditCard, Truck, MapPin, Store, Car, User, Mail, Phone, Plus } from 'lucide-react'
import { useToast } from '../../hook/UseToast'
import { useAuth } from '../../hook/UseAuth'
import { DELIVERY_METHODS } from '../../api/orderApi'
import { getClientAddresses, createAddress } from '../../api/clientApi'

const CheckoutForm = ({ onSubmit, onCancel, total }) => {
  const { showToast, showError } = useToast()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    // Customer Info
    name: '',
    lastname: '',
    email: '',
    telephone: '',
    // Delivery Method
    delivery_method: DELIVERY_METHODS.ON_HAND,
    // Payment Method
    payment_method: 'cash',
    // Card Info (if credit card)
    card_number: '',
    card_expiry: '',
    card_cvv: '',
    card_holder: '',
    // Address
    selected_address_id: null,
    address: '',
    city: '',
    postal_code: ''
  })
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    postal_code: ''
  })

  // Auto-fill user data when logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        lastname: user.lastname || '',
        email: user.email || '',
        telephone: user.telephone || ''
      }))
    }
  }, [user])

  // Load addresses when delivery method is home delivery and user is logged in
  useEffect(() => {
    if (user && formData.delivery_method === DELIVERY_METHODS.HOME_DELIVERY) {
      loadAddresses()
    }
  }, [user, formData.delivery_method])

  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true)
      const userAddresses = await getClientAddresses(user.id_key || user.id)
      setAddresses(userAddresses)
    } catch (error) {
      console.error('Error loading addresses:', error)
      showError('Error al cargar las direcciones')
    } finally {
      setLoadingAddresses(false)
    }
  }

  const handleAddressSelect = (index) => {
    const selectedAddress = addresses[index]
    if (selectedAddress) {
      setFormData(prev => ({
        ...prev,
        selected_address_id: index,
        address: `${selectedAddress.street} ${selectedAddress.number}`,
        city: selectedAddress.city,
        postal_code: selectedAddress.postal_code
      }))
    }
  }

  const handleNewAddressSubmit = async (addressData) => {
    try {
      const newAddress = await createAddress({
        ...addressData,
        client_id: user.id_key
      })
      setAddresses(prev => [...prev, newAddress])
      setShowNewAddressForm(false)
      setNewAddress({ address: '', city: '', postal_code: '' })
      const newIndex = addresses.length // Index of the newly added address
      handleAddressSelect(newIndex)
      showToast('Dirección agregada correctamente', 'success')
    } catch (error) {
      console.error('Error creating address:', error)
      showError('Error al agregar la dirección')
    }
  }

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddNewAddress = () => {
    setShowNewAddressForm(true)
  }

  const handleCancelNewAddress = () => {
    setShowNewAddressForm(false)
    setNewAddress({ address: '', city: '', postal_code: '' })
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'radio') {
      // For radio buttons, convert string values to numbers for delivery_method
      const processedValue = name === 'delivery_method' ? parseInt(value) : value
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateForm = () => {
    // Customer info validation
    if (!formData.name || !formData.lastname || !formData.email || !formData.telephone) {
      showError('Por favor completa todos los campos de información personal')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showError('Por favor ingresa un email válido')
      return false
    }

    // Address validation for home delivery
    if (formData.delivery_method === DELIVERY_METHODS.HOME_DELIVERY) {
      if (formData.selected_address_id === null) {
        showError('Por favor selecciona una dirección de entrega')
        return false
      }
    }

    // Payment validation
    if (formData.payment_method === 'card') {
      if (!formData.card_number || !formData.card_expiry || !formData.card_cvv || !formData.card_holder) {
        showError('Por favor completa todos los datos de la tarjeta')
        return false
      }

      // Basic card number validation (16 digits)
      const cardNumber = formData.card_number.replace(/\s/g, '')
      if (!/^\d{16}$/.test(cardNumber)) {
        showError('Número de tarjeta inválido')
        return false
      }

      // Expiry validation (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(formData.card_expiry)) {
        showError('Fecha de expiración inválida (MM/YY)')
        return false
      }

      // CVV validation (3-4 digits)
      if (!/^\d{3,4}$/.test(formData.card_cvv)) {
        showError('CVV inválido')
        return false
      }
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
      console.error('Error submitting checkout form:', error)
      showError('Error al procesar los datos de compra')
    } finally {
      setLoading(false)
    }
  }

  const deliveryOptions = [
    {
      id: DELIVERY_METHODS.DRIVE_THRU,
      label: 'Drive Thru',
      description: 'Recoge tu pedido sin bajar del auto',
      icon: Car,
      color: 'text-blue-400'
    },
    {
      id: DELIVERY_METHODS.ON_HAND,
      label: 'Retiro en Tienda',
      description: 'Recoge tu pedido en el local',
      icon: Store,
      color: 'text-green-400'
    },
    {
      id: DELIVERY_METHODS.HOME_DELIVERY,
      label: 'Entrega a Domicilio',
      description: 'Te llevamos el pedido a tu casa',
      icon: MapPin,
      color: 'text-purple-400'
    }
  ]

  const paymentOptions = [
    {
      id: 'cash',
      label: 'Efectivo',
      description: 'Paga al recibir tu pedido',
      icon: '💵'
    },
    {
      id: 'card',
      label: 'Tarjeta de Crédito/Débito',
      description: 'Paga ahora con tu tarjeta',
      icon: '💳'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-zinc-950 rounded-xl border-2 border-green-400/40 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-green-400/10 rounded-lg">
            <CreditCard className="text-green-400" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-1">Finalizar Compra</h3>
            <p className="text-gray-400 text-sm">Completa los datos para procesar tu pedido</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-zinc-900/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User size={18} />
              Información Personal
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              {/* Lastname */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Pérez"
                  required
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              {/* Telephone */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+54 123456789"
                  required
                  className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="bg-zinc-900/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Truck size={18} />
              Método de Entrega
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {deliveryOptions.map((option) => {
                const Icon = option.icon
                return (
                  <label
                    key={option.id}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      formData.delivery_method === option.id
                        ? 'border-green-400 bg-green-400/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_method"
                      value={option.id}
                      checked={formData.delivery_method === option.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <Icon size={32} className={`mx-auto mb-2 ${option.color}`} />
                      <h5 className="text-white font-semibold mb-1">{option.label}</h5>
                      <p className="text-gray-400 text-sm">{option.description}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Address Selection for Home Delivery */}
          {formData.delivery_method === DELIVERY_METHODS.HOME_DELIVERY && (
            <div className="bg-zinc-900/50 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <MapPin size={18} />
                Dirección de Entrega
              </h4>

              {loadingAddresses ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                  <span className="text-gray-400 ml-2">Cargando direcciones...</span>
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm">Selecciona una dirección guardada o agrega una nueva:</p>

                  {/* Saved Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {addresses.map((address, index) => (
                      <label
                        key={`address-${index}`}
                        className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all ${
                          formData.selected_address_id === index
                            ? 'border-green-400 bg-green-400/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="selected_address"
                          value={index}
                          checked={formData.selected_address_id === index}
                          onChange={() => handleAddressSelect(index)}
                          className="sr-only"
                        />
                        <div className="flex items-start gap-3">
                          <MapPin className="text-green-400 mt-1" size={20} />
                          <div>
                            <p className="text-white font-semibold">
                              {address.street} {address.number}
                            </p>
                            <p className="text-gray-400 text-sm">{address.city}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Add New Address Button */}
                  <button
                    type="button"
                    onClick={handleAddNewAddress}
                    className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Agregar nueva dirección
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm">No tienes direcciones guardadas. Agrega una nueva:</p>
                  {/* New Address Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={newAddress.address}
                        onChange={handleNewAddressChange}
                        placeholder="Calle 123, Número 456"
                        required
                        className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={newAddress.city}
                          onChange={handleNewAddressChange}
                          placeholder="Buenos Aires"
                          required
                          className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Código Postal *
                        </label>
                        <input
                          type="text"
                          name="postal_code"
                          value={newAddress.postal_code}
                          onChange={handleNewAddressChange}
                          placeholder="1234"
                          required
                          className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNewAddressSubmit(newAddress)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 hover:shadow-green-400/70"
                    >
                      Guardar Dirección
                    </button>
                  </div>
                </div>
              )}

              {/* New Address Form Modal */}
              {showNewAddressForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-80 flex items-center justify-center p-4">
                  <div className="bg-zinc-950 rounded-xl border-2 border-green-400/40 p-6 max-w-md w-full shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-green-400/10 rounded-lg">
                        <Plus className="text-green-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl mb-1">Nueva Dirección</h3>
                        <p className="text-gray-400 text-sm">Agrega una nueva dirección de entrega</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Dirección *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={newAddress.address}
                          onChange={handleNewAddressChange}
                          placeholder="Calle 123, Número 456"
                          required
                          className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Ciudad *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleNewAddressChange}
                            placeholder="Buenos Aires"
                            required
                            className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Código Postal *
                          </label>
                          <input
                            type="text"
                            name="postal_code"
                            value={newAddress.postal_code}
                            onChange={handleNewAddressChange}
                            placeholder="1234"
                            required
                            className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCancelNewAddress}
                          className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNewAddressSubmit(newAddress)}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 hover:shadow-green-400/70"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-zinc-900/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={18} />
              Método de Pago
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {paymentOptions.map((option) => (
                <label
                  key={option.id}
                  className={`block cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    formData.payment_method === option.id
                      ? 'border-green-400 bg-green-400/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={option.id}
                    checked={formData.payment_method === option.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <h5 className="text-white font-semibold">{option.label}</h5>
                      <p className="text-gray-400 text-sm">{option.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Card Information */}
            {formData.payment_method === 'card' && (
              <div className="space-y-4 pt-4 border-t border-gray-600">
                <h5 className="text-white font-semibold">Datos de la Tarjeta</h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card Number */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Número de Tarjeta *
                    </label>
                    <input
                      type="text"
                      name="card_number"
                      value={formData.card_number}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                    />
                  </div>

                  {/* Card Holder */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Nombre del Titular *
                    </label>
                    <input
                      type="text"
                      name="card_holder"
                      value={formData.card_holder}
                      onChange={handleChange}
                      placeholder="JUAN PEREZ"
                      className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                    />
                  </div>

                  {/* Expiry */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Fecha de Expiración *
                    </label>
                    <input
                      type="text"
                      name="card_expiry"
                      value={formData.card_expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                    />
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="card_cvv"
                      value={formData.card_cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-4 py-3 bg-black border border-green-400/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-zinc-900/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4">Resumen del Pedido</h4>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-300">Total a pagar:</span>
              <span className="text-green-400 font-bold">${total.toFixed(2)}</span>
            </div>
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
                  <span>Confirmar Compra</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutForm
