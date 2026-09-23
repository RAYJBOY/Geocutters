import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LeafletMapProps {
  lat: number;
  lng: number;
  radius: number;
}

export default function LeafletMap({ lat, lng, radius }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  // Initialize map and update location
  useEffect(() => {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Initialize map only once
    if (!mapRef.current) {
      const map = L.map('map', { attributionControl: false }).setView([lat, lng], 12);
      mapRef.current = map;

      // Add map tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Add marker
      markerRef.current = L.circleMarker([lat, lng], {
        radius: 6,
        fillColor: '#3b82f6',
        color: '#1e40af',
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(map);
    }

    // Update marker position and map view only when location changes
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    mapRef.current?.setView([lat, lng], 12);
  }, [lat, lng]);

  // Update circle only when radius changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (circleRef.current) {
      circleRef.current.remove();
    }

    circleRef.current = L.circle([lat, lng], {
      radius: radius,
      color: '#60a5fa',
      weight: 2,
      fillColor: '#bfdbfe',
      fillOpacity: 0.25,
    }).addTo(mapRef.current);
  }, [radius, lat, lng]);

  return <div id="map" className="w-full h-64 rounded-lg border border-border bg-slate-50" />;
}