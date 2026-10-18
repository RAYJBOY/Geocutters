"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Check,
  LoaderCircle,
  LocateFixed,
  MapPin,
  RefreshCw,
} from "lucide-react";
import type {
  HairdresserSearchResponse,
  HairdresserSearchResult,
} from "@geocutters/shared";
import { Button } from "@/components/ui/button";
import { HairdresserCard } from "@/components/features/findHairdresser/HairdresserCard";
import { useHairdresserFilters } from "@/hooks/useHairdresserFilters";

async function getHairdressers(
  query: string,
  signal?: AbortSignal,
): Promise<HairdresserSearchResult[]> {
  const response = await fetch(`/api/hairdresser?${query}`, { signal });
  const body: HairdresserSearchResponse = await response.json();

  if (!response.ok) {
    throw new Error(body.error ?? "Unable to load hairdressers");
  }
  if (!Array.isArray(body.hairdressers)) {
    throw new Error("The hairdresser list could not be loaded");
  }

  return body.hairdressers;
}

export default function FindHairdresser() {
  const [result, setResult] = useState<{
    query: string;
    hairdressers: HairdresserSearchResult[];
    error: string;
  } | null>(null);
  const {
    hasDbsCheck,
    setHasDbsCheck,
    hasLocation,
    locating,
    locationError,
    findMyLocation,
    filterQuery,
  } = useHairdresserFilters();
  const loading =
    filterQuery !== null && result?.query !== filterQuery;
  const error = loading ? "" : (result?.error ?? "");
  const hairdressers = loading || !result ? [] : result.hairdressers;

  useEffect(() => {
    if (filterQuery === null) {
      return;
    }

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
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Find a hairdresser
          </h1>
          <p className="mt-2 text-muted-foreground">
            See local hairdressers whose service areas cover you.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside
            aria-label="Search filters"
            className="h-fit rounded-xl border bg-background p-4 shadow-sm sm:p-5"
          >
            <h2 className="text-base font-semibold">Filters</h2>

            <div className="mt-5 border-b pb-5">
              <h3 className="text-sm font-medium">Your location</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                We’ll match you with hairdressers who serve your area.
              </p>
              <Button
                type="button"
                onClick={findMyLocation}
                disabled={locating}
                variant="outline"
                className="mt-4 w-full"
              >
                {locating ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin"
                  />
                ) : hasLocation ? (
                  <RefreshCw aria-hidden="true" className="size-4" />
                ) : (
                  <LocateFixed aria-hidden="true" className="size-4" />
                )}
                {locating
                  ? "Finding location..."
                  : hasLocation
                    ? "Update location"
                    : "Use my location"}
              </Button>
              {hasLocation && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                  <Check aria-hidden="true" className="size-3.5" />
                  Location shared
                </p>
              )}
              {locationError && (
                <p role="alert" className="mt-3 text-xs leading-5 text-destructive">
                  {locationError}
                </p>
              )}
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasDbsCheck}
                onChange={(event) => setHasDbsCheck(event.target.checked)}
                className="size-4 accent-foreground"
              />
              <BadgeCheck aria-hidden="true" className="size-4" />
              DBS-checked only
            </label>
          </aside>

          <section aria-label="Hairdresser results" className="min-w-0">
            {error && (
              <p
                role="alert"
                className="mb-6 rounded-xl border border-destructive/30 bg-background px-5 py-4 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            {!hasLocation && !locating && !locationError && (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-background px-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <MapPin aria-hidden="true" className="size-6" />
                </span>
                <h2 className="mt-4 text-lg font-semibold">
                  Share your location to find a match
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  We’ll check it against hairdressers’ service areas and show
                  only those who can come to you.
                </p>
              </div>
            )}

            {locating && !hasLocation && (
              <div
                aria-live="polite"
                className="flex min-h-64 flex-col items-center justify-center rounded-xl border bg-background px-6 text-center"
              >
                <LoaderCircle
                  aria-hidden="true"
                  className="size-8 animate-spin text-primary"
                />
                <h2 className="mt-4 font-semibold">
                  Finding hairdressers who cover you...
                </h2>
              </div>
            )}

            {hasLocation && (
              <>
                <div className="mb-5">
                  <h2 className="text-xl font-semibold tracking-tight">
                    {loading
                      ? "Finding your local hairdressers..."
                      : error
                        ? "We couldn’t load your matches"
                        : hairdressers.length > 0
                          ? `${hairdressers.length} hairdresser${
                              hairdressers.length === 1 ? "" : "s"
                            } can come to you`
                          : hasDbsCheck
                            ? "No DBS-checked matches in your area"
                            : "No coverage here just yet"}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Matches are based on each hairdresser’s service area.
                    Distance is shown for context.
                  </p>
                </div>

                {loading && (
                  <div
                    aria-live="polite"
                    className="flex min-h-64 flex-col items-center justify-center rounded-xl border bg-background px-6 text-center"
                  >
                    <LoaderCircle
                      aria-hidden="true"
                      className="size-8 animate-spin text-primary"
                    />
                    <h3 className="mt-4 font-semibold">
                      Checking service-area coverage...
                    </h3>
                  </div>
                )}

                {!loading && !error && hairdressers.length > 0 && (
                  <ul
                    aria-label="Hairdressers who cover your location"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    {hairdressers.map((hairdresser) => (
                      <HairdresserCard
                        key={hairdresser.id}
                        hairdresser={hairdresser}
                      />
                    ))}
                  </ul>
                )}

                {!loading && !error && hairdressers.length === 0 && (
                  <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-background px-6 text-center">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                      <MapPin aria-hidden="true" className="size-6" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">
                      {hasDbsCheck
                        ? "No DBS-checked hairdressers cover your location"
                        : "We’re not in your area yet"}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                      {hasDbsCheck
                        ? "Try showing all hairdressers who serve your area."
                        : "We’re growing our network. Check back soon as more hairdressers join Geocutters."}
                    </p>
                    {hasDbsCheck && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setHasDbsCheck(false)}
                        className="mt-5"
                      >
                        Show all local hairdressers
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
