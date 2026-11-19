import { ReactNode } from "react";

interface HeroProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export const Hero = ({ title, description, children }: HeroProps) => {
  return (
    <section className="overflow-hidden bg-background">
      <div className="mx-auto flex min-h-[30rem] max-w-6xl items-center px-6 py-16 text-center md:min-h-[34rem] md:px-8">
        <div className="mx-auto max-w-4xl">
          {title && (
            <h1 className="text-5xl leading-[1.02] font-bold tracking-[-0.035em] text-foreground sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              {title}
            </h1>
          )}
          {description && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              {description}
            </p>
          )}
          {children && (
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
