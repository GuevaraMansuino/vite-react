import apiClient from './axios.config'

// Tipos de pago según el backend
export const PAYMENT_TYPES = {
  CASH: 'cash',
  CARD: 'card'
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

// Obtener una factura por ID
export const getBillById = async (id) => {
  try {
    const response = await apiClient.get(`/bills/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Crear una nueva factura
export const createBill = async (billData) => {
  try {
    const response = await apiClient.post('/bills', billData)
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

// Generar número de factura único
export const generateBillNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `BILL-${year}${month}${day}-${random}`
}