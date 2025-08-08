import type { ICoordinates } from "../types/commute.types"
import { cityService } from "./city.service"

/**
 * Service pour obtenir les coordonnées d'une adresse
 */
class GeocodingService {
  /**
   * Recherche des adresses et retourne plusieurs suggestions
   * @param query - Terme de recherche
   * @returns Promise avec un tableau de suggestions
   */
  async searchAddresses(
    query: string
  ): Promise<Array<{ address: string; coordinates: ICoordinates }>> {
    if (!query || query.trim().length < 3) {
      return []
    }

    try {
      // Utiliser directement l'API Nominatim avec des paramètres optimisés
      const params = new URLSearchParams({
        q: query.trim(),
        format: "json",
        limit: "5",
        addressdetails: "1",
        countrycodes: "fr", // Prioriser la France
      })

      // Utiliser un proxy CORS pour contourner les restrictions de Nominatim
      const baseUrl = "https://api.allorigins.win/get"
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?${params}`
      const proxyParams = new URLSearchParams({
        url: nominatimUrl,
      })

      const url = `${baseUrl}?${proxyParams}`
      console.log("🌐 GeocodingService: URL appelée via proxy", url)

      const response = await fetch(url)

      if (!response.ok) {
        console.log(
          "❌ GeocodingService: réponse proxy non OK",
          response.status,
          response.statusText
        )
        return []
      }

      const proxyData = await response.json()

      // Le proxy retourne les données dans proxyData.contents
      if (!proxyData.contents) {
        console.log("❌ GeocodingService: pas de contenu dans la réponse proxy")
        return []
      }

      const data = JSON.parse(proxyData.contents)
      const results: Array<{ address: string; coordinates: ICoordinates }> = []

      console.log("🔍 GeocodingService: données reçues via proxy", {
        query,
        dataLength: data?.length,
        firstResult: data?.[0],
      })

      if (Array.isArray(data)) {
        data.forEach((result) => {
          const lat = parseFloat(result.lat)
          const lng = parseFloat(result.lon)

          if (!isNaN(lat) && !isNaN(lng)) {
            // Revenir au display_name simple qui fonctionnait
            results.push({
              address: result.display_name,
              coordinates: { lat, lng },
            })
          }
        })
      }

      return results
    } catch (error) {
      console.error("❌ GeocodingService: erreur dans searchAddresses", error)
      return []
    }
  }

  /**
   * Obtient les coordonnées d'une adresse (utilise la première suggestion)
   * @param address - Adresse complète (rue, ville, pays)
   * @returns Promise avec les coordonnées ou null si non trouvée
   */
  async getAddressCoordinates(address: string): Promise<ICoordinates | null> {
    const suggestions = await this.searchAddresses(address)
    return suggestions.length > 0 ? suggestions[0].coordinates : null
  }

  /**
   * Obtient les coordonnées d'une ville française
   * @param cityName - Nom de la ville
   * @returns Promise avec les coordonnées ou null si non trouvée
   */
  async getCityCoordinates(cityName: string): Promise<ICoordinates | null> {
    try {
      // Essayer d'abord avec l'API des communes françaises
      const cities = await cityService.searchCities(cityName, 1)

      if (cities.length > 0) {
        const city = cities[0]
        // Utiliser la nouvelle méthode simplifiée
        const suggestions = await this.searchAddresses(
          `${city.nom}, ${city.codeDepartement}, France`
        )
        if (suggestions.length > 0) {
          return suggestions[0].coordinates
        }
      }

      // Fallback : recherche directe
      return await this.getAddressCoordinates(`${cityName}, France`)
    } catch {
      return null
    }
  }

  /**
   * Obtient les coordonnées avec fallback sur des villes connues
   * @param addressOrCity - Adresse complète ou nom de ville
   * @returns Promise avec les coordonnées (jamais null grâce au fallback)
   */
  async getCityCoordinatesWithFallback(
    addressOrCity: string
  ): Promise<ICoordinates> {
    // Essayer d'abord la recherche normale
    let coordinates = await this.getAddressCoordinates(addressOrCity)

    // Si échec, essayer comme ville française
    if (!coordinates) {
      coordinates = await this.getCityCoordinates(addressOrCity)
    }

    if (coordinates) {
      return coordinates
    }

    // Fallback final : Paris
    return { lat: 48.8566, lng: 2.3522 }
  }
}

export const geocodingService = new GeocodingService()
