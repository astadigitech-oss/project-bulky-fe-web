import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

type HeroSectionProps = {
  heroUrl?: string;
};

export const HeroSection = ({ heroUrl }: HeroSectionProps) => {
  const t = useTranslations("Homepage.hero");

  if (!heroUrl) {
    return (
      <section className="relative w-full aspect-19/9">
        <Image
          src="/assets/images/hero-stagging.webp"
          alt="banner_hero"
          fill
          sizes="100vw"
          className="object-cover pointer-events-none"
        />
        <div className="size-full top-0 left-0 absolute flex items-center justify-center flex-col gap-10">
          <h2 className="max-w-6xl text-center text-8xl font-black">
            {t("title")}
          </h2>
          <p className="max-w-xl text-2xl font-light text-center">
            {t("description")}
          </p>
          <Button className={"text-xl py-3 px-10 rounded-full h-auto font-bold"}>
            {t("startNow")}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full aspect-19/9">
      <Image
        src={heroUrl}
        alt="banner_hero"
        fill
        sizes="100vw"
        className="object-cover pointer-events-none"
      />
    </section>
  );
};
