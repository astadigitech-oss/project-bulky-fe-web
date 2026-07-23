import React from "react";
import Image from "next/image";
import { Triangle } from "lucide-react";
import { useTranslations } from "next-intl";

export const HowToWorkSecttion = () => {
  const t = useTranslations("Homepage.howItWorks");
  return (
    <section className="py-20 xl:py-22.5 2xl:py-25 w-full grid grid-cols-3 gap-10 xl:gap-15 2xl:gap-20">
      <div className="relative w-full">
        <Image
          // src={"/assets/images/htw-stagging.webp"}
          src={"/assets/images/8A (Cara Kerja Bulky.id).webp"}
          alt="how_to_work"
          width={1254}
          height={1254}
          sizes="33vw"
          className="h-auto w-full object-contain"
        />
      </div>
      <div className="col-span-2 pr-20 xl:pr-32 2xl:pr-42 flex flex-col gap-5 xl:gap-7 2xl:gap-10 justify-center">
        <p className="text-4xl xl:text-5xl font-black">{t("title")}</p>
        <p className="leading-relaxed text-xl xl:text-2xl font-light">
          {t("description")}
        </p>
        <div className="flex items-center gap-3 xl:gap-4.5 2xl:gap-6 w-full">
          <div className="w-full aspect-square flex-1 border rounded-xl p-3 flex flex-col items-center justify-between gap-1">
            <div className="relative w-full min-h-0 flex-1">
              <Image
                // src={"/assets/images/warehouse.webp"}
                src={"/assets/images/8B (Cara Kerja Bulky.id) GUDANG (1).png"}
                fill
                alt="warehouse"
                className="object-contain"
                sizes="20vw"
              />
            </div>
            <p className="shrink-0 text-lg xl:text-xl">
              {t("warehouse")}
            </p>
          </div>
          <Triangle className="rotate-90 fill-yellow-400 flex-none size-4 xl:size-5 2xl:size-6 text-yellow-400" />
          <div className="w-full aspect-square flex-1 border rounded-xl p-3 flex flex-col items-center justify-between gap-1">
            <div className="relative w-full min-h-0 flex-1">
              <Image
                // src={"/assets/images/sortir.webp"}
                src={"/assets/images/8C (Cara Kerja Bulky.id) SORTIR (1).png"}
                fill
                alt="warehouse"
                className="object-contain"
                sizes="20vw"
              />
            </div>
            <p className="shrink-0 text-lg xl:text-xl">
              {t("sort")}
            </p>
          </div>
          <Triangle className="rotate-90 fill-yellow-400 flex-none size-4 xl:size-5 2xl:size-6 text-yellow-400" />
          <div className="w-full aspect-square flex-1 border rounded-xl p-3 flex flex-col items-center justify-between gap-1">
            <div className="relative w-full min-h-0 flex-1">
              <Image
                // src={"/assets/images/distribute.webp"}
                src={"/assets/images/8D (Cara Kerja Bulky.id) DISTRIBUSI (1).png"}
                fill
                alt="warehouse"
                className="object-contain"
                sizes="20vw"
              />
            </div>
            <p className="shrink-0 text-lg xl:text-xl">
              {t("distribution")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
