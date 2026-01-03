import axios from './axios.config'

export const getWishlist = async () => {
  try {
    const response = await axios.get('/wishlist')
    return response.data
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    throw error
  }
}

export const addToWishlist = async (productData) => {
  try {
    const response = await axios.post('/wishlist', productData)
    return response.data
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw error
  }
}

export const removeFromWishlist = async (productId) => {
  try {
    const response = await axios.delete(`/wishlist/${productId}`)
    return response.data
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    throw error
  }
}

export const clearWishlist = async () => {
  try {
    const response = await axios.delete('/wishlist')
    return response.data
  } catch (error) {
    console.error('Error clearing wishlist:', error)
    throw error
  }
}

export const checkInWishlist = async (productId) => {
  try {
    const response = await axios.get(`/wishlist/check/${productId}`)
    return response.data
  } catch (error) {
    console.error('Error checking wishlist:', error)
    throw error
  }
}
