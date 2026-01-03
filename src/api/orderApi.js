import apiClient from './axios.config'

// Estados de orden según el backend
export const ORDER_STATUS = {
  PENDING: 1,
  IN_PROGRESS: 2,
  DELIVERED: 3,
  CANCELED: 4
}

// Métodos de entrega según el backend
export const DELIVERY_METHODS = {
  DRIVE_THRU: 1,
  ON_HAND: 2,
  HOME_DELIVERY: 3
}

// Obtener todas las órdenes
export const getOrders = async (skip = 0, limit = 10) => {
  try {
    const response = await apiClient.get('/orders', {
      params: { skip, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Obtener una orden por ID
export const getOrderById = async (id) => {
  try {
    const response = await apiClient.get(`/orders/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Crear una nueva orden
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders/', orderData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Actualizar una orden
export const updateOrder = async (id, orderData) => {
  try {
    const response = await apiClient.put(`/orders/${id}`, orderData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Eliminar una orden
export const deleteOrder = async (id) => {
  try {
    const response = await apiClient.delete(`/orders/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Obtener órdenes por cliente
export const getOrdersByClient = async (clientId) => {
  try {
    
    // Uncomment below when backend is ready
    const response = await apiClient.get('/orders/', {
      params: { client_id: clientId }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Crear orden con detalles
export const createOrderWithDetails = async (orderData, orderDetails) => {
  try {
    // Primero crear la orden
    const order = await createOrder(orderData)
    
    // Luego crear los detalles
    const detailsPromises = orderDetails.map(detail => 
      apiClient.post('/order_details', {
        ...detail,
        order_id: order.id_key
      })
    )
    
    await Promise.all(detailsPromises)
    
    return order
  } catch (error) {
    throw error
  }
}