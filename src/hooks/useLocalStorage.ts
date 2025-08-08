import { useState, useEffect } from "react"
import type { Criteria } from "../types"

const STORAGE_KEY = "ville-calculator-criteria"

export const useLocalStorage = () => {
  const [criteria, setCriteria] = useState<Criteria[]>([])

  useEffect(() => {
    try {
      const storedCriteria = localStorage.getItem(STORAGE_KEY)
      if (storedCriteria) {
        const parsedCriteria = JSON.parse(storedCriteria)
        setCriteria(parsedCriteria)
      }
    } catch (error) {
      console.error("Error loading criteria:", error)
    }
  }, [])

  const saveCriteria = (newCriteria: Criteria[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCriteria))
      setCriteria(newCriteria)
    } catch (error) {
      console.error("Error saving criteria:", error)
    }
  }

  const addCriteria = (criteriaData: Omit<Criteria, "id" | "creationDate">) => {
    const newCriteria: Criteria = {
      ...criteriaData,
      id: crypto.randomUUID(),
      creationDate: new Date().toISOString(),
    }

    const updatedCriteria = [...criteria, newCriteria]
    saveCriteria(updatedCriteria)
  }

  const deleteCriteria = (id: string) => {
    const updatedCriteria = criteria.filter(
      (criteriaItem) => criteriaItem.id !== id
    )
    saveCriteria(updatedCriteria)
  }

  const clearCriteria = () => {
    saveCriteria([])
  }

  return {
    criteria,
    addCriteria,
    deleteCriteria,
    clearCriteria,
  }
}
