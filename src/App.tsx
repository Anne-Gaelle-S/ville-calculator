// import CriteriaForm from "./components/CriteriaForm"
// import CriteriaList from "./components/CriteriaList"
import { useState, useEffect } from "react"
import CommuteMap from "./components/CommuteMap"
import CommuteMapForm from "./components/CommuteMapForm"
import { useCommuteMap } from "./hooks/useCommuteMap"
import type { ICoordinates } from "./types/commute.types"
// import { useLocalStorage } from "./hooks/useLocalStorage"

// voir https://commutetimemap.com/map?places=43.354629%253B-0.283373%253B1%253B3600%253B%2523b241f4&places=44.825817%253B-0.556073%253B1%253B1800%253B%25234143f4&places=44.874681%253B-0.607277%253B1%253B900%253B%2523fc0000
// voir https://apidocs.geoapify.com/docs/
// voir https://www.chacunsonlieu.fr/mes-villes-et-quartiers/

function App() {
  const { commuteAreas, isLoading, error, addCommuteArea, removeCommuteArea } =
    useCommuteMap()

  // État pour le centrage automatique de la carte
  const [mapCenter, setMapCenter] = useState<ICoordinates | null>(null)

  // Centrer la carte sur la première zone lors du chargement initial
  useEffect(() => {
    if (commuteAreas.length > 0 && !mapCenter) {
      setMapCenter(commuteAreas[0].location.coordinates)
    }
  }, [commuteAreas, mapCenter])

  // Fonction pour centrer la carte sur une nouvelle zone
  const handleNewAreaAdded = (coordinates: ICoordinates) => {
    setMapCenter(coordinates)
  }

  // const { criteria, addCriteria, deleteCriteria } = useLocalStorage()

  // const handleSubmitForm = (data: {
  //   city: string
  //   duration: { hours: number; minutes: number }
  // }) => {
  //   addCriteria(data)
  // }

  return (
    <div className="flex flex-col min-h-screen relative">
      <header className="h-10 flex gap-4 justify-center items-end bg-gray-100 p-2">
        <h1 className="text-lg font-bold">Ville Calculator</h1>
        <p>Pour trouver la ville de vos rêves !</p>
      </header>

      <div className="h-[calc(100vh-2.5rem)] flex">
        <CommuteMapForm
          commuteAreas={commuteAreas}
          isLoading={isLoading}
          error={error}
          addCommuteArea={addCommuteArea}
          removeCommuteArea={removeCommuteArea}
          onCommuteAreaAdded={handleNewAreaAdded}
        />
        <CommuteMap
          commuteAreas={commuteAreas}
          center={mapCenter ? [mapCenter.lat, mapCenter.lng] : undefined}
        />
      </div>

      {/* <div className="grid grid-cols-1 xl:grid-cols-12 lg:grid-cols-8 gap-8">
          <div className="xl:col-span-4 lg:col-span-4">
            <CriteriaForm onSubmit={handleSubmitForm} />
          </div>

          <div className="xl:col-span-3 lg:col-span-4">
            <CriteriaList
              criteria={criteria}
              onDeleteCriteria={deleteCriteria}
            />
          </div>

          <div className="xl:col-span-5 lg:col-span-8">
          </div>
        </div>

        {criteria.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete all criteria?"
                  )
                ) {
                  localStorage.removeItem("ville-calculator-criteria")
                  window.location.reload()
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Clear All Criteria
            </button>
          </div>
        )} */}
    </div>
  )
}

export default App
