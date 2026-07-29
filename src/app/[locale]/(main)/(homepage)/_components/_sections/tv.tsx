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
import Image from "next/image";

type TvItem = {
  nama: string;
  slug: string;
  thumbnail_url: string;
};

type TVSectionProps = {
  bulkyTv?: TvItem[];
};

export const TVSection = ({ bulkyTv }: TVSectionProps) => {
  const t = useTranslations("Homepage");
  const emblaRef = useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true, stopOnMouseEnter: true }),
  );
  const list = bulkyTv ?? [];
  const hasItems = list.length > 0;
  const placeholders = Array.from({ length: 4 }, (_, idx) => idx);

  const cardContent = (thumbnailUrl: string | undefined, nama: string) => (
    <div className="bg-white rounded-xl aspect-9/16 p-1.5 xl:p-2 border">
      {thumbnailUrl ? (
        <div className="size-full relative rounded-lg overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt={nama}
            fill
            sizes="25vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="size-full bg-gray-300 rounded-lg flex items-center justify-center">
          <PlayCircle className="size-12 stroke-[1.25]" />
        </div>
      )}
    </div>
  );

  return (
    <section className="bg-linear-to-b from-yellow-400 from-50% to-50% to-yellow-400/0 w-full">
      <div className="xl:max-w-7xl max-w-5xl w-full mx-auto px-17 pb-32 py-13 z-10 flex flex-col gap-9">
        <p className="text-center font-black text-4xl">BULKY LIVE</p>
        <Carousel
          plugins={hasItems ? [emblaRef?.current] : []}
          onMouseEnter={() => {
            if (hasItems && emblaRef.current) emblaRef?.current.stop();
          }}
          onMouseLeave={() => {
            if (hasItems && emblaRef.current) emblaRef?.current?.play();
          }}
          opts={{ loop: true, align: "start" }}
        >
          <CarouselContent className="-ml-3 xl:-ml-4">
            {hasItems
              ? list.map((item) => (
                <CarouselItem key={item.slug} className="basis-1/4 pl-3 xl:pl-4">
                  <Link href={`/bulky-live?v=${item.slug}`}>
                    {cardContent(item.thumbnail_url, item.nama)}
                  </Link>
                </CarouselItem>
              ))
              : placeholders.map((idx) => (
                <CarouselItem key={idx} className="basis-1/4 pl-3 xl:pl-4">
                  {cardContent(undefined, "")}
                </CarouselItem>
              ))}
          </CarouselContent>
          {hasItems && (
            <>
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
            </>
          )}
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
