import React from "react";
import Image from "next/image";
import { Triangle } from "lucide-react";
import { useTranslations } from "next-intl";

export const HowToWorkSecttion = () => {
  const t = useTranslations("Homepage.howItWorks");
  return (
    <section className="py-20 xl:py-22.5 2xl:py-25 w-full grid grid-cols-3 gap-10 xl:gap-15 2xl:gap-20">
      <div className="relative aspect-7/10 w-full">
        <Image
          src={"/assets/images/htw-stagging.webp"}
          alt="how_to_work"
          fill
          sizes="33vw"
          className="object-contain"
        />
      </div>
      <div className="col-span-2 pr-20 xl:pr-32 2xl:pr-42 flex flex-col gap-5 xl:gap-7 2xl:gap-10 justify-center">
        <p className="text-4xl xl:text-5xl font-black">{t("title")}</p>
        <p className="leading-relaxed text-xl xl:text-2xl font-light">
          {t("description")}
        </p>
        <div className="flex items-center gap-3 xl:gap-4.5 2xl:gap-6 w-full">
          <div className="w-full aspect-square flex-1 border rounded-xl p-4 relative flex justify-center">
            <div className="relative overflow-hidden size-full">
              <Image
                src={"/assets/images/warehouse.webp"}
                fill
                alt="warehouse"
                className="object-contain"
                sizes="20vw"
              />
            </div>
            <p className="absolute bottom-1.5 text-lg xl:text-xl">
              {t("warehouse")}
            </p>
          </div>
          <Triangle className="rotate-90 fill-yellow-400 flex-none size-4 xl:size-5 2xl:size-6 text-yellow-400" />
          <div className="w-full aspect-square flex-1 border rounded-xl p-4 relative flex justify-center">
            <div className="relative overflow-hidden size-full">
              <Image
                src={"/assets/images/sortir.webp"}
                fill
                alt="warehouse"
                className="object-contain"
                sizes="20vw"
              />
            </div>
            <p className="absolute bottom-1.5 text-lg xl:text-xl">
              {t("sort")}
            </p>
          </div>
          <Triangle className="rotate-90 fill-yellow-400 flex-none size-4 xl:size-5 2xl:size-6 text-yellow-400" />
          <div className="w-full aspect-square flex-1 border rounded-xl p-4 relative flex justify-center">
            <div className="relative overflow-hidden size-full">
              <Image
                src={"/assets/images/distribute.webp"}
                fill
                alt="warehouse"
                className="object-contain"
                sizes="20vw"
              />
            </div>
            <p className="absolute bottom-1.5 text-lg xl:text-xl">
              {t("distribution")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
