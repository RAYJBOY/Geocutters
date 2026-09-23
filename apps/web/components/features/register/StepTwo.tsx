"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapView } from "@/components/common/MapView";

type SearchResult = {
  lat: string;
  lon: string;
  display_name: string;
};

type StepTwoProps = {
  lat: number | null;
  setLat: (lat: number) => void;
  lng: number | null;
  setLng: (lng: number) => void;
  radius: number;
  setRadius: (radius: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export const StepTwo = ({
  lat,
  setLat,
  lng,
  setLng,
  radius,
  setRadius,
  onNext,
  onBack,
}: StepTwoProps) => {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setLoading(false);
        },
        () => {
          setError("Please enable location access to continue");
          setLoading(false);
        },
      );
    }
  }, []);

  useEffect(() => {
    if (!address.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setError("");

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=5&countrycodes=gb`,
        );
        const data = await response.json();

        if (data.length > 0) {
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError("Failed to search address");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [address]);

  const handleSelectResult = (result: SearchResult) => {
    setLat(parseFloat(result.lat));
    setLng(parseFloat(result.lon));
    setAddress(result.display_name);
    setResults([]);
  };

  if (loading) {
    return (
      <div className="text-center text-muted-foreground">
        Getting your location...
      </div>
    );
  }

  if (error && !lat) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!lat || !lng) {
    return null;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      {/* Search input - high z-index */}
      <div className="mb-6 relative z-50">
        <label className="text-xs font-medium text-foreground block mb-2">
          Search location (optional)
        </label>

        <div className="relative">
          <Input
            placeholder="Enter UK address or postcode..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-background w-full"
          />

          {/* Dropdown results */}
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl max-h-64 overflow-y-auto">
              {results.map((result, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left px-3 py-2 hover:bg-muted text-sm text-foreground first:rounded-t-lg last:rounded-b-lg border-b border-border last:border-b-0"
                >
                  {result.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Map - lower z-index */}
      <div className="relative z-0">
        <MapView lat={lat} lng={lng} radius={radius} />
      </div>

      <div className="mb-6 mt-6">
        <label className="text-xs font-medium text-foreground block mb-2">
          Service radius: {(radius / 1000).toFixed(0)} km
        </label>
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  );
};
