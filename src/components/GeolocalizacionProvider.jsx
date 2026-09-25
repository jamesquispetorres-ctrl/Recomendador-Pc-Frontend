/**
 * GeolocalizacionProvider.jsx — Hook de geolocalización con Nominatim
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
    ciudad: addr.city || addr.town || addr.village || addr.municipality || addr.county || 'Ciudad desconocida',
    departamento: addr.state || addr.region || 'Departamento desconocido',
  }
}

export function useGeolocalizacion() {
  const ciudad       = useUbicacionStore((s) => s.ciudad)
  const departamento = useUbicacionStore((s) => s.departamento)
  const lat          = useUbicacionStore((s) => s.lat)
  const lng          = useUbicacionStore((s) => s.lng)
  const cargando     = useUbicacionStore((s) => s.cargando)
  const error        = useUbicacionStore((s) => s.error)
  const setUbicacion = useUbicacionStore((s) => s.setUbicacion)
  const setCargando  = useUbicacionStore((s) => s.setCargando)
  const setError     = useUbicacionStore((s) => s.setError)

  const solicitar = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.')
      return
    }
    setCargando(true)
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
      setUbicacion({ ciudad: c, departamento: d, lat: latitude, lng: longitude })
    } catch (err) {
      let msg = 'No se pudo obtener tu ubicación.'
      if (err.code === 1) msg = 'Permiso denegado. Actívalo en la configuración del navegador.'
      else if (err.code === 2) msg = 'Información de ubicación no disponible.'
      else if (err.code === 3) msg = 'Tiempo de espera agotado.'
      setError(msg)
    }
  }, [setUbicacion, setCargando, setError])

  return {
    solicitar,
    ubicacion: { ciudad, departamento, lat, lng },
    cargando,
    error,
    tieneUbicacion: !!ciudad,
  }
}

export default function GeolocalizacionProvider({ children }) {
  return children
}
