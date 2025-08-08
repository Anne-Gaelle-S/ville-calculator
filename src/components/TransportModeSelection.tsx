import React from "react"

import type { ITransportMode } from "../types/commute.types"

interface ITransportModeSelectionProps {
  selectedMode: ITransportMode
  onModeChange: (mode: ITransportMode) => void
}

const TransportModeSelection: React.FC<ITransportModeSelectionProps> = ({
  selectedMode,
  onModeChange,
}) => {
  const transportModes: {
    value: ITransportMode
    label: string
    icon: string
  }[] = [
    { value: "drive", label: "Voiture", icon: "🚗" },
    { value: "walk", label: "Marche", icon: "🚶" },
    { value: "bicycle", label: "Vélo", icon: "🚴" },
    { value: "transit", label: "Transport public", icon: "🚌" },
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Mode de transport
      </label>
      <div className="grid grid-cols-2 gap-2">
        {transportModes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onModeChange(mode.value)}
            className={`p-3 text-sm border rounded-md transition-colors ${
              selectedMode === mode.value
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span className="mr-2">{mode.icon}</span>
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TransportModeSelection
