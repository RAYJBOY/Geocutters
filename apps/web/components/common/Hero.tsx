import Image from "next/image";
import { ReactNode } from "react";

interface HeroProps {
  image: string;
  title?: string;
  description?: string;
  children?: ReactNode;
}

export const Hero = ({ image, title, description, children }: HeroProps) => {
  return (
    <div className="relative w-full h-120 md:min-h-[40vh] overflow-hidden">
      <Image
        src={image}
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute top-0 bottom-0 flex flex-col justify-center px-6 md:px-12 max-w-lg left-24 md:left-36">
        {title && (
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-lg text-white/90 mb-8">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
};
