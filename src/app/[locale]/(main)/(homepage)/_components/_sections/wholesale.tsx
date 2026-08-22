"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@ui/button";
import { WholesaleFormDialog } from "@/components/wholesale-form-dialog";

export const WholesaleSection = () => {
  const t = useTranslations("Homepage.wholesale");
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="w-full bg-[#F5EFD0] overflow-hidden relative">
        {/* Decorative looper lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none select-none">
          <Image
            src="/assets/images/Looper-kanan.svg"
            alt=""
            fill
            className="object-cover object-left"
          />
        </div>

        {/* Left: container/forklift — in normal flow, drives section height */}
        <div className="w-[460px] xl:w-[620px] pointer-events-none select-none">
          <Image
            src="/assets/images/wholesale/container.webp"
            alt="Bulky wholesale container"
            width={620}
            height={540}
            fetchPriority="high"
            className="w-full h-auto"
          />
        </div>

        {/* Right: boxes illustration — pinned to right edge */}
        <div className="absolute right-0 bottom-0 w-[160px] xl:w-[210px] pointer-events-none select-none">
          <Image
            src="/assets/images/wholesale/box.webp"
            alt="Bulky wholesale boxes"
            width={210}
            height={200}
            className="w-full h-auto object-contain object-bottom"
          />
        </div>

        {/* Center: text + CTA */}
        <div className="absolute inset-0 flex items-center z-10 pl-[480px] xl:pl-[640px]">
          <div className="flex flex-col items-start gap-6 text-left">
            <p className="font-black text-4xl xl:text-5xl leading-tight">
              {t("title")}
              <br />
              {t("titleHighlight")}
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="rounded-full py-3.5 px-14 text-lg font-bold h-auto bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              {t("cta")}
            </Button>
          </div>
        </div>
      </section>

      <WholesaleFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
