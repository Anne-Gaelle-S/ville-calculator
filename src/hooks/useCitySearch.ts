import { useState, useEffect, useCallback } from "react"
import type { ICity } from "../types/city.types"
import { cityService } from "../services/city.service"

interface IUseCitySearchReturn {
  cities: ICity[]
  isLoading: boolean
  error: string | null
  searchCities: (query: string) => void
  clearResults: () => void
}

/**
 * Hook personnalisé pour la recherche de villes avec debouncing
 * @param debounceMs - Délai de debouncing en millisecondes (défaut: 300ms)
 * @returns Objet contenant les villes, état de chargement, erreurs et fonctions
 */
export const useCitySearch = (
  debounceMs: number = 300
): IUseCitySearchReturn => {
  const [cities, setCities] = useState<ICity[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const searchCities = useCallback(
    (query: string) => {
      if (!query || query.trim().length < 2) {
        setCities([])
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      const timeoutId = setTimeout(async () => {
        try {
          const results = await cityService.searchCities(query)
          setCities(results)
        } catch {
          // Gestion silencieuse des erreurs
        } finally {
          setIsLoading(false)
        }
      }, debounceMs)

      return () => clearTimeout(timeoutId)
    },
    [debounceMs]
  )

  const clearResults = useCallback(() => {
    setCities([])
    setError(null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    return () => {
      clearResults()
    }
  }, [clearResults])

  return {
    cities,
    isLoading,
    error,
    searchCities,
    clearResults,
  }
}
