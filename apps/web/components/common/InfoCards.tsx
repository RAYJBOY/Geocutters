import type { LucideIcon } from "lucide-react";

type InfoCardItem = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

type InfoCardsProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: InfoCardItem[];
};

export function InfoCards({
  eyebrow,
  title,
  description,
  items,
}: InfoCardsProps) {
  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] text-primary uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-primary" />
            {eyebrow}
            <span aria-hidden="true" className="h-px w-6 bg-primary" />
          </div>
          <h2 className="mt-5 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-base text-muted-foreground">{description}</p>
        </header>

        <div className="mt-12 grid border-t border-border md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.number}
                className={`relative flex min-h-60 flex-col items-center px-6 pt-11 pb-8 text-center ${
                  index < items.length - 1
                    ? "border-b border-border md:border-r md:border-b-0"
                    : ""
                }`}
              >
                <span className="absolute top-4 left-4 text-[10px] font-medium tracking-wide text-muted-foreground">
                  {item.number}
                </span>
                <div className="flex size-16 items-center justify-center rounded-[1.125rem] bg-accent text-primary">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                </div>
                <h3 className="mt-6 text-lg font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
