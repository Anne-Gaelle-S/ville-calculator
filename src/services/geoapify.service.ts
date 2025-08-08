import type {
  IIsochroneRequest,
  IIsochroneResponse,
  IGeoapifyError,
  ICoordinates,
  ITransportMode,
} from "../types/commute.types"

/**
 * Service pour interagir avec l'API Geoapify Isoline
 */
class GeoapifyService {
  private readonly BASE_URL = "https://api.geoapify.com/v1/isoline"
  private readonly API_KEY: string

  constructor() {
    this.API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || ""
    if (!this.API_KEY) {
      console.warn(
        "⚠️ VITE_GEOAPIFY_API_KEY n'est pas définie dans les variables d'environnement"
      )
    }
  }

  /**
   * Génère une isochrone pour un point donné
   * @param request - Paramètres de la requête isochrone
   * @returns Promise avec les données GeoJSON de l'isochrone
   */
  async getIsochrone(request: IIsochroneRequest): Promise<IIsochroneResponse> {
    if (!this.API_KEY) {
      throw new Error(
        "Clé API Geoapify manquante. Veuillez configurer VITE_GEOAPIFY_API_KEY."
      )
    }

    const { location, mode, range, rangeType = "time" } = request

    // Validation des limites Geoapify
    if (rangeType === "time" && range > 3600) {
      throw new Error(
        "La durée maximum autorisée par Geoapify est de 60 minutes (3600 secondes)"
      )
    }

    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lon: location.lng.toString(),
      type: rangeType,
      mode: this.mapTransportMode(mode),
      range: range.toString(),
      apiKey: this.API_KEY,
      format: "geojson",
    })

    const url = `${this.BASE_URL}?${params}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        const errorData: IGeoapifyError = await response.json()
        throw new Error(`Erreur API Geoapify: ${errorData.error.message}`)
      }

      const data: IIsochroneResponse = await response.json()
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Erreur inconnue lors de la récupération de l'isochrone")
    }
  }

  /**
   * Génère plusieurs isochrones pour différents temps depuis un même point
   * @param location - Coordonnées du point de départ
   * @param mode - Mode de transport
   * @param timeRanges - Tableau des temps en minutes
   * @returns Promise avec un tableau d'isochrones
   */
  async getMultipleIsochrones(
    location: ICoordinates,
    mode: ITransportMode,
    timeRanges: number[]
  ): Promise<IIsochroneResponse[]> {
    const requests = timeRanges.map((timeInMinutes) => ({
      location,
      mode,
      range: timeInMinutes * 60, // Conversion en secondes
      rangeType: "time" as const,
    }))

    try {
      const promises = requests.map((request) => this.getIsochrone(request))
      return await Promise.all(promises)
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des isochrones multiples:",
        error
      )
      throw error
    }
  }

  /**
   * Vérifie si l'API Key est configurée
   * @returns true si la clé API est présente
   */
  isConfigured(): boolean {
    const configured = Boolean(
      this.API_KEY && this.API_KEY !== "your-api-key-here"
    )
    return configured
  }

  /**
   * Mappe nos modes de transport vers ceux de Geoapify
   * @param mode - Notre mode de transport
   * @returns Mode de transport Geoapify
   */
  private mapTransportMode(mode: ITransportMode): string {
    const modeMap: Record<ITransportMode, string> = {
      drive: "drive",
      walk: "walk",
      bicycle: "bicycle",
      transit: "transit",
    }

    return modeMap[mode] || "drive"
  }
}

export const geoapifyService = new GeoapifyService()
