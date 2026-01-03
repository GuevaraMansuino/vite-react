import axios from 'axios'

// Siempre usar la URL del backend de Render
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://final2025python-gero.onrender.com'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000

console.log('🔌 API Base URL:', API_BASE_URL) // Para debug

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  maxRedirects: 0, // Deshabilitar redirecciones automáticas para evitar problemas de CORS
})

// Instancia específica para bills que usa la URL correcta según el entorno
const billsApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  maxRedirects: 0, // Deshabilitar redirecciones automáticas
})

// Interceptor de request para billsApiClient (igual que el principal)
billsApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log de requests en desarrollo
    if (import.meta.env.DEV) {
      console.log('📤 Bills Request:', config.method.toUpperCase(), config.url)
    }

    return config
  },
  (error) => {
    console.error('❌ Bills Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor de response para billsApiClient (igual que el principal)
billsApiClient.interceptors.response.use(
  (response) => {
    // Log de responses exitosos en desarrollo
    if (import.meta.env.DEV) {
      console.log('📥 Bills Response:', response.config.url, response.status)
    }
    return response
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.detail || 'Error desconocido'

      console.error(`❌ Bills Error ${status}:`, message)

      switch (status) {
        case 401:
          // Token inválido o expirado
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          // Solo redirigir si no estamos ya en login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
          break
        case 404:
          console.error('❌ Bills recurso no encontrado:', error.config.url)
          break
        case 422:
          console.error('❌ Bills error de validación:', error.response.data)
          break
        case 429:
          console.error('❌ Bills demasiadas solicitudes, por favor espera')
          break
        case 500:
          console.error('❌ Bills error del servidor')
          break
        default:
          console.error('❌ Bills error:', message)
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('❌ Bills sin respuesta del servidor. Verifica tu conexión y que el backend esté corriendo.')
      console.error('URL intentada:', error.config?.baseURL + error.config?.url)
    } else {
      // Algo pasó al configurar la petición
      console.error('❌ Bills error al configurar la petición:', error.message)
    }

    return Promise.reject(error)
  }
)

// Interceptor de request para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log de requests en desarrollo
    if (import.meta.env.DEV) {
      console.log('📤 Request:', config.method.toUpperCase(), config.url)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor de response para manejo de errores
apiClient.interceptors.response.use(
  (response) => {
    // Log de responses exitosos en desarrollo
    if (import.meta.env.DEV) {
      console.log('📥 Response:', response.config.url, response.status)
    }
    return response
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.detail || 'Error desconocido'
      
      console.error(`❌ Error ${status}:`, message)
      
      switch (status) {
        case 401:
          // Token inválido o expirado
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          // Solo redirigir si no estamos ya en login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
          break
        case 404:
          console.error('❌ Recurso no encontrado:', error.config.url)
          break
        case 422:
          console.error('❌ Error de validación:', error.response.data)
          break
        case 429:
          console.error('❌ Demasiadas solicitudes, por favor espera')
          break
        case 500:
          console.error('❌ Error del servidor')
          break
        default:
          console.error('❌ Error:', message)
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('❌ Sin respuesta del servidor. Verifica tu conexión y que el backend esté corriendo.')
      console.error('URL intentada:', error.config?.baseURL + error.config?.url)
    } else {
      // Algo pasó al configurar la petición
      console.error('❌ Error al configurar la petición:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// Función helper para testear la conexión
export const testConnection = async () => {
  try {
    const response = await apiClient.get('/health_check')
    console.log('✅ Conexión exitosa con el backend:', response.data)
    return { success: true, data: response.data }
  } catch (error) {
    console.error('❌ Error al conectar con el backend:', error.message)
    return { success: false, error: error.message }
  }
}

export default apiClient
export { billsApiClient }