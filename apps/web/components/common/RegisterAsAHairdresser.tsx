import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const RegisterAsAHairdresser = () => {
  return (
    <section className="bg-muted px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-3xl bg-primary shadow-xl shadow-foreground/10 md:min-h-[25rem] md:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col items-start justify-center p-8 sm:p-12 lg:p-16">
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-primary-foreground/70 uppercase">
              For independent hairdressers
            </p>
            <h2 className="max-w-xl text-4xl leading-[1.05] font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Your talent deserves to be discovered.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-primary-foreground/80 sm:text-lg">
              Grow your independent business and connect with people looking
              for a trusted hairdresser in their area.
            </p>

            <Link href="/joinAsHairdresser">
              <Button
                variant="outline"
                className="mt-8 h-12 rounded-full border-border bg-card px-7 text-base text-card-foreground hover:border-primary/30 hover:bg-accent"
              >
                Join as a hairdresser
              </Button>
            </Link>
          </div>

          <div className="relative min-h-64 md:min-h-full">
            <Image
              src="/images/hair-salon-arlington-cc0.jpg"
              alt="Inside a hair salon"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent md:bg-gradient-to-r md:from-primary/20 md:via-transparent md:to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
