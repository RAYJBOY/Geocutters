import Link from "next/link";
import { Check, MapPin } from "lucide-react";
import type { HairdresserSearchResult } from "@geocutters/shared";
import { Card, CardContent } from "@/components/ui/card";

type HairdresserCardProps = {
  hairdresser: HairdresserSearchResult;
};

export function HairdresserCard({ hairdresser }: HairdresserCardProps) {
  const initials = hairdresser.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <li>
      <Link
        href={`/hairdresser/${encodeURIComponent(hairdresser.id)}`}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label={`View ${hairdresser.name}'s profile`}
      >
        <Card className="w-full p-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-foreground ring-1 ring-primary/15"
              >
                {initials}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate text-lg font-bold tracking-tight text-foreground">
                  {hairdresser.name}
                </h3>
                {hairdresser.yearsOfExperience !== null && (
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {hairdresser.yearsOfExperience}{" "}
                    {hairdresser.yearsOfExperience === 1
                      ? "year"
                      : "years"}{" "}
                    of experience
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  {hairdresser.distanceKm !== undefined && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                      <MapPin aria-hidden="true" className="size-4" />
                      {hairdresser.distanceKm} km away
                    </span>
                  )}
                  {hairdresser.dbsVerified && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/20 bg-accent px-2.5 py-1 text-xs font-medium text-primary">
                      <Check aria-hidden="true" className="size-4" />
                      DBS
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}
