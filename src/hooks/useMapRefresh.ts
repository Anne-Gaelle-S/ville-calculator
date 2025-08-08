import { useEffect, useState } from "react"
import type { ICommuteArea } from "../types/commute.types"

/**
 * Hook pour forcer le re-rendu des composants Leaflet
 */
export const useMapRefresh = (commuteAreas: ICommuteArea[]) => {
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setRefreshKey((prev) => prev + 1)
  }, [commuteAreas])

  return refreshKey
}
