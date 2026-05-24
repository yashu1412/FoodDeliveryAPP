import { useMemo } from "react";
import { GoogleMap, MarkerF, PolylineF, useJsApiLoader } from "@react-google-maps/api";
import OsmTrackingMap from "./OsmTrackingMap";
import "./TrackingMap.css";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px",
  borderRadius: "var(--radius-md)",
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

function GoogleTrackingMap({ mapsApiKey, riderLocation, destination, restaurantPin, mapCenter, path }) {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: mapsApiKey });

  if (loadError) {
    return (
      <OsmTrackingMap
        riderLocation={riderLocation}
        destination={destination}
        restaurantPin={restaurantPin}
        mapCenter={mapCenter}
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="tracking-map-fallback">
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
            strokeColor: "#ff4d2d",
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

  const riderLocation = toLatLng(tracking?.currentLocation);
  const destination = toLatLng(tracking?.destination);
  const restaurantPin = toLatLng(restaurantLocation);

  const path = useMemo(() => {
    const points = [riderLocation, destination].filter(Boolean);
    return points.length === 2 ? points : [];
  }, [riderLocation, destination]);

  const mapCenter = riderLocation || destination || restaurantPin || defaultCenter;

  if (!mapsApiKey) {
    return (
      <div className="tracking-map-osm-wrap">
        <OsmTrackingMap
          riderLocation={riderLocation}
          destination={destination}
          restaurantPin={restaurantPin}
          mapCenter={mapCenter}
        />
        <MapLegend />
        <p className="tracking-map-hint">
          Using OpenStreetMap. Add <code>VITE_GOOGLE_MAPS_API_KEY</code> for Google Maps.
        </p>
      </div>
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
      />
      <MapLegend />
    </div>
  );
}
