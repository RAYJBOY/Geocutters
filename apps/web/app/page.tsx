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
        image="/images/heroImage.jpg"
        title="Your stylist, at your door"
        description="Mobile. Professional. Personal."
      >
        <Link href="/findHairdresser">
          <Button className="h-12 bg-background text-foreground hover:bg-foreground hover:text-background">
            Find hairdresser
          </Button>
        </Link>
      </Hero>
      <WhyChooseUs />
      <HowItWorks />
      <RegisterAsAHairdresser />
    </>
  );
}
