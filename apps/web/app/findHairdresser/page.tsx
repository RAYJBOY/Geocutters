"use client";

import { useEffect, useState } from "react";
import {
  Clock3,
  LocateFixed,
  LoaderCircle,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import {
  HairdresserMap,
  type HairdresserMapMarker,
} from "@/components/features/findHairdresser/HairdresserMap";
import { useHairdresserFilters } from "@/hooks/useHairdresserFilters";

type Hairdresser = {
  id: string;
  name: string;
  mapLat: number;
  mapLng: number;
  bio: string | null;
  yearsOfExperience: number | null;
  dbsVerified: boolean;
  distanceKm?: number;
  services: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
};

type HairdresserResponse = {
  hairdressers?: Hairdresser[];
  error?: string;
};

async function getHairdressers(
  query: string,
  signal?: AbortSignal,
): Promise<Hairdresser[]> {
  const response = await fetch(`/api/hairdresser?${query}`, { signal });
  const body: HairdresserResponse = await response.json();

  if (!response.ok) {
    throw new Error(body.error ?? "Unable to load hairdressers");
  }
  if (!Array.isArray(body.hairdressers)) {
    throw new Error("The hairdresser list could not be loaded");
  }

  return body.hairdressers;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(price);
}

export default function FindHairdresser() {
  const [result, setResult] = useState<{
    query: string;
    hairdressers: Hairdresser[];
    error: string;
  } | null>(null);
  const {
    distanceKm,
    setDistanceKm,
    hasDbsCheck,
    setHasDbsCheck,
    hasLocation,
    location,
    locating,
    locationError,
    findMyLocation,
    filterQuery,
  } = useHairdresserFilters();
  const loading = result?.query !== filterQuery;
  const error = loading ? "" : (result?.error ?? "");
  const hairdressers = loading || !result ? [] : result.hairdressers;
  const mapMarkers: HairdresserMapMarker[] = hairdressers.map(
    ({ id, name, mapLat, mapLng }) => ({
      id,
      name,
      lat: mapLat,
      lng: mapLng,
    }),
  );

  useEffect(() => {
    const controller = new AbortController();

    getHairdressers(filterQuery, controller.signal)
      .then((nextHairdressers) =>
        setResult({
          query: filterQuery,
          hairdressers: nextHairdressers,
          error: "",
        }),
      )
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            query: filterQuery,
            hairdressers: [],
            error:
              requestError instanceof Error
                ? requestError.message
                : "Unable to load hairdressers",
          });
        }
      });

    return () => controller.abort();
  }, [filterQuery]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Find a hairdresser
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse local mobile hairdressers and the services they offer.
          </p>
        </header>

        {(error || locationError) && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error || locationError}
          </p>
        )}

        <div className="grid gap-4 lg:h-[calc(100vh-12rem)] lg:min-h-[36rem] lg:grid-cols-[15rem_minmax(0,1fr)_24rem]">
          <aside
            aria-label="Filters"
            className="rounded-xl border bg-background p-4 shadow-sm sm:p-5 lg:overflow-y-auto"
          >
            <h2 className="text-base font-semibold">Filters</h2>
            <div className="mt-5 space-y-5">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label
                    htmlFor="distance-filter"
                    className="text-sm font-medium"
                  >
                    Distance from me
                  </label>
                  <button
                    type="button"
                    onClick={findMyLocation}
                    disabled={locating}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-wait disabled:opacity-70"
                  >
                    {locating ? (
                      <LoaderCircle
                        aria-hidden="true"
                        className="size-4 animate-spin"
                      />
                    ) : (
                      <LocateFixed aria-hidden="true" className="size-4" />
                    )}
                    {locating
                      ? "Finding..."
                      : hasLocation
                        ? "Update"
                        : "Use my location"}
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    id="distance-filter"
                    type="range"
                    min={1}
                    max={50}
                    step={1}
                    value={distanceKm}
                    onChange={(event) =>
                      setDistanceKm(Number(event.target.value))
                    }
                    disabled={!hasLocation}
                    className="w-full accent-foreground disabled:opacity-50"
                  />
                  <span className="w-14 text-right text-sm tabular-nums text-muted-foreground">
                    {distanceKm} km
                  </span>
                </div>
                {!hasLocation && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Share your location to filter by distance.
                  </p>
                )}
              </div>
              <label
                htmlFor="dbs-filter"
                className="flex cursor-pointer items-center gap-2 border-t pt-4 text-sm"
              >
                <input
                  id="dbs-filter"
                  type="checkbox"
                  checked={hasDbsCheck}
                  onChange={(event) => setHasDbsCheck(event.target.checked)}
                  className="size-4 accent-foreground"
                />
                Has a DBS check
              </label>
            </div>
          </aside>

          <section
            aria-label="Map"
            className="flex min-h-96 flex-col overflow-hidden rounded-xl border bg-background p-2 shadow-sm lg:min-h-0"
          >
            <h2 className="sr-only">Hairdresser map</h2>
            <HairdresserMap markers={mapMarkers} location={location} />
          </section>

          <section
            aria-label="Hairdresser results"
            className="rounded-xl border bg-background p-4 shadow-sm sm:p-5 lg:overflow-y-auto"
          >
            <h2 className="text-sm font-medium text-muted-foreground">
              {loading
                ? "Loading hairdressers..."
                : error && hairdressers.length === 0
                  ? "Results unavailable"
                  : `${hairdressers.length} ${
                      hairdressers.length === 1 ? "hairdresser" : "hairdressers"
                    }`}
            </h2>

            {loading && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border p-5 text-sm text-muted-foreground">
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
                Loading registered profiles...
              </div>
            )}

            {!loading && !error && hairdressers.length === 0 && (
              <div className="mt-4 rounded-xl border px-4 py-8 text-center">
                <Scissors
                  aria-hidden="true"
                  className="mx-auto size-6 text-muted-foreground"
                />
                <p className="mt-3 font-medium">
                  No hairdressers match these filters.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try increasing the distance or changing the DBS check filter.
                </p>
              </div>
            )}

            <ul className="mt-4 space-y-3">
              {hairdressers.map((hairdresser) => (
                <li key={hairdresser.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{hairdresser.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        {hairdresser.yearsOfExperience !== null && (
                          <span>
                            {hairdresser.yearsOfExperience}{" "}
                            {hairdresser.yearsOfExperience === 1
                              ? "year"
                              : "years"}{" "}
                            experience
                          </span>
                        )}
                        {hairdresser.distanceKm !== undefined && (
                          <span>{hairdresser.distanceKm} km away</span>
                        )}
                      </div>
                    </div>
                    {hairdresser.dbsVerified && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                        <ShieldCheck aria-hidden="true" className="size-3.5" />
                        DBS verified
                      </span>
                    )}
                  </div>

                  {hairdresser.bio && (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {hairdresser.bio}
                    </p>
                  )}

                  {hairdresser.services.length > 0 && (
                    <ul className="mt-4 divide-y rounded-lg border">
                      {hairdresser.services.map((service) => (
                        <li
                          key={service.id}
                          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 py-2.5 text-sm"
                        >
                          <span className="font-medium">{service.name}</span>
                          <span className="flex items-center gap-3 text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Clock3 aria-hidden="true" className="size-3.5" />
                              {service.durationMinutes} min
                            </span>
                            <span className="font-medium text-foreground">
                              {formatPrice(service.price)}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
