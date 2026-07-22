import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { BoxMyIcon } from "@/components/svgs/box-icon";
import { HeadsetMyIcon } from "@/components/svgs/cs-icon";
import { CreditCartMyIcon } from "@/components/svgs/cc-icon";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const InfoSection = () => {
  const t = useTranslations("Homepage.infoBanner");
  return (
    <section className="w-full aspect-22/7 relative">
      <div className="size-full z-10 absolute top-0 left-0 grid grid-cols-3">
        <div className="col-span-2 flex h-full items-center justify-center flex-col gap-5 xl:gap-7 2xl:gap-8">
          <p className="text-4xl xl:text-5xl font-bold">{t("title")}</p>
          <Button
            className={
              "rounded-full py-2 xl:py-2.5 h-auto px-7 xl:px-9 text-base xl:text-lg font-bold"
            }
          >
            {t("getNow")}
          </Button>
          <div className="px-14 xl:px-26 2xl:px-32 h-20 xl:h-22 2xl:h-24 w-full grid grid-cols-3 gap-3 xl:gap-4 2xl:gap-5">
            <div className="bg-white/60 h-full rounded-xl flex items-center gap-3 xl:gap-4 px-3 xl:px-4">
              <BoxMyIcon className="h-8 xl:h-9 2xl:h-10 flex-none" />
              <p className="text-[11px] xl:text-xs 2xl:text-sm leading-snug">
                {t("package")}
              </p>
            </div>
            <div className="bg-white/60 h-full rounded-xl flex items-center gap-3 xl:gap-4 px-3 xl:px-4">
              <CreditCartMyIcon className="h-8 xl:h-9 2xl:h-10 flex-none" />
              <p className="text-xs xl:text-sm 2xl:text-base leading-tight">
                {t("payment")}
              </p>
            </div>
            <div className="bg-white/60 h-full rounded-xl flex items-center gap-3 xl:gap-4 px-3 xl:px-4">
              <HeadsetMyIcon className="h-8 xl:h-9 2xl:h-10 flex-none" />
              <p className="text-xs xl:text-sm 2xl:text-base leading-tight">
                {t("cs")}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="size-5.5 xl:size-6 rounded bg-white flex items-center justify-center"
                >
                  <Star className="size-4 xl:size-4.5 fill-yellow-500 text-yellow-500" />
                </div>
              ))}
            </div>
            <AvatarGroup className="*:data-[slot=avatar]:ring-yellow-400">
              <Avatar className={"size-8 xl:size-9"}>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className={"size-8 xl:size-9"}>
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar className={"size-8 xl:size-9"}>
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </AvatarGroup>
            <p className="text-lg xl:text-xl [&_b]:text-xl xl:[&_b]:text-2xl [&_b]:font-bold">
              {t.rich("satisfied", {
                b: (chunks) => <b>{chunks}</b>,
              })}
            </p>
          </div>
        </div>
      </div>
      <Image
        src={"/assets/images/info-stagging.webp"}
        fill
        alt="info_banner"
        className="object-cover z-0"
        sizes="100vw"
      />
    </section>
  );
};
