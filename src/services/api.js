/**
 * api.js — Instancia de Axios configurada para consumir el backend Django.
 *
 * Uso:
 *   import api from '@/services/api'
 *   const resp = await api.get('/equipos/')
 *   const recomendaciones = await api.post('/recomendar/', payload)
 */
import axios from 'axios'

// URL base desde variable de entorno de Vite
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ── Interceptor de respuesta: manejo centralizado de errores ─────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data } = error.response
      console.error(`[API Error ${status}]`, data)

      if (status === 404) {
        console.warn('[API] Recurso no encontrado.')
      } else if (status === 500) {
        console.error('[API] Error interno del servidor.')
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('[API] Sin respuesta del servidor. ¿Está corriendo el backend?', error.request)
    } else {
      console.error('[API] Error al configurar la petición:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
