import apiClient from './axios.config'

// Obtener todos los productos con paginación
export const getProducts = async (skip = 0, limit = 10) => {
  try {
    const response = await apiClient.get('/products', {
      params: { skip, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/products', productData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Actualizar un producto
export const updateProduct = async (id, productData) => {
  try {
    const response = await apiClient.put(`/products/${id}`, productData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/products/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Buscar productos por categoría
export const getProductsByCategory = async (categoryId, skip = 0, limit = 10) => {
  try {
    const response = await apiClient.get('/products', {
      params: { 
        category_id: categoryId,
        skip, 
        limit 
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Buscar productos
export const searchProducts = async (query) => {
  try {
    const response = await apiClient.get('/products/search', {
      params: { q: query }
    })
    return response.data
  } catch (error) {
    throw error
  }
}