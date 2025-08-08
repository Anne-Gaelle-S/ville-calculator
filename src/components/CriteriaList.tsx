import React from "react"
import type { Criteria } from "../types"

interface CriteriaListProps {
  criteria: Criteria[]
  onDeleteCriteria: (id: string) => void
}

const CriteriaList: React.FC<CriteriaListProps> = ({
  criteria,
  onDeleteCriteria,
}) => {
  const formatTravelTimeField = (duration: {
    hours: number
    minutes: number
  }) => {
    const h = duration.hours.toString().padStart(2, "0")
    const m = duration.minutes.toString().padStart(2, "0")
    return `${h}h${m}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (criteria.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">No criteria saved yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Saved Criteria ({criteria.length})
      </h3>

      {criteria.map((criteriaItem) => (
        <div
          key={criteriaItem.id}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-lg font-medium text-gray-800">
                  📍 {criteriaItem.city}
                </span>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                  ⏱️ {formatTravelTimeField(criteriaItem.duration)}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                Added on {formatDate(criteriaItem.creationDate)}
              </p>
            </div>

            <button
              onClick={() => onDeleteCriteria(criteriaItem.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
              title="Delete this criteria"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>
      ))}
    </div>
  )
}

export default CriteriaList
