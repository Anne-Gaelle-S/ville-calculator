import React, { useState } from "react"
import CityField from "./CityField"
import TravelTimeField from "./TravelTimeField"
import type { FormData, FormErrors } from "../types"

interface FormProps {
  onSubmit: (data: {
    city: string
    duration: { hours: number; minutes: number }
  }) => void
}

const CriteriaForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    city: "",
    hours: "",
    minutes: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.city.trim()) {
      newErrors.city = "Please select a city"
    }

    const hours = parseInt(formData.hours) || 0
    const minutes = parseInt(formData.minutes) || 0

    if (formData.hours === "" && formData.minutes === "") {
      newErrors.duration = "Please enter a duration"
    } else if (hours === 0 && minutes === 0) {
      newErrors.duration = "TravelTimeField must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const hours = parseInt(formData.hours) || 0
      const minutes = parseInt(formData.minutes) || 0

      onSubmit({
        city: formData.city.trim(),
        duration: { hours, minutes },
      })

      setFormData({
        city: "",
        hours: "",
        minutes: "",
      })

      setErrors({})
    } catch (error) {
      console.error("Error during submission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          New Criteria
        </h2>

        <div className="space-y-4">
          <CityField
            value={formData.city}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, city: value }))
            }
            error={errors.city}
          />

          <TravelTimeField
            hours={formData.hours}
            minutes={formData.minutes}
            onHoursChange={(value) =>
              setFormData((prev) => ({ ...prev, hours: value }))
            }
            onMinutesChange={(value) =>
              setFormData((prev) => ({ ...prev, minutes: value }))
            }
            error={errors.duration}
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            } text-white`}
          >
            {isSubmitting ? "Saving..." : "Save Criteria"}
          </button>
        </div>
      </div>
    </form>
  )
}

export default CriteriaForm
