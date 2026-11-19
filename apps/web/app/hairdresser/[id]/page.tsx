"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, Mail, Phone, Sparkles } from "lucide-react";
import type {
  PublicHairdresserProfile,
  PublicHairdresserProfileResponse,
} from "@geocutters/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HairdresserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [hairdresser, setHairdresser] =
    useState<PublicHairdresserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/hairdresser/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const body: PublicHairdresserProfileResponse = await response.json();
        if (!response.ok || !body.hairdresser) {
          throw new Error(body.error ?? "Unable to load hairdresser profile");
        }
        setHairdresser(body.hairdresser);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load hairdresser profile",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  const initials = hairdresser?.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/findHairdresser"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to hairdressers
        </Link>

        {loading && (
          <p
            aria-live="polite"
            className="rounded-xl border bg-card p-6 text-center text-muted-foreground"
          >
            Loading hairdresser profile...
          </p>
        )}

        {!loading && (error || !hairdresser) && (
          <p
            role="alert"
            className="rounded-xl border bg-card p-6 text-center text-destructive"
          >
            {error || "Hairdresser profile not found"}
          </p>
        )}

        {hairdresser && (
          <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <header className="grid gap-6 border-b bg-card p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-10">
              <div
                aria-hidden="true"
                className="flex size-24 items-center justify-center rounded-2xl bg-accent text-2xl font-bold text-accent-foreground ring-1 ring-primary/15 sm:size-32 sm:text-3xl"
              >
                {initials}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  GeoCutters hairdresser
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {hairdresser.name}
                </h1>
              </div>
              <Button
                nativeButton={false}
                render={
                  <a
                    href={`mailto:${hairdresser.email}?subject=${encodeURIComponent(
                      `Hairdressing enquiry for ${hairdresser.name}`,
                    )}`}
                  />
                }
                className="h-10"
              >
                <Mail aria-hidden="true" />
                Contact {hairdresser.name.split(/\s+/)[0]}
              </Button>
            </header>

            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
              <aside className="space-y-8">
                <section aria-labelledby="contact-heading">
                  <h2
                    id="contact-heading"
                    className="text-sm font-semibold uppercase tracking-wider"
                  >
                    Contact
                  </h2>
                  <div className="mt-4 space-y-3">
                    <a
                      href={`mailto:${hairdresser.email}`}
                      className="flex min-w-0 items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <Mail
                        aria-hidden="true"
                        className="size-5 shrink-0 text-muted-foreground"
                      />
                      <span className="min-w-0">
                        <span className="block text-xs text-muted-foreground">
                          Email
                        </span>
                        <span className="block truncate text-sm font-medium">
                          {hairdresser.email}
                        </span>
                      </span>
                    </a>
                    {hairdresser.phone ? (
                      <a
                        href={`tel:${hairdresser.phone.replace(/[^\d+]/g, "")}`}
                        className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <Phone
                          aria-hidden="true"
                          className="size-5 shrink-0 text-muted-foreground"
                        />
                        <span>
                          <span className="block text-xs text-muted-foreground">
                            Phone
                          </span>
                          <span className="block text-sm font-medium">
                            {hairdresser.phone}
                          </span>
                        </span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
                        <Phone
                          aria-hidden="true"
                          className="size-5 shrink-0 text-muted-foreground"
                        />
                        <span>
                          <span className="block text-xs text-muted-foreground">
                            Phone
                          </span>
                          <span className="block text-sm font-medium">
                            Not provided
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </section>

                <section aria-labelledby="credentials-heading">
                  <h2
                    id="credentials-heading"
                    className="text-sm font-semibold uppercase tracking-wider"
                  >
                    Credentials
                  </h2>
                  <dl className="mt-4 divide-y border-y">
                    <div className="flex items-center gap-3 py-4">
                      <Sparkles
                        aria-hidden="true"
                        className="size-5 shrink-0 text-muted-foreground"
                      />
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Experience
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium">
                          {hairdresser.yearsOfExperience === null
                            ? "Not specified"
                            : `${hairdresser.yearsOfExperience} ${
                                hairdresser.yearsOfExperience === 1
                                  ? "year"
                                  : "years"
                              }`}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-4">
                      <BadgeCheck
                        aria-hidden="true"
                        className={`size-5 shrink-0 ${
                          hairdresser.dbsVerified
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          DBS status
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium">
                          {hairdresser.dbsVerified
                            ? "Verified"
                            : "Not verified"}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </section>
              </aside>

              <section aria-labelledby="bio-heading" className="min-w-0">
                <Card>
                  <CardHeader>
                    <CardTitle id="bio-heading" className="text-2xl">
                      Bio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-base leading-7 text-muted-foreground">
                      {hairdresser.bio || "No bio has been added yet."}
                    </p>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle id="services-heading" className="text-2xl">
                      Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hairdresser.services === undefined ? (
                      <p className="text-sm text-muted-foreground">
                        Service information is currently unavailable.
                      </p>
                    ) : hairdresser.services.length > 0 ? (
                      <ul className="divide-y">
                        {hairdresser.services.map((service) => (
                          <li
                            key={service.id}
                            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                          >
                            <div className="min-w-0">
                              <p className="font-medium">{service.name}</p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {service.durationMinutes} minutes
                              </p>
                            </div>
                            <p className="shrink-0 text-right font-semibold">
                              {formatPrice(service.price)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No services have been added yet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </section>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
