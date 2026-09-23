"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface MapViewProps {
  lat: number;
  lng: number;
  radius: number;
}

export const MapView = ({ lat, lng, radius }: MapViewProps) => {
  return (
    <div>
      <LeafletMap lat={lat} lng={lng} radius={radius} />
      <p className="text-xs text-muted-foreground text-center mt-2">
        Blue circle shows your {radius / 1000}km service area
      </p>
    </div>
  );
};
