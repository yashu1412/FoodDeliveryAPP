const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 120000,
};

export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported on this device."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        const messages = {
          1: "Location permission denied. Allow location access in your browser settings.",
          2: "Unable to determine your location. Try again.",
          3: "Location request timed out. Please try again.",
        };
        reject(new Error(messages[error.code] || "Failed to get your location."));
      },
      GEOLOCATION_OPTIONS
    );
  });

export const reverseGeocode = async (latitude, longitude) => {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "json",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Could not resolve address for your location.");
  }

  const data = await response.json();
  const address = data.address || {};

  const shortLabel =
    address.suburb ||
    address.neighbourhood ||
    address.city_district ||
    address.city ||
    address.town ||
    address.village ||
    address.state ||
    "Current location";

  return {
    label: shortLabel,
    fullAddress: data.display_name || shortLabel,
    city: address.city || address.town || address.village || "",
    state: address.state || "",
    pincode: address.postcode || "",
  };
};

export const detectCurrentLocation = async () => {
  const { latitude, longitude } = await getCurrentPosition();
  const address = await reverseGeocode(latitude, longitude);

  return {
    latitude,
    longitude,
    label: address.label,
    fullAddress: address.fullAddress,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    updatedAt: new Date().toISOString(),
  };
};
