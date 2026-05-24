import { useMemo, useState, useEffect } from "react";
import { GoogleMap, MarkerF, PolylineF, useJsApiLoader } from "@react-google-maps/api";
import OsmTrackingMap from "./OsmTrackingMap";
import "./TrackingMap.css";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px",
};

const defaultCenter = { lat: 18.5204, lng: 73.8567 };

const toLatLng = (point) => {
  if (point?.latitude == null || point?.longitude == null) return null;
  return { lat: point.latitude, lng: point.longitude };
};

function MapLegend() {
  return (
    <div className="tracking-map-legend">
      <span>
        <i className="legend-dot restaurant" /> Restaurant
      </span>
      <span>
        <i className="legend-dot rider" /> Rider
      </span>
      <span>
        <i className="legend-dot destination" /> Delivery
      </span>
    </div>
  );
}

function OsmMapBlock({ riderLocation, destination, restaurantPin, mapCenter, hint }) {
  return (
    <div className="tracking-map-osm-wrap">
      <OsmTrackingMap
        riderLocation={riderLocation}
        destination={destination}
        restaurantPin={restaurantPin}
        mapCenter={mapCenter}
      />
      <MapLegend />
      {hint && <p className="tracking-map-hint">{hint}</p>}
    </div>
  );
}

function GoogleTrackingMap({ mapsApiKey, riderLocation, destination, restaurantPin, mapCenter, path, onFail }) {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: mapsApiKey });

  useEffect(() => {
    if (loadError) onFail();
  }, [loadError, onFail]);

  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      const hasErrorOverlay = document.querySelector(".gm-err-container, .gm-style iframe + div");
      if (hasErrorOverlay) onFail();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoaded, onFail]);

  if (loadError) return null;

  if (!isLoaded) {
    return (
      <div className="tracking-map-fallback tracking-map-loading">
        <div className="map-loading-pulse" />
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={14}>
      {restaurantPin && (
        <MarkerF position={restaurantPin} label={{ text: "S", color: "white" }} title="Restaurant" />
      )}
      {riderLocation && (
        <MarkerF position={riderLocation} label={{ text: "R", color: "white" }} title="Rider" />
      )}
      {destination && (
        <MarkerF position={destination} label={{ text: "D", color: "white" }} title="Delivery" />
      )}
      {path.length === 2 && (
        <PolylineF
          path={path}
          options={{
            strokeColor: "#FF6B35",
            strokeOpacity: 0.9,
            strokeWeight: 4,
          }}
        />
      )}
    </GoogleMap>
  );
}

export default function TrackingMap({ tracking, restaurantLocation }) {
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const preferGoogle =
    import.meta.env.VITE_USE_GOOGLE_MAPS === "true" && mapsApiKey.length > 10;

  const [useOsm, setUseOsm] = useState(!preferGoogle);

  const riderLocation = toLatLng(tracking?.currentLocation);
  const destination = toLatLng(tracking?.destination);
  const restaurantPin = toLatLng(restaurantLocation);

  const path = useMemo(() => {
    const points = [riderLocation, destination].filter(Boolean);
    return points.length === 2 ? points : [];
  }, [riderLocation, destination]);

  const mapCenter = riderLocation || destination || restaurantPin || defaultCenter;

  const handleGoogleFail = () => setUseOsm(true);

  if (useOsm) {
    return (
      <OsmMapBlock
        riderLocation={riderLocation}
        destination={destination}
        restaurantPin={restaurantPin}
        mapCenter={mapCenter}
        hint={
          preferGoogle
            ? "Showing OpenStreetMap — check your Google Maps API key in .env"
            : null
        }
      />
    );
  }

  return (
    <div className="tracking-map-osm-wrap">
      <GoogleTrackingMap
        mapsApiKey={mapsApiKey}
        riderLocation={riderLocation}
        destination={destination}
        restaurantPin={restaurantPin}
        mapCenter={mapCenter}
        path={path}
        onFail={handleGoogleFail}
      />
      <MapLegend />
    </div>
  );
}
