/**
 * GeolocalizacionProvider.jsx — Hook con soporte para detección automática (GPS)
 * e inserción manual de ubicación.
 */
import { useCallback } from 'react'
import { useUbicacionStore } from '../store/ubicacionStore'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse'

async function geocodificarInverso(lat, lng) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    addressdetails: '1',
    'accept-language': 'es',
  })
  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { 'User-Agent': 'SistemaRecomendacionLaptops/1.0' },
  })
  if (!res.ok) throw new Error(`Nominatim ${res.status}`)
  const data = await res.json()
  const addr = data.address || {}
  return {
    ciudad: addr.city || addr.town || addr.village || addr.municipality || addr.county || 'Lima',
    departamento: addr.state || addr.region || 'Lima',
  }
}

export function useGeolocalizacion() {
  const ciudad                 = useUbicacionStore((s) => s.ciudad)
  const departamento           = useUbicacionStore((s) => s.departamento)
  const lat                    = useUbicacionStore((s) => s.lat)
  const lng                    = useUbicacionStore((s) => s.lng)
  const origen                 = useUbicacionStore((s) => s.origen)
  const cargando               = useUbicacionStore((s) => s.cargando)
  const error                  = useUbicacionStore((s) => s.error)
  const setUbicacionAutomatica = useUbicacionStore((s) => s.setUbicacionAutomatica)
  const setUbicacionManual     = useUbicacionStore((s) => s.setUbicacionManual)
  const limpiarUbicacion       = useUbicacionStore((s) => s.limpiarUbicacion)
  const setCargando            = useUbicacionStore((s) => s.setCargando)
  const setError               = useUbicacionStore((s) => s.setError)

  // 1. Detección automática por GPS del navegador
  const solicitarAutomatica = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.')
      return
    }
    setCargando(true)
    setError(null)
    try {
      const posicion = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        })
      )
      const { latitude, longitude } = posicion.coords
      const { ciudad: c, departamento: d } = await geocodificarInverso(latitude, longitude)
      setUbicacionAutomatica({ ciudad: c, departamento: d, lat: latitude, lng: longitude })
    } catch (err) {
      let msg = 'No se pudo obtener tu ubicación automáticamente.'
      if (err.code === 1) msg = 'Permiso denegado por el navegador. Puedes ingresar tu ubicación manualmente abajo.'
      else if (err.code === 2) msg = 'Información de ubicación no disponible. Ingresa tu ciudad manualmente.'
      else if (err.code === 3) msg = 'Tiempo de espera agotado al consultar GPS.'
      setError(msg)
    }
  }, [setUbicacionAutomatica, setCargando, setError])

  // 2. Inserción manual de ubicación
  const establecerManual = useCallback((ciudadInput, departamentoInput) => {
    if (!ciudadInput?.trim()) {
      setError('Por favor escribe el nombre de tu ciudad.')
      return false
    }
    setUbicacionManual({
      ciudad: ciudadInput.trim(),
      departamento: (departamentoInput?.trim()) || ciudadInput.trim(),
    })
    return true
  }, [setUbicacionManual, setError])

  return {
    solicitar: solicitarAutomatica,
    solicitarAutomatica,
    establecerManual,
    limpiarUbicacion,
    ubicacion: { ciudad, departamento, lat, lng },
    origen,
    cargando,
    error,
    tieneUbicacion: Boolean(ciudad && ciudad.trim()),
  }
}

export default function GeolocalizacionProvider({ children }) {
  return children
}
