import React, { useEffect, useMemo, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { useTranslations } from "next-intl";

type PromoItem = {
  banner_url: string;
  nama: string;
  kategori: string[];
};

type PromoSectionProps = {
  promos?: PromoItem[];
};

export const PromoSection = ({ promos }: PromoSectionProps) => {
  const t = useTranslations("Root");
  const hasPromos = !!promos?.length;
  const list = hasPromos
    ? promos!.map((p, idx) => ({ id: idx + 1, image: p.banner_url }))
    : [];
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(true);
  const [api, setApi] = useState<CarouselApi>();

  // Dibuat dengan useMemo agar instance tidak berubah antar render
  const autoplayPlugin = useMemo(
    () => Autoplay({ delay: 10000, stopOnInteraction: true, stopOnMouseEnter: true }),
    [],
  );

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const delayRef = useRef<number>(0);

  useEffect(() => {
    if (!api) return;

    if (list.length <= 1) {
      setShowProgress(false);
      // Hentikan autoplay jika hanya 1 item
      const autoplay = api.plugins().autoplay;
      autoplay?.stop();
      return;
    }

    const autoplay = api.plugins().autoplay;
    if (!autoplay) return;

    delayRef.current = (autoplay.options.delay as number) ?? 10000;

    const loop = () => {
      if (startTimeRef.current === null) return;

      const elapsed = performance.now() - startTimeRef.current;
      const value = Math.min((elapsed / delayRef.current) * 100, 100);

      setProgress(value);
      rafRef.current = requestAnimationFrame(loop);
    };

    const onTimerSet = () => {
      startTimeRef.current = performance.now();
      setProgress(0);
      setShowProgress(true);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const onTimerStopped = () => {
      startTimeRef.current = null;
      setProgress(0);
      setShowProgress(false);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    api.on("autoplay:timerset", onTimerSet);
    api.on("autoplay:timerstopped", onTimerStopped);

    // Pastikan autoplay dimulai setelah api siap
    autoplay.play();

    return () => {
      api.off("autoplay:timerset", onTimerSet);
      api.off("autoplay:timerstopped", onTimerStopped);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [api, list.length]);

  if (!hasPromos) {
    return (
      <section className="py-16 px-17 w-full mx-auto xl:max-w-7xl max-w-5xl">
        <div className="flex flex-col w-full gap-4">
          <div className="relative aspect-4/1 rounded-xl shadow-lg overflow-hidden bg-gray-300 flex items-center justify-center">
            <ImageOff className="size-12 stroke-[1.25]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-17 w-full mx-auto xl:max-w-7xl max-w-5xl">
      <div className="flex flex-col w-full gap-4">
        <Carousel
          plugins={[autoplayPlugin]}
          onMouseEnter={() => {
            if (list.length > 1) autoplayPlugin.stop();
          }}
          onMouseLeave={() => {
            if (list.length > 1) autoplayPlugin.play();
          }}
          opts={{ loop: true }}
          setApi={setApi}
        >
          <div className="overflow-hidden shadow-lg rounded-xl relative">
            <CarouselContent>
              {list?.map((item, idx) => (
                <CarouselItem key={item.id}>
                  <div className="relative aspect-4/1 rounded-xl shadow-lg overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.id.toString()}
                        fill
                        sizes={"100vw"}
                        className="object-cover"
                        priority={idx === 0}
                        fetchPriority={idx === 0 ? "high" : "auto"}
                      />
                    ) : (
                      <div className="size-full bg-gray-300 flex items-center justify-center">
                        <ImageOff className="size-12 stroke-[1.25]" />
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div
              data-show={showProgress}
              className="w-full absolute left-0 z-10 data-[show=true]:bottom-2 data-[show=false]:-bottom-5 data-[show=false]:scale-80 duration-500 transition-all"
            >
              <div className="w-1/5 mx-auto rounded-full shadow-md p-0.5 bg-white">
                <Progress
                  value={Math.round(progress)}
                  aria-label={t("slideProgress")}
                  classIndicator="bg-yellow-700 rounded-r-full"
                  classTrack={"bg-yellow-400 h-1.5 rounded-full"}
                  className={"rounded-full"}
                />
              </div>
            </div>
          </div>
          <CarouselPrevious
            disabled={list.length <= 1}
            className={
              "size-10 -left-5 border-none shadow-lg text-yellow-500 [&_svg]:size-4! [&_svg]:stroke-3! hover:text-yellow-800 hover:bg-yellow-200"
            }
          />
          <CarouselNext
            disabled={list.length <= 1}
            className={
              "size-10 -right-5 border-none shadow-lg text-yellow-500 [&_svg]:size-4! [&_svg]:stroke-3! hover:text-yellow-800 hover:bg-yellow-200"
            }
          />
        </Carousel>
      </div>
    </section>
  );
};
