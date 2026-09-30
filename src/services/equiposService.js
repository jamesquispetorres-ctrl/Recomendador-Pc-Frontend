/**
 * equiposService.js — Llamadas a la API relacionadas con equipos y recomendaciones.
 */
import api from './api'

/**
 * Obtiene la lista de equipos con filtros opcionales.
 * @param {Object} filtros - { tipo, ciudad, departamento, precio_min, precio_max, search }
 */
export const getEquipos = (filtros = {}) =>
  api.get('/equipos/', { params: filtros }).then((r) => r.data)

/**
 * Obtiene el detalle de un equipo por ID.
 * @param {number} id
 */
export const getEquipo = (id) =>
  api.get(`/equipos/${id}/`).then((r) => r.data)

/**
 * Obtiene el historial de precios de un equipo.
 * @param {number} id
 */
export const getHistorialPrecios = (id) =>
  api.get(`/equipos/${id}/historial/`).then((r) => r.data)

/**
 * Solicita recomendaciones al motor ML.
 * @param {Object} params
 * @param {number} params.presupuesto - Presupuesto máximo en Soles
 * @param {string} params.tipo_uso - 'gaming'|'diseño'|'oficina'|'estudiante'|'programacion'|'multimedia'
 * @param {string} params.tipo_equipo - 'laptop'|'pc_escritorio'|'ambos'
 * @param {boolean} params.con_explicacion - Si incluir explicaciones de Gemini
 * @param {string} params.accion - 'buscar'|'comparar'|'bot'
 */
export const getRecomendaciones = (params) =>
  api.post('/recomendar/', params).then((r) => r.data)

/**
 * Obtiene el catálogo completo de laptops (sin filtro de presupuesto).
 * @param {Object} params - { tipo_uso, tipo_equipo }
 */
export const getCatalogo = (params) =>
  api.post('/catalogo/', params).then((r) => r.data)

/**
 * Envía un mensaje al chat de Gemini AI con contexto de equipos.
 * @param {Object} params
 * @param {string} params.mensaje - Mensaje del usuario
 * @param {string} params.tipo_uso - Perfil de uso
 * @param {string} params.tipo_equipo - Tipo de equipo
 * @param {Array}  params.equipos - Lista de equipos para contexto
 */
export const chatConGemini = (params) =>
  api.post('/chat/', params).then((r) => r.data)
