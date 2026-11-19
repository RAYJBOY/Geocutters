import { CalendarDays, Heart, Search } from "lucide-react";
import { InfoCards } from "./InfoCards";

const HOW_STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Search your way",
    description: "Enter your area to begin your search.",
  },
  {
    number: "02",
    icon: Heart,
    title: "Choose your match",
    description: "Compare services and prices.",
  },
  {
    number: "03",
    icon: CalendarDays,
    title: "Book your slot",
    description: "Contact the hairdresser to book a slot with them at a time that works for you.",
  },
];

export const HowItWorks = () => {
  return (
    <InfoCards
      eyebrow="How it works"
      title="Good hair days, made simple"
      description="From search to salon chair in three easy steps."
      items={HOW_STEPS}
    />
  );
};
