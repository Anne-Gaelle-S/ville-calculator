import type { ICity } from "../types/city.types"

/**
 * Service pour rechercher des villes françaises via l'API geo.api.gouv.fr
 */
class CityService {
  private readonly BASE_URL = "https://geo.api.gouv.fr/communes"
  private readonly DEFAULT_LIMIT = 5

  /**
   * Recherche des villes par nom
   * @param query - Terme de recherche
   * @param limit - Nombre maximum de résultats (défaut: 5)
   * @returns Promise avec la liste des villes trouvées
   */
  async searchCities(
    query: string,
    limit: number = this.DEFAULT_LIMIT
  ): Promise<ICity[]> {
    if (!query || query.trim().length < 2) {
      return []
    }

    try {
      const params = new URLSearchParams({
        nom: query.trim(),
        fields: "nom,code,codeDepartement,codeRegion,codesPostaux,population",
        format: "json",
        limit: limit.toString(),
      })

      const response = await fetch(`${this.BASE_URL}?${params}`)

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      return this.mapApiResponseToCities(data)
    } catch (error) {
      console.error("Erreur lors de la recherche de villes:", error)
      throw new Error(
        "Impossible de rechercher les villes. Veuillez réessayer."
      )
    }
  }

  /**
   * Mappe la réponse de l'API vers notre interface ICity
   */
  private mapApiResponseToCities(apiData: unknown[]): ICity[] {
    if (!Array.isArray(apiData)) {
      return []
    }

    return apiData.map((item: unknown) => {
      if (typeof item !== "object" || item === null) {
        throw new Error("Format de données API invalide")
      }

      const cityData = item as Record<string, unknown>

      return {
        nom: String(cityData.nom || ""),
        code: String(cityData.code || ""),
        codeDepartement: String(cityData.codeDepartement || ""),
        codeRegion: String(cityData.codeRegion || ""),
        codesPostaux: Array.isArray(cityData.codesPostaux)
          ? cityData.codesPostaux.map(String)
          : [],
        population: Number(cityData.population) || 0,
      }
    })
  }
}

export const cityService = new CityService()
