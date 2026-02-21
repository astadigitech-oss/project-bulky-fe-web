import React, { useEffect, useRef, useState } from "react";
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

const list = [
  {
    id: 1,
    image: "/assets/images/hero-stagging.webp",
  },
  {
    id: 2,
    image: "/assets/images/event-stagging.webp",
  },
];

export const PromoSection = () => {
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const emblaRef = useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true, stopOnMouseEnter: true }),
  );
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const delayRef = useRef<number>(0);

  useEffect(() => {
    if (list.length <= 1) {
      setShowProgress(false);
      return;
    }
    if (!api) return;

    const autoplay = api.plugins().autoplay;
    if (!autoplay) return;

    delayRef.current = (autoplay.options.delay as number) ?? 2500;

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
    autoplay.play();

    return () => {
      api.off("autoplay:timerset", onTimerSet);
      api.off("autoplay:timerstopped", onTimerStopped);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [api, list]);
  return (
    <section className="py-16 px-17 w-full mx-auto xl:max-w-7xl max-w-5xl">
      <div className="flex flex-col w-full gap-4">
        <Carousel
          plugins={[emblaRef?.current]}
          onMouseEnter={() => {
            if (emblaRef.current && list.length > 1) emblaRef?.current.stop();
          }}
          onMouseLeave={() => {
            if (emblaRef.current && list.length > 1) emblaRef?.current?.play();
          }}
          opts={{ loop: true }}
          setApi={setApi}
        >
          <div className="overflow-hidden shadow-lg rounded-xl relative">
            <CarouselContent>
              {list?.map((item) => (
                <CarouselItem key={item.id}>
                  <div className="relative aspect-4/1 rounded-xl shadow-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.id.toString()}
                      fill
                      sizes={"100vw"}
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div
              data-show={showProgress}
              className="w-full absolute left-0 z-50 data-[show=true]:bottom-2 data-[show=false]:-bottom-5 data-[show=false]:scale-80 duration-500 transition-all"
            >
              <div className="w-1/5 mx-auto rounded-full shadow-md p-0.5 bg-white">
                <Progress
                  value={Math.round(progress)}
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
