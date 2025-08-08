import React, { useState, useCallback } from "react"

import type { ICity } from "../types/city.types"
import { useCitySearch } from "../hooks/useCitySearch"

interface ICitySelectionProps {
  selectedCity: string
  onCityChange: (address: string) => void
}

const CitySelection: React.FC<ICitySelectionProps> = ({
  selectedCity,
  onCityChange,
}) => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)

  const {
    cities,
    isLoading: isCityLoading,
    error: cityError,
    searchCities,
    clearResults,
  } = useCitySearch()

  const handleCitySearch = (query: string) => {
    onCityChange(query)
    if (query.length >= 2) {
      searchCities(query)
      setShowSuggestions(true)
    } else {
      clearResults()
      setShowSuggestions(false)
    }
  }

  // Gestion de la sélection d'une ville
  const handleCitySelection = useCallback(
    (city: ICity) => {
      onCityChange(city.nom)
      setShowSuggestions(false)
      clearResults()
    },
    [onCityChange, clearResults]
  )

  // Gestion de la perte de focus
  const handleBlur = useCallback(() => {
    // Délai pour permettre le clic sur une suggestion
    setTimeout(() => setShowSuggestions(false), 200)
  }, [])

  // Gestion du focus
  const handleFocus = useCallback(() => {
    if (selectedCity.trim().length >= 2 && cities.length > 0) {
      setShowSuggestions(true)
    }
  }, [selectedCity, cities.length])

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Adresse de départ
      </label>
      <input
        type="text"
        value={selectedCity}
        onChange={(e) => handleCitySearch(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="Rechercher une adresse ou une ville..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={showSuggestions}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        role="combobox"
      />

      {/* Indicateur de chargement */}
      {isCityLoading && (
        <div className="absolute right-3 top-[2.75rem] transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Liste des suggestions */}
      {showSuggestions && cities.length > 0 && !isCityLoading && (
        <ul
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg"
          role="listbox"
        >
          {cities.map((city, index) => (
            <li
              key={`${city.code}-${index}`}
              onClick={() => handleCitySelection(city)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              role="option"
              aria-selected={false}
            >
              <span className="font-medium">{city.nom}</span>
              <span className="text-sm text-gray-500">
                {city.codeDepartement} - {city.population.toLocaleString()} hab.
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Message quand aucune ville n'est trouvée */}
      {showSuggestions &&
        cities.length === 0 &&
        !isCityLoading &&
        selectedCity.trim().length >= 2 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 px-3 py-2 text-gray-500 text-sm shadow-lg">
            Aucune ville trouvée pour "{selectedCity}"
          </div>
        )}

      {/* Messages d'état */}
      {isCityLoading && (
        <p className="text-sm text-gray-500 mt-1">Recherche en cours...</p>
      )}
      {cityError && <p className="text-sm text-red-500 mt-1">{cityError}</p>}
    </div>
  )
}

export default CitySelection
