/**
 * ubicacionStore.js — Estado global de ubicación del usuario.
 *
 * Usa Zustand para almacenar la ciudad y departamento detectados
 * por geolocalización del navegador + geocodificación inversa.
 *
 * Uso:
 *   import { useUbicacionStore } from '@/store/ubicacionStore'
 *
 *   const { ciudad, departamento, setUbicacion, limpiarUbicacion } = useUbicacionStore()
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUbicacionStore = create(
  persist(
    (set) => ({
      // ── Estado ────────────────────────────────────────────────────────────
      ciudad: '',
      departamento: '',
      lat: null,
      lng: null,
      cargando: false,
      error: null,

      // ── Acciones ──────────────────────────────────────────────────────────

      /**
       * Guarda la ubicación completa detectada por geolocalización.
       * @param {{ ciudad: string, departamento: string, lat: number, lng: number }} ubicacion
       */
      setUbicacion: ({ ciudad, departamento, lat, lng }) =>
        set({
          ciudad,
          departamento,
          lat,
          lng,
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
          error: null,
          cargando: false,
        }),
    }),
    {
      name: 'ubicacion-storage',   // Clave en localStorage
      partialize: (state) => ({    // Solo persistir datos, no estado de UI
        ciudad: state.ciudad,
        departamento: state.departamento,
        lat: state.lat,
        lng: state.lng,
      }),
    }
  )
)
