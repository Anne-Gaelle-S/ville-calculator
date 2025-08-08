import React from "react"

interface ISubmitButtonProps {
  isLoading: boolean
  isDisabled: boolean
  onClick: () => void
  loadingText?: string
  defaultText?: string
}

const SubmitButton: React.FC<ISubmitButtonProps> = ({
  isLoading,
  isDisabled,
  onClick,
  loadingText = "Génération en cours...",
  defaultText = "Ajouter la zone",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || isDisabled}
      className={`w-full py-3 px-4 rounded-md font-medium transition-colors cursor-pointer ${
        isLoading || isDisabled
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      }`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {loadingText}
        </span>
      ) : (
        defaultText
      )}
    </button>
  )
}

export default SubmitButton
