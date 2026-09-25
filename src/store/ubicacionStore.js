/**
 * ubicacionStore.js — Estado global de ubicación del usuario.
 *
 * Permite tanto la detección automática vía GPS / navegador (OpenStreetMap)
 * como la inserción manual de ciudad y departamento.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const CIUDADES_POPULARES = [
  { ciudad: 'Lima', departamento: 'Lima' },
  { ciudad: 'Arequipa', departamento: 'Arequipa' },
  { ciudad: 'Trujillo', departamento: 'La Libertad' },
  { ciudad: 'Chiclayo', departamento: 'Lambayeque' },
  { ciudad: 'Piura', departamento: 'Piura' },
  { ciudad: 'Cusco', departamento: 'Cusco' },
  { ciudad: 'Huancayo', departamento: 'Junín' },
  { ciudad: 'Tacna', departamento: 'Tacna' },
]

export const useUbicacionStore = create(
  persist(
    (set) => ({
      // ── Estado ────────────────────────────────────────────────────────────
      ciudad: '',
      departamento: '',
      lat: null,
      lng: null,
      origen: null, // 'automatica' | 'manual' | null
      cargando: false,
      error: null,

      // ── Acciones ──────────────────────────────────────────────────────────

      /**
       * Guarda la ubicación detectada automáticamente por GPS.
       */
      setUbicacionAutomatica: ({ ciudad, departamento, lat, lng }) =>
        set({
          ciudad: ciudad?.trim() || '',
          departamento: departamento?.trim() || '',
          lat: lat ?? null,
          lng: lng ?? null,
          origen: 'automatica',
          error: null,
          cargando: false,
        }),

      /**
       * Guarda la ubicación ingresada manualmente por el usuario.
       */
      setUbicacionManual: ({ ciudad, departamento }) =>
        set({
          ciudad: ciudad?.trim() || '',
          departamento: departamento?.trim() || '',
          lat: null,
          lng: null,
          origen: 'manual',
          error: null,
          cargando: false,
        }),

      // Compatibilidad con código previo
      setUbicacion: ({ ciudad, departamento, lat, lng }) =>
        set({
          ciudad: ciudad?.trim() || '',
          departamento: departamento?.trim() || '',
          lat: lat ?? null,
          lng: lng ?? null,
          origen: 'automatica',
          error: null,
          cargando: false,
        }),

      setCargando: (valor) => set({ cargando: valor }),

      setError: (mensaje) => set({ error: mensaje, cargando: false }),

      limpiarUbicacion: () =>
        set({
          ciudad: '',
          departamento: '',
          lat: null,
          lng: null,
          origen: null,
          error: null,
          cargando: false,
        }),
    }),
    {
      name: 'ubicacion-storage',
      partialize: (state) => ({
        ciudad: state.ciudad,
        departamento: state.departamento,
        lat: state.lat,
        lng: state.lng,
        origen: state.origen,
      }),
    }
  )
)
