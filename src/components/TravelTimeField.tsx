import React from "react"

interface TravelTimeFieldProps {
  hours: string
  minutes: string
  onHoursChange: (value: string) => void
  onMinutesChange: (value: string) => void
  error?: string
}

const TravelTimeField: React.FC<TravelTimeFieldProps> = ({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
  error,
}) => {
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d{0,2}$/.test(value) && (value === "" || parseInt(value) <= 23)) {
      onHoursChange(value)
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d{0,2}$/.test(value) && (value === "" || parseInt(value) <= 59)) {
      onMinutesChange(value)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Temps de trajet maximum
      </label>
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <input
            type="text"
            value={hours}
            onChange={handleHoursChange}
            placeholder="HH"
            maxLength={2}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span className="text-xs text-gray-500 text-center block mt-1">
            Heures
          </span>
        </div>

        <span className="text-xl font-semibold text-gray-500">:</span>

        <div className="flex-1">
          <input
            type="text"
            value={minutes}
            onChange={handleMinutesChange}
            placeholder="MM"
            maxLength={2}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span className="text-xs text-gray-500 text-center block mt-1">
            Minutes
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default TravelTimeField
