import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function OsmTrackingMap({ riderLocation, destination, restaurantPin, mapCenter }) {
  const center = [mapCenter.lat, mapCenter.lng];
  const path =
    riderLocation && destination
      ? [
          [riderLocation.lat, riderLocation.lng],
          [destination.lat, destination.lng],
        ]
      : [];

  return (
    <MapContainer
      center={center}
      zoom={14}
      className="osm-tracking-map"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {restaurantPin && (
        <CircleMarker
          center={[restaurantPin.lat, restaurantPin.lng]}
          radius={10}
          pathOptions={{ color: "#ff4d2d", fillColor: "#ff4d2d", fillOpacity: 0.9 }}
        >
          <Popup>Restaurant</Popup>
        </CircleMarker>
      )}

      {riderLocation && (
        <CircleMarker
          center={[riderLocation.lat, riderLocation.lng]}
          radius={10}
          pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.9 }}
        >
          <Popup>Rider</Popup>
        </CircleMarker>
      )}

      {destination && (
        <CircleMarker
          center={[destination.lat, destination.lng]}
          radius={10}
          pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.9 }}
        >
          <Popup>Delivery address</Popup>
        </CircleMarker>
      )}

      {path.length === 2 && (
        <Polyline positions={path} pathOptions={{ color: "#ff4d2d", weight: 4, opacity: 0.85 }} />
      )}
    </MapContainer>
  );
}
