import apiClient from './axios.config'

// Obtener todos los clientes
export const getClients = async (skip = 0, limit = 10) => {
  try {
    const response = await apiClient.get('/clients', {
      params: { skip, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Obtener un cliente por ID
export const getClientById = async (id) => {
  try {
    const response = await apiClient.get(`/clients/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Crear un nuevo cliente (registro)
export const createClient = async (clientData) => {
  try {
    const response = await apiClient.post('/clients', clientData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Actualizar un cliente
export const updateClient = async (id, clientData) => {
  try {
    const response = await apiClient.put(`/clients/${id}`, clientData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Eliminar un cliente
export const deleteClient = async (id) => {
  try {
    const response = await apiClient.delete(`/clients/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Obtener direcciones del cliente
export const getClientAddresses = async (clientId) => {
  try {
    const response = await apiClient.get(`/addresses`, {
      params: { client_id: clientId }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Crear una nueva dirección
export const createAddress = async (addressData) => {
  try {
    const response = await apiClient.post('/addresses', addressData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Actualizar una dirección
export const updateAddress = async (id, addressData) => {
  try {
    const response = await apiClient.put(`/addresses/${id}`, addressData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Eliminar una dirección
export const deleteAddress = async (id) => {
  try {
    const response = await apiClient.delete(`/addresses/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
