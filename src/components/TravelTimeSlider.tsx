import React from "react"

interface ITravelTimeSliderProps {
  travelTime: number
  onTravelTimeChange: (time: number) => void
  minTime?: number
  maxTime?: number
  step?: number
}

const TravelTimeSlider: React.FC<ITravelTimeSliderProps> = ({
  travelTime,
  onTravelTimeChange,
  minTime = 5,
  maxTime = 60, // Limite Geoapify: 60 minutes maximum
  step = 5,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTravelTimeChange(Number(e.target.value))
  }

  const formatTime = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return mins > 0 ? `${hours}h${mins}` : `${hours}h`
    }
    return `${minutes} min`
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Temps de trajet maximum: {formatTime(travelTime)}
      </label>
      <input
        type="range"
        min={minTime}
        max={maxTime}
        step={step}
        value={travelTime}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{formatTime(minTime)}</span>
        <span>{formatTime(Math.floor(maxTime / 2))}</span>
        <span>{formatTime(maxTime)}</span>
      </div>
    </div>
  )
}

export default TravelTimeSlider
