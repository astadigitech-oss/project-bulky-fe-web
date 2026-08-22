import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const InfoSection = () => {
  const t = useTranslations("Homepage.infoBanner");
  return (
    <section className="relative w-full overflow-hidden bg-[#ffcf02] py-10 md:py-14">
      <Image
        src="/assets/images/bg-banner-default-new.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="pointer-events-none object-cover select-none"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-6 lg:px-12">
        <div>
          <h2 className="text-4xl font-bold leading-tight text-black md:text-5xl xl:text-6xl">
            {t("titleLine1")}
            <br />
            {t.rich("titleLine2", {
              accent: (chunks) => <span className="text-white">{chunks}</span>,
            })}
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-black/80 md:text-lg">
            {t("description")}
          </p>

          <Button className="mt-7 h-auto gap-2 rounded-full bg-white px-7 py-3 text-base font-bold text-black shadow-none hover:bg-white/90">
            {t("getNow")}
            <ArrowRight className="size-4" />
          </Button>

          <div className="mt-6 flex items-center gap-3">
            <AvatarGroup className="*:data-[slot=avatar]:ring-[#ffcf02]">
              <Avatar size="lg">
                <AvatarFallback className="bg-gray-300">
                  <User className="size-5 text-white" />
                </AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback className="bg-black">
                  <User className="size-5 text-white" />
                </AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback className="bg-black">
                  <User className="size-5 text-white" />
                </AvatarFallback>
              </Avatar>
            </AvatarGroup>
            <p className="text-base text-black md:text-lg [&_b]:font-bold">
              {t.rich("satisfied", { b: (chunks) => <b>{chunks}</b> })}
            </p>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-[480px] overflow-hidden lg:max-w-[760px] lg:justify-self-end">
          <Image
            unoptimized
            src="/assets/images/about-us/delivery-illustration.webp"
            alt={t("title")}
            fill
            sizes="(max-width: 1024px) 90vw, 760px"
            className="object-cover object-bottom"
            priority
          />
        </div>
      </div>
    </section>
  );
};
