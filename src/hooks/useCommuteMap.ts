import { useState, useCallback, useEffect } from "react"

import type {
  ITransportMode,
  ICommuteArea,
  ILocation,
} from "../types/commute.types"
import { geoapifyService } from "../services/geoapify.service"

interface IUseCommuteMapReturn {
  commuteAreas: ICommuteArea[]
  isLoading: boolean
  error: string | null
  addCommuteArea: (
    location: ILocation,
    mode: ITransportMode,
    timeInMinutes: number
  ) => Promise<void>
  removeCommuteArea: (id: string) => void
  clearAllAreas: () => void
  updateCommuteArea: (
    id: string,
    mode: ITransportMode,
    timeInMinutes: number
  ) => Promise<void>
}

// Couleurs prédéfinies pour les zones
const COLORS = [
  "#3B82F6", // blue-500
  "#EF4444", // red-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
  "#84CC16", // lime-500
]

// Clé pour le localStorage
const STORAGE_KEY = "ville-calculator-commute-areas"

/**
 * Sauvegarde les zones dans le localStorage
 */
const saveToLocalStorage = (areas: ICommuteArea[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(areas))
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans localStorage:", error)
  }
}

/**
 * Charge les zones depuis le localStorage
 */
const loadFromLocalStorage = (): ICommuteArea[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const areas = JSON.parse(stored) as ICommuteArea[]
      // Convertir les dates qui ont été sérialisées en string
      return areas.map((area) => ({
        ...area,
        createdAt: new Date(area.createdAt),
      }))
    }
  } catch (error) {
    console.error("Erreur lors du chargement depuis localStorage:", error)
  }
  return []
}

/**
 * Hook personnalisé pour gérer les zones de temps de trajet
 * @returns Objet contenant les zones, état de chargement, erreurs et fonctions
 */
export const useCommuteMap = (): IUseCommuteMapReturn => {
  const [commuteAreas, setCommuteAreas] = useState<ICommuteArea[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les zones depuis localStorage au démarrage
  useEffect(() => {
    const savedAreas = loadFromLocalStorage()
    if (savedAreas.length > 0) {
      setCommuteAreas(savedAreas)
    }
  }, [])

  // Sauvegarder dans localStorage chaque fois que les zones changent
  useEffect(() => {
    if (commuteAreas.length > 0) {
      saveToLocalStorage(commuteAreas)
    } else {
      // Si plus aucune zone, supprimer du localStorage
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error("Erreur lors de la suppression du localStorage:", error)
      }
    }
  }, [commuteAreas])

  /**
   * Ajoute une nouvelle zone de temps de trajet
   */
  const addCommuteArea = useCallback(
    async (
      location: ILocation,
      mode: ITransportMode,
      timeInMinutes: number
    ): Promise<void> => {
      if (!geoapifyService.isConfigured()) {
        setError(
          "Service Geoapify non configuré. Veuillez ajouter votre clé API."
        )
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const geoJSON = await geoapifyService.getIsochrone({
          location: location.coordinates,
          mode,
          range: timeInMinutes * 60, // Conversion en secondes
          rangeType: "time",
        })

        const newArea: ICommuteArea = {
          id: crypto.randomUUID(),
          location,
          mode,
          timeInMinutes,
          geoJSON,
          color: COLORS[commuteAreas.length % COLORS.length],
          createdAt: new Date(),
        }

        setCommuteAreas((prev) => {
          const updated = [...prev, newArea]
          return updated
        })
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue"
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [commuteAreas.length]
  )

  /**
   * Supprime une zone de temps de trajet
   */
  const removeCommuteArea = useCallback((id: string): void => {
    setCommuteAreas((prev) => prev.filter((area) => area.id !== id))
    setError(null)
  }, [])

  /**
   * Supprime toutes les zones
   */
  const clearAllAreas = useCallback((): void => {
    setCommuteAreas([])
    setError(null)
    // Supprimer aussi du localStorage
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Erreur lors de la suppression du localStorage:", error)
    }
  }, [])

  /**
   * Met à jour une zone existante avec de nouveaux paramètres
   */
  const updateCommuteArea = useCallback(
    async (
      id: string,
      mode: ITransportMode,
      timeInMinutes: number
    ): Promise<void> => {
      if (!geoapifyService.isConfigured()) {
        setError(
          "Service Geoapify non configuré. Veuillez ajouter votre clé API."
        )
        return
      }

      const existingArea = commuteAreas.find((area) => area.id === id)
      if (!existingArea) {
        setError("Zone non trouvée")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const geoJSON = await geoapifyService.getIsochrone({
          location: existingArea.location.coordinates,
          mode,
          range: timeInMinutes * 60,
          rangeType: "time",
        })

        setCommuteAreas((prev) =>
          prev.map((area) =>
            area.id === id ? { ...area, mode, timeInMinutes, geoJSON } : area
          )
        )
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue"
        setError(errorMessage)
        console.error("Erreur lors de la mise à jour de la zone:", err)
      } finally {
        setIsLoading(false)
      }
    },
    [commuteAreas]
  )

  return {
    commuteAreas,
    isLoading,
    error,
    addCommuteArea,
    removeCommuteArea,
    clearAllAreas,
    updateCommuteArea,
  }
}
