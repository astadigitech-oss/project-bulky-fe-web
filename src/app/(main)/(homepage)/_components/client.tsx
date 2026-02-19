"use client";

import { HeroSection } from "./_sections/hero";
import { ProductSection } from "./_sections/product";
import { PromoSection } from "./_sections/promo";
import { TVSection } from "./_sections/tv";

export const HompageClient = () => {
  return (
    <main className="flex flex-col w-full">
      <HeroSection />
      <PromoSection />
      <ProductSection />
      <TVSection />
    </main>
  );
};
