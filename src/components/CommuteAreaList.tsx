import React from "react"

import type { ICommuteArea } from "../types/commute.types"

interface ICommuteAreaListProps {
  commuteAreas: ICommuteArea[]
  onRemoveArea: (id: string) => void
}

const CommuteAreaList: React.FC<ICommuteAreaListProps> = ({
  commuteAreas,
  onRemoveArea,
}) => {
  const getModeIcon = (mode: string): string => {
    const modeIcons: Record<string, string> = {
      drive: "🚗",
      walk: "🚶",
      bicycle: "🚴",
      transit: "🚌",
    }
    return modeIcons[mode] || "🚗"
  }

  if (commuteAreas.length === 0) {
    return null
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h4 className="text-md font-medium text-gray-800 mb-3">
        Zones de temps de trajet ({commuteAreas.length})
      </h4>

      <div className="space-y-2">
        {commuteAreas.map((area) => (
          <div
            key={area.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: area.color }}
                title={`Zone ${area.location.address}`}
              ></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {area.location.address}
                </p>
                <p className="text-xs text-gray-500">
                  {getModeIcon(area.mode)} {area.timeInMinutes} min •{" "}
                  {area.mode}
                </p>
              </div>
            </div>

            <button
              onClick={() => onRemoveArea(area.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors flex-shrink-0"
              title="Supprimer cette zone"
              aria-label={`Supprimer la zone ${area.location.address}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommuteAreaList
