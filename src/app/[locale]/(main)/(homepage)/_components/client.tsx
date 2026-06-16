"use client";

import { HeroSection } from "./_sections/hero";
import { ProductSection } from "./_sections/product";
import { PromoSection } from "./_sections/promo";
import { TVSection } from "./_sections/tv";
import { InfoSection } from "./_sections/info";
import { HowToWorkSecttion } from "./_sections/how-to-work";
import { TestimonySection } from "./_sections/testimony";
import { WholesaleSection } from "./_sections/wholesale";

export const HompageClient = () => {
  return (
    <main className="flex flex-col w-full">
      <h1 className="sr-only">Beranda Bulky</h1>
      <HeroSection />
      <PromoSection />
      <ProductSection />
      <TVSection />
      <InfoSection />
      <HowToWorkSecttion />
      <TestimonySection />
      <WholesaleSection />
    </main>
  );
};
