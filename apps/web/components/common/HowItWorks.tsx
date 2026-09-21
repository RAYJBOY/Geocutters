import { Card } from "@/components/ui/card";

const HOW_STEPS = [
  {
    num: "1",
    title: "Search your area",
    desc: "Enter your postcode to find verified hairdressers nearby.",
    color: "#0f172a",
    img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=260&fit=crop&auto=format",
  },
  {
    num: "2",
    title: "Compare & choose",
    desc: "Browse profiles, read reviews, check prices, and pick your stylist.",
    color: "#10b981",
    img: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&h=260&fit=crop&auto=format",
  },
  {
    num: "3",
    title: "They come to you",
    desc: "Relax at home. Your hairdresser arrives fully equipped.",
    color: "#2563eb",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=260&fit=crop&auto=format",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 px-4 bg-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-background mb-3">
            How it works
          </h2>
          <p className="text-muted-foreground text-base">
            Three simple steps to beautiful hair at home.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {HOW_STEPS.map((step) => (
            <Card
              key={step.num}
              className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow group p-0"
            >
              {/* Image with overlay */}
              <div className="relative h-44 overflow-hidden bg-slate-200">
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${step.color}cc, transparent 60%)`,
                  }}
                />
                {/* Step number badge */}
                <div
                  className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg"
                  style={{ background: step.color }}
                >
                  {step.num}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-foreground text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
