import React, { useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet"
import L from "leaflet"

// Import des styles CSS de Leaflet
import "leaflet/dist/leaflet.css"

import type { ICommuteArea } from "../types/commute.types"

// Fix pour les icônes par défaut de Leaflet avec webpack
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

/**
 * Composant pour recentrer automatiquement la carte
 */
interface IMapRecenterProps {
  center?: [number, number]
}

const MapRecenter: React.FC<IMapRecenterProps> = ({ center }) => {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, 12, { animate: true })
    }
  }, [center, map])

  return null
}

interface ICommuteMapProps {
  commuteAreas: ICommuteArea[]
  center?: [number, number]
  zoom?: number
  height?: string
}

const CommuteMap: React.FC<ICommuteMapProps> = ({
  commuteAreas,
  center = [48.8566, 2.3522], // Paris par défaut
  zoom = 10,
}) => {
  // Icônes pour les modes de transport
  const modeIcons: Record<string, string> = {
    drive: "🚗",
    walk: "🚶",
    bicycle: "🚴",
    transit: "🚌",
  }

  return (
    <div className="rounded-lg shadow-md overflow-hidden w-full h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          🗺️ Carte des zones de temps de trajet
        </h3>
        {commuteAreas.length === 0 ? (
          <p className="text-sm text-gray-500 mt-1">
            Ajoutez des zones de temps de trajet pour les visualiser ici
          </p>
        ) : (
          <p className="text-sm text-gray-500 mt-1">
            {commuteAreas.length} zone{commuteAreas.length > 1 ? "s" : ""}{" "}
            affichée{commuteAreas.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="h-full relative">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Composant pour recentrer automatiquement la carte */}
          <MapRecenter center={center} />

          {/* Affichage des zones de temps de trajet */}
          {commuteAreas.map((area) => {
            return (
              <React.Fragment key={area.id}>
                {/* Polygones des isochrones - Utilisation directe du GeoJSON complet */}
                <GeoJSON
                  key={area.id}
                  data={area.geoJSON}
                  style={{
                    fillColor: area.color || "#3B82F6",
                    weight: 2,
                    opacity: 0.8,
                    color: area.color || "#3B82F6",
                    fillOpacity: 0.4,
                  }}
                  onEachFeature={(_, layer) => {
                    layer.bindPopup(`Zone ${area.location.address}`)
                  }}
                />

                {/* Marker du point de départ */}
                <Marker
                  position={[
                    area.location.coordinates.lat,
                    area.location.coordinates.lng,
                  ]}
                >
                  <Popup>
                    <div style={{ fontFamily: "system-ui", minWidth: "150px" }}>
                      <h3
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {area.location.address}
                      </h3>
                      <p
                        style={{
                          margin: "4px 0",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        {modeIcons[area.mode] || "🚗"} {area.mode} •{" "}
                        {area.timeInMinutes} minutes
                      </p>
                      <p
                        style={{
                          margin: "4px 0",
                          fontSize: "11px",
                          color: "#888",
                        }}
                      >
                        Créé le {new Date(area.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            )
          })}
        </MapContainer>
      </div>

      {/* Légende des couleurs */}
      {commuteAreas.length > 0 && (
        <div className="p-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Légende :</h4>
          <div className="flex flex-wrap gap-3">
            {commuteAreas.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: area.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {area.location.address} ({area.timeInMinutes}min)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommuteMap
