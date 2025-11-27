import apiClient from './axios.config'

// Obtener todas las categorías
export const getCategories = async (skip = 0, limit = 100) => {
  try {
    const response = await apiClient.get('/categories', {
      params: { skip, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Obtener una categoría por ID
export const getCategoryById = async (id) => {
  try {
    const response = await apiClient.get(`/categories/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Crear una nueva categoría
export const createCategory = async (categoryData) => {
  try {
    const response = await apiClient.post('/categories', categoryData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Actualizar una categoría
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await apiClient.put(`/categories/${id}`, categoryData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Eliminar una categoría
export const deleteCategory = async (id) => {
  try {
    const response = await apiClient.delete(`/categories/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}