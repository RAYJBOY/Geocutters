import { Button } from "@/components/ui/button";
import Link from "next/link";

export const RegisterAsAHairdresser = () => {
  return (
    <section className="py-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        {/* Left content */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Take your business
            <br />
            <span className="text-emerald-400">mobile & independent.</span>
          </h2>

          <p className="text-foreground mb-6 max-w-md">
            Set your own hours, work in your local area, and get found by
            hundreds of customers nearby.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register">
              <Button className="bg-foreground hover:bg-background hover:text-foreground w-full sm:w-auto">
                Register as a hairdresser
              </Button>
            </Link>
          </div>
        </div>

        {/* Right image */}
        <div className="w-full md:w-80 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500&h=375&fit=crop&auto=format"
            alt="Hairdresser"
            className="w-full rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};