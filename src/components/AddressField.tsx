import React, { useState, useCallback, useRef } from "react"

import { geocodingService } from "../services/geocoding.service"
import type { ICoordinates } from "../types/commute.types"

interface IAddressFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  label?: string
}

interface IAddressSuggestion {
  address: string
  coordinates: ICoordinates
}

const AddressField: React.FC<IAddressFieldProps> = ({
  value,
  onChange,
  error,
  placeholder = "Rechercher une adresse ou une ville...",
  label = "Adresse de départ",
}) => {
  const [suggestions, setSuggestions] = useState<IAddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const timeoutRef = useRef<number | null>(null)

  // Recherche de suggestions simplifiée
  const searchSuggestions = useCallback(async (query: string) => {
    console.log("🎯 AddressField: recherche pour", query)

    if (query.trim().length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const results = await geocodingService.searchAddresses(query)
      console.log("📋 AddressField: résultats reçus", results)
      setSuggestions(results)
      setShowSuggestions(true)
    } catch (error) {
      console.error("❌ AddressField: erreur", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Gestion du changement de saisie avec debouncing
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      onChange(inputValue)

      // Annuler la recherche précédente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Lancer une nouvelle recherche avec debouncing
      timeoutRef.current = setTimeout(() => {
        searchSuggestions(inputValue)
      }, 300)
    },
    [onChange, searchSuggestions]
  )

  // Gestion de la sélection d'une suggestion
  const handleSuggestionSelection = useCallback(
    (suggestion: IAddressSuggestion) => {
      onChange(suggestion.address)
      setShowSuggestions(false)
      setSuggestions([])
    },
    [onChange]
  )

  // Gestion de la perte de focus
  const handleBlur = useCallback(() => {
    setTimeout(() => setShowSuggestions(false), 200)
  }, [])

  // Gestion du focus
  const handleFocus = useCallback(() => {
    if (value.trim().length >= 3 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }, [value, suggestions.length])

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <p className="text-xs text-gray-500 mb-2">
        💡 Tapez au moins 3 caractères pour voir les suggestions d'adresses
      </p>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
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
      {showSuggestions && suggestions.length > 0 && !isLoading && (
        <ul
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.address}-${index}`}
              onClick={() => handleSuggestionSelection(suggestion)}
              className="px-3 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              role="option"
              aria-selected={false}
            >
              <p className="flex-1 min-w-0 text-sm font-medium text-gray-900 truncate">
                {suggestion.address}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Message quand aucune adresse n'est trouvée */}
      {showSuggestions &&
        suggestions.length === 0 &&
        !isLoading &&
        value.trim().length >= 3 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 px-3 py-2 text-gray-500 text-sm shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
              <span>
                Aucune adresse trouvée. L'application utilisera Paris par
                défaut.
              </span>
            </div>
          </div>
        )}

      {/* Messages d'état */}
      {isLoading && (
        <p className="text-sm text-gray-500 mt-1">
          Recherche d'adresse en cours...
        </p>
      )}

      {/* Affichage des erreurs */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default AddressField
