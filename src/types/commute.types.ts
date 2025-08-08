/**
 * Types pour la gestion des isochrones et temps de trajet avec Geoapify
 */

export interface ICoordinates {
  lat: number
  lng: number
}

export interface ILocation {
  address: string
  coordinates: ICoordinates
}

export type ITransportMode = "drive" | "walk" | "bicycle" | "transit"

export interface IIsochroneRequest {
  location: ICoordinates
  mode: ITransportMode
  range: number // en secondes
  rangeType?: "time" | "distance"
}

export interface IIsochroneGeometry {
  type: "Polygon"
  coordinates: number[][][]
}

export interface IIsochroneFeature {
  type: "Feature"
  properties: {
    mode: string
    range: number
    range_type: string
  }
  geometry: IIsochroneGeometry
}

export interface IIsochroneResponse {
  type: "FeatureCollection"
  features: IIsochroneFeature[]
}

export interface IGeoapifyError {
  error: {
    type: string
    message: string
  }
}

export interface ICommuteArea {
  id: string
  location: ILocation
  mode: ITransportMode
  timeInMinutes: number
  geoJSON: IIsochroneResponse
  color?: string
  createdAt: Date
}

export interface ICommuteMapOptions {
  defaultTime: number // en minutes
  availableModes: ITransportMode[]
  maxTime: number // en minutes
  minTime: number // en minutes
  colors: string[]
}
