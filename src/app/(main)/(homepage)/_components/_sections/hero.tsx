import Image from "next/image";
import React from "react";

export const HeroSection = () => {
  return (
    <section className="relative w-full aspect-19/9">
      <Image
        src={"/assets/images/hero-stagging.webp"}
        alt="banner_hero"
        fill
        sizes="100vw"
        className="object-cover pointer-events-none"
      />
    </section>
  );
};
