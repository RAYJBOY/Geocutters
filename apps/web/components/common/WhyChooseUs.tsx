import { Clock, House, ShieldCheck } from "lucide-react";
import { InfoCards } from "./InfoCards";

const FEATURES = [
  {
    number: "01",
    icon: Clock,
    title: "A time that works for you",
    description: "Find a professional who fits your schedule.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Trusted professionals",
    description: "Choose hairdressers with DBS checks.",
  },
  {
    number: "03",
    icon: House,
    title: "Care from the comfort of home",
    description: "Enjoy a professional hair appointment at your door.",
  },
];

export const WhyChooseUs = () => {
  return (
    <InfoCards
      eyebrow="Why choose us"
      title="Professional care, on your terms"
      description="Trusted local hairdressers, without the trip to the salon."
      items={FEATURES}
    />
  );
};
