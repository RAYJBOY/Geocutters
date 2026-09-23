import { Hero } from "@/components/common/Hero";
import { HowItWorks } from "@/components/common/HowItWorks";
import { RegisterAsAHairdresser } from "@/components/common/RegisterAsAHairdresser";
import { WhyChooseUs } from "@/components/common/WhyChooseUs";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <>
      <Hero
        image="/images/heroImage.jpg"
        title="Your stylist, at your door"
        description="Mobile. Professional. Personal."
      >
        <Field>
          <ButtonGroup>
            <Input
              id="input-button-group"
              placeholder="Your postcode or address..."
              className="h-12 bg-background"
            />
            <Button
              variant="outline"
              className="h-12 bg-foreground text-background"
            >
              Search
            </Button>
          </ButtonGroup>
        </Field>
      </Hero>
      <WhyChooseUs />
      <HowItWorks />
      <RegisterAsAHairdresser />
    </>
  );
}
