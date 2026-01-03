import apiClient from './axios.config'

// Obtener el carrito del usuario
export const getCart = async () => {
  try {
    const response = await apiClient.get('/cart')
    return response.data
  } catch (error) {
    throw error
  }
}

// Agregar producto al carrito
export const addToCart = async (productData) => {
  try {
    const response = await apiClient.post('/cart/items', productData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Actualizar cantidad de un producto en el carrito
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await apiClient.put(`/cart/items/${productId}`, { quantity })
    return response.data
  } catch (error) {
    throw error
  }
}

// Eliminar producto del carrito
export const removeFromCart = async (productId) => {
  try {
    const response = await apiClient.delete(`/cart/items/${productId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Limpiar carrito
export const clearCart = async () => {
  try {
    const response = await apiClient.delete('/cart')
    return response.data
  } catch (error) {
    throw error
  }
}

// Fusionar carrito de invitado con carrito de usuario (útil para login)
export const mergeCart = async (guestCart) => {
  try {
    const response = await apiClient.post('/cart/merge', { guest_cart: guestCart })
    return response.data
  } catch (error) {
    throw error
  }
}
