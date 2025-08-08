import React, { useState } from "react"

import type {
  ITransportMode,
  ICommuteArea,
  ILocation,
} from "../types/commute.types"
import { geocodingService } from "../services/geocoding.service"

// Composants
import AddressField from "./AddressField"
import TransportModeSelection from "./TransportModeSelection"
import TravelTimeSlider from "./TravelTimeSlider"
import SubmitButton from "./SubmitButton"
import ErrorDisplay from "./ErrorDisplay"
import CommuteAreaList from "./CommuteAreaList"

interface ICommuteMapFormProps {
  commuteAreas: ICommuteArea[]
  isLoading: boolean
  error: string | null
  addCommuteArea: (
    location: ILocation,
    mode: ITransportMode,
    timeInMinutes: number
  ) => Promise<void>
  removeCommuteArea: (id: string) => void
  onCommuteAreaAdded?: (coordinates: ILocation["coordinates"]) => void
}

const CommuteMapForm: React.FC<ICommuteMapFormProps> = ({
  commuteAreas,
  isLoading,
  error,
  addCommuteArea,
  removeCommuteArea,
  onCommuteAreaAdded,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [selectedMode, setSelectedMode] = useState<ITransportMode>("drive")
  const [travelTime, setTravelTime] = useState<number>(30)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleAddCommuteArea = async () => {
    setIsSubmitting(true)
    if (!selectedAddress.trim()) {
      return
    }

    try {
      // Récupération des coordonnées de l'adresse sélectionnée
      const coordinates = await geocodingService.getCityCoordinatesWithFallback(
        selectedAddress
      )

      await addCommuteArea(
        {
          address: selectedAddress,
          coordinates,
        },
        selectedMode,
        travelTime
      )

      // Centrer la carte sur la nouvelle zone
      onCommuteAreaAdded?.(coordinates)
      setSelectedAddress("")
    } catch {
      // Gestion silencieuse des erreurs
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🗺️ Ajouter une zone de temps de trajet
      </h3>

      <div className="space-y-4">
        <AddressField value={selectedAddress} onChange={setSelectedAddress} />

        <TransportModeSelection
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
        />

        <TravelTimeSlider
          travelTime={travelTime}
          onTravelTimeChange={setTravelTime}
        />

        <SubmitButton
          isLoading={isLoading || isSubmitting}
          isDisabled={!selectedAddress.trim()}
          onClick={handleAddCommuteArea}
        />

        <ErrorDisplay error={error} />
      </div>

      <CommuteAreaList
        commuteAreas={commuteAreas}
        onRemoveArea={removeCommuteArea}
      />
    </div>
  )
}

export default CommuteMapForm
