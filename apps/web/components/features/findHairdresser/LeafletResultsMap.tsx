"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { HairdresserMapMarker } from "./HairdresserMap";

type Coordinates = {
  lat: number;
  lng: number;
};

type LeafletResultsMapProps = {
  markers: HairdresserMapMarker[];
  location: Coordinates | null;
};

export default function LeafletResultsMap({
  markers,
  location,
}: LeafletResultsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pinsRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: true,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    pinsRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      pinsRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const pins = pinsRef.current;
    if (!map || !pins) return;

    pins.clearLayers();
    const positions: L.LatLngExpression[] = [];

    for (const marker of markers) {
      const position: L.LatLngExpression = [marker.lat, marker.lng];
      positions.push(position);
      L.circleMarker(position, {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: "#111827",
        fillOpacity: 1,
      })
        .bindTooltip(marker.name)
        .addTo(pins);
    }

    if (location) {
      const position: L.LatLngExpression = [location.lat, location.lng];
      positions.push(position);
      L.circleMarker(position, {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: "#2563eb",
        fillOpacity: 1,
      })
        .bindTooltip("Your location")
        .addTo(pins);
    }

    if (positions.length === 1) {
      map.setView(positions[0], 12);
    } else if (positions.length > 1) {
      map.fitBounds(L.latLngBounds(positions), { padding: [32, 32] });
    }
  }, [location, markers]);

  return (
    <div
      ref={containerRef}
      aria-label="Map of hairdresser locations"
      className="h-full min-h-96 w-full rounded-lg bg-muted"
    />
  );
}
