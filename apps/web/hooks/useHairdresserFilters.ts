"use client";

import { useMemo, useState } from "react";

export function useHairdresserFilters() {
  const [hasDbsCheck, setHasDbsCheck] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const filterQuery = useMemo(() => {
    if (!location) {
      return null;
    }

    const params = new URLSearchParams({
      hasDbsCheck: String(hasDbsCheck),
      lat: String(location.lat),
      lng: String(location.lng),
    });

    return params.toString();
  }, [hasDbsCheck, location]);

  const findMyLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Location sharing is not supported by this browser.",
      );
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
            ? "Allow location access in your browser to find hairdressers who serve you."
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
