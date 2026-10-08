"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

export type HairdresserMapMarker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type Coordinates = {
  lat: number;
  lng: number;
};

type HairdresserMapProps = {
  markers: HairdresserMapMarker[];
  location: Coordinates | null;
};

const LeafletResultsMap = dynamic(() => import("./LeafletResultsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-96 items-center justify-center bg-muted text-sm text-muted-foreground">
      Loading map...
    </div>
  ),
});

export function HairdresserMap({ markers, location }: HairdresserMapProps) {
  if (markers.length === 0 && !location) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center rounded-lg border bg-muted/50 px-6 text-center text-sm text-muted-foreground">
        Hairdresser locations will appear here when profiles are available.
      </div>
    );
  }

  return <LeafletResultsMap markers={markers} location={location} />;
}
