import { PlayCircle } from "lucide-react";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@i18n/navigation";
import { Button } from "@ui/button";

export const TVSection = () => {
  const t = useTranslations("Homepage");
  const emblaRef = useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true, stopOnMouseEnter: true }),
  );
  return (
    <section className="bg-linear-to-b from-yellow-400 from-50% to-50% to-yellow-400/0 w-full">
      <div className="xl:max-w-7xl max-w-5xl w-full mx-auto px-17 pb-32 py-13 z-10 flex flex-col gap-9">
        <p className="text-center font-black text-4xl">BULKY LIVE</p>
        <Carousel
          plugins={[emblaRef?.current]}
          onMouseEnter={() => {
            if (emblaRef.current) emblaRef?.current.stop();
          }}
          onMouseLeave={() => {
            if (emblaRef.current) emblaRef?.current?.play();
          }}
          opts={{ loop: true, align: "start" }}
        >
          <CarouselContent className="-ml-3 xl:-ml-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <CarouselItem key={index} className="basis-1/4 pl-3 xl:pl-4">
                <div className="bg-white rounded-xl aspect-5/7 p-1.5 xl:p-2 border">
                  <div className="size-full bg-gray-300 rounded-lg flex items-center justify-center">
                    <PlayCircle className="size-12 stroke-[1.25]" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className={
              "size-10 -left-5 border-none shadow-lg text-yellow-500 [&_svg]:size-4! [&_svg]:stroke-3! hover:text-yellow-800 hover:bg-yellow-200"
            }
          />
          <CarouselNext
            className={
              "size-10 -right-5 border-none shadow-lg text-yellow-500 [&_svg]:size-4! [&_svg]:stroke-3! hover:text-yellow-800 hover:bg-yellow-200"
            }
          />
        </Carousel>
        <Link href="/bulky-live" className="w-fit mx-auto rounded-full overflow-hidden">
          <Button className="rounded-full py-2.5 h-auto px-9 text-base font-bold">
            {t("seeAllTV")}
          </Button>
        </Link>
      </div>
    </section>
  );
};
