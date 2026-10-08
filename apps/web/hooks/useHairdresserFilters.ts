"use client";

import { useMemo, useState } from "react";

const DEFAULT_DISTANCE_KM = 10;

export function useHairdresserFilters() {
  const [distanceKm, setDistanceKm] = useState(DEFAULT_DISTANCE_KM);
  const [hasDbsCheck, setHasDbsCheck] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const filterQuery = useMemo(() => {
    const params = new URLSearchParams({
      hasDbsCheck: String(hasDbsCheck),
    });

    if (location) {
      params.set("lat", String(location.lat));
      params.set("lng", String(location.lng));
      params.set("distanceKm", String(distanceKm));
    }

    return params.toString();
  }, [distanceKm, hasDbsCheck, location]);

  const findMyLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Location search is not supported by this browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lng: coords.longitude });
        setLocating(false);
      },
      (error) => {
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Allow location access in your browser to filter by distance."
            : error.code === error.TIMEOUT
              ? "Your location could not be found in time. Please try again."
              : "Your location is unavailable. Please try again.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  };

  return {
    distanceKm,
    setDistanceKm,
    hasDbsCheck,
    setHasDbsCheck,
    hasLocation: location !== null,
    location,
    locating,
    locationError,
    findMyLocation,
    filterQuery,
  };
}
