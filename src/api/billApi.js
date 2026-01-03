import apiClient, { billsApiClient } from './axios.config'

// Crear una nueva factura
export const createBill = async (billData) => {
  try {
    // En desarrollo, usar el cliente principal que va a través del proxy
    const client = import.meta.env.DEV ? apiClient : billsApiClient
    const response = await client.post('/bills', billData)
    return response.data
  } catch (error) {
    // Si hay error de CORS en desarrollo, mostrar mensaje específico
    if (import.meta.env.DEV && error.message?.includes('CORS')) {
      console.error('❌ CORS Error: El backend no permite requests desde localhost:3000')
      console.error('💡 Solución: Configura CORS en el backend para permitir http://localhost:3000')
      console.error('   O usa la build de producción para probar el checkout')
    }
    throw error
  }
}

// Obtener una factura por ID
export const getBillById = async (id) => {
  try {
    const response = await apiClient.get(`/bills/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Obtener todas las facturas
export const getBills = async (skip = 0, limit = 10) => {
  try {
    const response = await apiClient.get('/bills', {
      params: { skip, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Actualizar una factura
export const updateBill = async (id, billData) => {
  try {
    const response = await apiClient.put(`/bills/${id}`, billData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Eliminar una factura
export const deleteBill = async (id) => {
  try {
    const response = await apiClient.delete(`/bills/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
