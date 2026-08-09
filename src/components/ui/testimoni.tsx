"use client";

import { IconStarFilled } from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, Package, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

type Testimonial = {
  description: string;
  name: string;
  productName?: string;
  images: string[];
  date: string;
  src: string;
  rating?: number;
};

const AUTOPLAY_DELAY = 6000;

/** White pill on the yellow field. Used both beside the card (desktop) and under it (mobile). */
const NavButton = ({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={cn(
      "flex size-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg",
      "transition hover:bg-[#fff3c4] active:scale-95",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
      className,
    )}
  >
    {children}
  </button>
);

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const t = useTranslations("Homepage.testimony");
  const tRoot = useTranslations("Root");
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const count = testimonials.length;

  // Autoplay pauses on hover and while the photo preview is open, so the slide
  // never changes out from under whatever the reader is looking at.
  useEffect(() => {
    if (!autoplay || isPaused || selectedImage || count <= 1) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(interval);
  }, [autoplay, isPaused, selectedImage, count]);

  if (!count) return null;

  const index = Math.min(active, count - 1);
  const item = testimonials[index];
  const rating = item.rating ?? 0;

  const handlePrev = () => setActive((prev) => (prev - 1 + count) % count);
  const handleNext = () => setActive((prev) => (prev + 1) % count);

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative mx-auto w-full max-w-3xl">
        {count > 1 && (
          <>
            <NavButton
              label={tRoot("prevSlide")}
              onClick={handlePrev}
              className="absolute top-1/2 -left-6 z-10 hidden -translate-y-1/2 md:flex lg:-left-14"
            >
              <ArrowLeft className="size-4.5 stroke-[2.5]" />
            </NavButton>
            <NavButton
              label={tRoot("nextSlide")}
              onClick={handleNext}
              className="absolute top-1/2 -right-6 z-10 hidden -translate-y-1/2 md:flex lg:-right-14"
            >
              <ArrowRight className="size-4.5 stroke-[2.5]" />
            </NavButton>
          </>
        )}

        <article className="rounded-3xl bg-white p-5 shadow-[0_22px_50px_-24px_rgba(146,101,0,0.55)] sm:p-7 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-5 sm:gap-7 md:grid-cols-[auto_1fr] md:items-start md:gap-8"
            >
              <div className="relative mx-auto size-28 shrink-0 overflow-hidden rounded-full bg-[#ffcf02]/25 ring-8 ring-[#fff3c4] sm:size-32 md:mx-0 md:size-36">
                <Image
                  unoptimized
                  src={item.src}
                  alt={item.name}
                  fill
                  sizes="144px"
                  draggable={false}
                  className="object-cover object-center"
                />
              </div>

              <div className="min-w-0 text-center md:text-left">
                <h3 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                  {item.name}
                </h3>
                {item.date && (
                  <p className="mt-1 text-xs text-neutral-500">{item.date}</p>
                )}

                <div
                  role="img"
                  aria-label={t("ratingLabel", { rating: String(rating) })}
                  className="mt-2 flex items-center justify-center gap-0.5 md:justify-start"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <IconStarFilled
                      key={i}
                      aria-hidden
                      className={cn(
                        "size-4",
                        i < rating ? "text-[#ffc107]" : "text-neutral-200",
                      )}
                    />
                  ))}
                </div>

                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-neutral-700 md:line-clamp-3 md:min-h-[4.5rem]">
                  {item.description}
                </p>

                {(item.images?.length ?? 0) > 0 && (
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                    {item.images.map((imgUrl, i) => (
                      <button
                        key={imgUrl}
                        type="button"
                        aria-label={t("viewPhoto", { number: String(i + 1) })}
                        className="group relative size-14 overflow-hidden rounded-xl border border-neutral-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:size-16"
                        onClick={() => setSelectedImage(imgUrl)}
                      >
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <span className="flex size-6 items-center justify-center rounded-full bg-[#ffcf02]">
                            <Eye className="size-4 text-neutral-900" />
                          </span>
                        </div>
                        <Image
                          src={imgUrl}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {item.productName && (
                  <div className="mt-5 flex items-center justify-center gap-3 border-t border-neutral-200 pt-4 md:justify-start">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-[#ffcf02]/15 sm:size-14">
                      <Package
                        className="size-6 text-neutral-500"
                        strokeWidth={1.5}
                      />
                    </span>
                    <span className="min-w-0 text-left">
                      <span className="block text-xs text-neutral-500">
                        {t("productPurchased")}
                      </span>
                      <span className="block truncate text-sm font-bold text-neutral-900">
                        {item.productName}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </article>
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <NavButton
            label={tRoot("prevSlide")}
            onClick={handlePrev}
            className="md:hidden"
          >
            <ArrowLeft className="size-4.5 stroke-[2.5]" />
          </NavButton>

          <div className="flex items-center gap-2">
            {testimonials.map((testimonial, i) => (
              <button
                key={`${testimonial.name}-${i}`}
                type="button"
                aria-label={t("goToSlide", { number: String(i + 1) })}
                aria-current={i === index}
                onClick={() => setActive(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
                  i === index
                    ? "w-6 bg-neutral-900"
                    : "w-2.5 bg-white/70 hover:bg-white",
                )}
              />
            ))}
          </div>

          <NavButton
            label={tRoot("nextSlide")}
            onClick={handleNext}
            className="md:hidden"
          >
            <ArrowRight className="size-4.5 stroke-[2.5]" />
          </NavButton>
        </div>
      )}

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) setSelectedImage(null);
        }}
      >
        <DialogContent className="lg:min-w-[80vh]" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("photoPreview")}</DialogTitle>
            {selectedImage && (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedImage}
                  alt=""
                  fill
                  sizes="80vw"
                  className="object-cover"
                />
              </div>
            )}
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button>
                  <XIcon />
                  {t("closePreview")}
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
