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
 * @param {number} params.presupuesto - Presupuesto máximo en COP
 * @param {string} params.tipo_uso - 'gaming'|'diseño'|'oficina'|'estudiante'|'programacion'|'multimedia'
 * @param {string} params.tipo_equipo - 'laptop'|'pc_escritorio'|'ambos'
 * @param {Object} params.ubicacion - { ciudad, departamento }
 * @param {boolean} params.con_explicacion - Si incluir explicaciones de Gemini
 */
export const getRecomendaciones = (params) =>
  api.post('/recomendar/', params).then((r) => r.data)
