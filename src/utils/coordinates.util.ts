import type { ICoordinates } from '../types/commute.types'

/**
 * Utilitaires pour la gestion des coordonnées géographiques
 */

/**
 * Valide les coordonnées géographiques
 * @param coordinates - Coordonnées à valider
 * @returns true si les coordonnées sont valides
 */
export const validateCoordinates = (coordinates: ICoordinates): boolean => {
  const { lat, lng } = coordinates
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  )
}

/**
 * Calcule la distance entre deux points en kilomètres (formule de Haversine)
 * @param point1 - Premier point
 * @param point2 - Deuxième point
 * @returns Distance en kilomètres
 */
export const calculateDistance = (
  point1: ICoordinates,
  point2: ICoordinates
): number => {
  const R = 6371 // Rayon de la Terre en km
  const dLat = toRadians(point2.lat - point1.lat)
  const dLng = toRadians(point2.lng - point1.lng)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c
}

/**
 * Convertit les degrés en radians
 * @param degrees - Angle en degrés
 * @returns Angle en radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180)
}

/**
 * Formate les coordonnées pour l'affichage
 * @param coordinates - Coordonnées à formater
 * @param precision - Nombre de décimales (défaut: 6)
 * @returns Chaîne formatée "lat, lng"
 */
export const formatCoordinates = (
  coordinates: ICoordinates,
  precision: number = 6
): string => {
  const lat = coordinates.lat.toFixed(precision)
  const lng = coordinates.lng.toFixed(precision)
  return `${lat}, ${lng}`
}

/**
 * Parse une chaîne de coordonnées au format "lat, lng"
 * @param coordinatesString - Chaîne à parser
 * @returns Coordonnées parsées ou null si invalide
 */
export const parseCoordinates = (
  coordinatesString: string
): ICoordinates | null => {
  try {
    const parts = coordinatesString.split(',').map(part => part.trim())
    if (parts.length !== 2) return null
    
    const lat = parseFloat(parts[0])
    const lng = parseFloat(parts[1])
    
    const coordinates = { lat, lng }
    
    return validateCoordinates(coordinates) ? coordinates : null
  } catch {
    return null
  }
}

/**
 * Calcule le centre (centroïde) d'un ensemble de points
 * @param points - Tableau de coordonnées
 * @returns Coordonnées du centre
 */
export const calculateCenter = (points: ICoordinates[]): ICoordinates => {
  if (points.length === 0) {
    throw new Error('Impossible de calculer le centre d\'un tableau vide')
  }
  
  const sum = points.reduce(
    (acc, point) => ({
      lat: acc.lat + point.lat,
      lng: acc.lng + point.lng
    }),
    { lat: 0, lng: 0 }
  )
  
  return {
    lat: sum.lat / points.length,
    lng: sum.lng / points.length
  }
}
