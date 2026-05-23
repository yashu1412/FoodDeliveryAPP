import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, MarkerF, PolylineF, useJsApiLoader } from "@react-google-maps/api";
import { io } from "socket.io-client";
import Footer from "../components/Footer";
import { API_BASE_URL, apiRequest } from "../utils/api";

const mapContainerStyle = {
  width: "100%",
  height: "420px",
};

export default function TrackOrder() {
  const { orderId } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [deliveryPartner, setDeliveryPartner] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/tracking/${orderId}`);
        setTrackingData(data.tracking);
        setOrderStatus(data.orderStatus);
        setDeliveryPartner(data.deliveryPartner);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [orderId]);

  useEffect(() => {
    const socketBaseUrl = API_BASE_URL.replace(/\/api$/, "");
    const socket = io(socketBaseUrl, {
      transports: ["websocket"],
    });

    socket.emit("order:join", orderId);

    socket.on("order:locationUpdated", (payload) => {
      setTrackingData(payload.tracking);
      setOrderStatus(payload.status);
    });

    socket.on("order:statusUpdated", (payload) => {
      setOrderStatus(payload.status);
    });

    return () => {
      socket.emit("order:leave", orderId);
      socket.disconnect();
    };
  }, [orderId]);

  const currentLocation = trackingData?.currentLocation?.latitude != null
    ? {
        lat: trackingData.currentLocation.latitude,
        lng: trackingData.currentLocation.longitude,
      }
    : null;

  const destination = trackingData?.destination?.latitude != null
    ? {
        lat: trackingData.destination.latitude,
        lng: trackingData.destination.longitude,
      }
    : null;

  const path = useMemo(() => {
    if (!currentLocation || !destination) {
      return [];
    }

    return [currentLocation, destination];
  }, [currentLocation, destination]);

  const mapCenter = currentLocation || destination || { lat: 20.5937, lng: 78.9629 };

  return (
    <>
      <main className="min-h-screen bg-gray-50 px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Live Order Tracking</h1>
          <p className="text-gray-600 mb-6">
            Track your order on Google Maps with live Socket.io updates.
          </p>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {loading ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm">Loading tracking...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
              <section className="bg-white rounded-2xl shadow-sm p-4">
                {import.meta.env.VITE_GOOGLE_MAPS_API_KEY && isLoaded ? (
                  <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={13}>
                    {currentLocation && <MarkerF position={currentLocation} label="You Order" />}
                    {destination && <MarkerF position={destination} label="Home" />}
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
                ) : (
                  <div className="h-[420px] rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                    Add `VITE_GOOGLE_MAPS_API_KEY` to enable the live Google Map.
                  </div>
                )}
              </section>

              <aside className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Tracking Details</h2>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Order Status:</span> {orderStatus}
                  </div>
                  <div>
                    <span className="font-medium">Delivery Partner:</span>{" "}
                    {deliveryPartner?.fullName || "Awaiting assignment"}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {deliveryPartner?.mobile || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Current Latitude:</span>{" "}
                    {trackingData?.currentLocation?.latitude ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Current Longitude:</span>{" "}
                    {trackingData?.currentLocation?.longitude ?? "N/A"}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Tracking History</h3>
                  <div className="space-y-2 max-h-72 overflow-auto">
                    {(trackingData?.history || []).slice().reverse().map((point, index) => (
                      <div key={`${point.updatedAt}-${index}`} className="rounded-lg bg-gray-50 p-3 text-sm">
                        <div className="font-medium">{point.source}</div>
                        <div>
                          {point.latitude}, {point.longitude}
                        </div>
                        <div className="text-gray-500">
                          {new Date(point.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
