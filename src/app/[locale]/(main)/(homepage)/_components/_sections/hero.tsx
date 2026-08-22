import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
      <section className="relative w-full overflow-hidden bg-[#ffcf02]">
        <Image
          src="/assets/images/bg-banner-default-new.webp"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover select-none"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center gap-8 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:px-12">
          <div>
            <h2 className="text-[2.25rem] leading-[1.05] font-extrabold tracking-tight text-black md:text-5xl xl:text-6xl">
              {t("titleLine1")}
              <br />
              {t.rich("titleLine2", {
                accent: (chunks) => <span className="text-white">{chunks}</span>,
              })}
            </h2>

            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-black/80 md:text-lg">
              {t("description")}
            </p>

            <Button className="group/cta mt-8 h-auto gap-4 rounded-full bg-black py-2 pr-2 pl-7 text-sm font-bold tracking-[0.1em] text-white uppercase shadow-none hover:bg-black/85 active:scale-[0.98] md:pl-8 md:text-base">
              {t("startNow")}
              <span className="flex size-9 items-center justify-center rounded-full bg-[#ffcf02] transition-transform duration-300 group-hover/cta:translate-x-1">
                <ArrowRight
                  aria-hidden
                  className="size-4 stroke-[2.5] text-black"
                />
              </span>
            </Button>
          </div>

          <div className="relative mx-auto aspect-[1012/631] w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[620px] lg:justify-self-end">
            <Image
              src="/assets/images/ilustrasi-hero-section-default.webp"
              alt={t("title")}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 520px, 620px"
              className="object-contain"
            />
          </div>
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
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover pointer-events-none"
      />
    </section>
  );
};
