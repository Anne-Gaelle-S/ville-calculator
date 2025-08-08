import React, { useState, useCallback } from "react"

import type { ICity } from "../types/city.types"
import { useCitySearch } from "../hooks/useCitySearch"

interface ICityFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  label?: string
}

const CityField: React.FC<ICityFieldProps> = ({
  value,
  onChange,
  error,
  placeholder = "Tapez le nom d'une ville...",
  label = "Ville",
}) => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const {
    cities,
    isLoading,
    error: searchError,
    searchCities,
    clearResults,
  } = useCitySearch()

  // Gestion du changement de saisie avec recherche
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      onChange(inputValue)

      if (inputValue.trim().length >= 2) {
        searchCities(inputValue)
        setShowSuggestions(true)
      } else {
        clearResults()
        setShowSuggestions(false)
      }
    },
    [onChange, searchCities, clearResults]
  )

  // Gestion de la sélection d'une ville
  const handleCitySelection = useCallback(
    (city: ICity) => {
      onChange(city.nom)
      setShowSuggestions(false)
      clearResults()
    },
    [onChange, clearResults]
  )

  // Gestion de la perte de focus
  const handleBlur = useCallback(() => {
    // Délai pour permettre le clic sur une suggestion
    setTimeout(() => setShowSuggestions(false), 200)
  }, [])

  // Gestion du focus
  const handleFocus = useCallback(() => {
    if (value.trim().length >= 2 && cities.length > 0) {
      setShowSuggestions(true)
    }
  }, [value, cities.length])

  return (
    <div className="relative">
      <label
        htmlFor="city"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type="text"
        id="city"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error || searchError ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        aria-expanded={showSuggestions}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        role="combobox"
      />

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute right-3 top-[2.75rem] transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Liste des suggestions */}
      {showSuggestions && cities.length > 0 && !isLoading && (
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
        !isLoading &&
        value.trim().length >= 2 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 px-3 py-2 text-gray-500 text-sm shadow-lg">
            Aucune ville trouvée pour "{value}"
          </div>
        )}

      {/* Affichage des erreurs */}
      {(error || searchError) && (
        <p className="text-red-500 text-sm mt-1">{error || searchError}</p>
      )}
    </div>
  )
}

export default CityField
