import { Clock, Shield, MapPin } from "lucide-react";

const FEATURES = [
  {
    bg: "bg-blue-600",
    textColor: "text-white",
    accentColor: "text-blue-100",
    number: "01",
    icon: Clock,
    title: "Book at your convenience",
    desc: "Morning, evening, or weekend — find a slot that fits your schedule.",
  },
  {
    bg: "bg-emerald-500",
    textColor: "text-white",
    accentColor: "text-emerald-100",
    number: "02",
    icon: Shield,
    title: "Verified professionals",
    desc: "Every hairdresser holds a DBS certificate and full insurance.",
  },
  {
    bg: "bg-slate-900",
    textColor: "text-white",
    accentColor: "text-slate-400",
    number: "03",
    icon: MapPin,
    title: "They come to you",
    desc: "No travel, no parking. Your stylist arrives at your door.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Why choose us?
          </h2>
          <p className="text-muted-foreground text-base">
            Professional service that works around your life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.number}
                className={`${feature.bg} rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform`}
              >
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -left-6 w-20 h-20 rounded-full bg-white/5" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span
                      className={`text-5xl font-black ${feature.accentColor} opacity-30`}
                    >
                      {feature.number}
                    </span>
                  </div>

                  <h3 className={`${feature.textColor} font-bold text-lg mb-2`}>
                    {feature.title}
                  </h3>
                  <p
                    className={`${feature.accentColor} text-sm leading-relaxed`}
                  >
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
