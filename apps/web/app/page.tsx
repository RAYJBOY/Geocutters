import { Hero } from "@/components/common/Hero";
import { HowItWorks } from "@/components/common/HowItWorks";
import { RegisterAsAHairdresser } from "@/components/common/RegisterAsAHairdresser";
import { WhyChooseUs } from "@/components/common/WhyChooseUs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero
        title="Your stylist, at your door"
        description="Find trusted mobile hairdressers near you for professional hair care in the comfort of your home."
      >
        <Link href="/findHairdresser">
          <Button className="h-12 rounded-full bg-primary px-7 text-base text-primary-foreground shadow-lg shadow-primary/15 hover:bg-primary/90">
            Find hairdresser
          </Button>
        </Link>
        <Link href="/joinAsHairdresser">
          <Button
            variant="outline"
            className="h-12 rounded-full border-border bg-card px-7 text-base text-card-foreground hover:border-primary/30 hover:bg-accent"
          >
            Join as a hairdresser
          </Button>
        </Link>
      </Hero>
      <WhyChooseUs />
      <HowItWorks />
      <RegisterAsAHairdresser />
    </>
  );
}
