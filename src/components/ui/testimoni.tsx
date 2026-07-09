"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Eye, XIcon } from "lucide-react";
import { Button } from "./button";

type Testimonial = {
  description: string;
  name: string;
  images: string[];
  date: string;
  src: string;
  rating?: number;
};
export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgress(0);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (!autoplay || isPaused || selectedImage) return;

    const duration = 5000;
    const intervalTime = 50;
    const step = 100 / (duration / intervalTime);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + step;
      });
    }, intervalTime);

    const slideInterval = setInterval(() => {
      handleNext();
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(slideInterval);
    };
  }, [autoplay, isPaused]);

  useEffect(() => {
    setActive(0);
    setProgress(0);
  }, [testimonials.length]);

  if (!testimonials.length || active >= testimonials.length) return null;

  const randomRotateY = (seed: number): number => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    const normalized = x - Math.floor(x); // 0..1

    return Math.floor(normalized * (10 - -10 + 1)) + -10;
  };

  return (
    <div className="font-sans antialiased w-full bg-white px-6 xl:px-10 2xl:px-20 py-4 rounded-xl h-7/11 flex items-center justify-center">
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setProgress(0);
        }}
        className="relative grid grid-cols-1 gap-6 xl:gap-12 2xl:gap-20 md:grid-cols-3 w-full h-full"
      >
        <div className="flex items-center justify-center">
          <div className="relative w-2/3 xl:w-5/6 2xl:w-full aspect-square">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.src}-${index}`}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(index),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(index),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(index),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between xl:py-4 col-span-2">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className=""
          >
            <h3 className="text-lg xl:text-xl 2xl:text-2xl font-bold text-black dark:text-white">
              {testimonials[active].name}
            </h3>
            {testimonials[active].rating !== undefined && (
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={i < testimonials[active].rating! ? "text-yellow-400" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
            {/* <p className="text-xs xl:text-sm text-gray-700 dark:text-neutral-500">
              {testimonials[active].date}
            </p> */}
            <motion.p className="mt-3 xl:mt-5 2xl:mt-6 text-xs leading-relaxed xl:text-sm 2xl:text-base text-black dark:text-neutral-300">
              {testimonials[active].description
                .split(" ")
                .map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
            </motion.p>
            {(testimonials[active].images?.length ?? 0) > 0 && (
              <div className="flex items-center gap-2 mt-2 xl:mt-4">
                {testimonials[active].images.map((imgUrl, i) => (
                  <motion.button
                    key={imgUrl}
                    className="relative size-16 xl:size-20 2xl:size-24 rounded-xl shadow bg-white group overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                    onClick={() => {
                      setSelectedImage(imgUrl);
                      setIsPaused(true);
                    }}
                  >
                    <div className="size-full rounded-xl bg-black/10 backdrop-blur-sm absolute top-0 left-0 z-10 group-hover:opacity-100 flex items-center justify-center opacity-0 transition-all">
                      <div className="size-6 flex items-center justify-center bg-yellow-400 rounded-full">
                        <Eye className="size-4" />
                      </div>
                    </div>
                    <Image
                      src={imgUrl}
                      alt={`review-${i}`}
                      fill
                      sizes="10vw"
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
            <Dialog
              open={!!selectedImage}
              onOpenChange={(e) => {
                if (!e) {
                  setSelectedImage(null);
                  setIsPaused(false);
                  setProgress(0);
                }
              }}
            >
              <DialogContent className={"lg:min-w-[80vh]"} showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>Pratinjau Foto</DialogTitle>
                  {selectedImage && (
                    <div className="w-full aspect-square rounded-lg relative overflow-hidden">
                      <Image
                        src={selectedImage}
                        alt="preview"
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
                        Tutup
                      </Button>
                    }
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-2 xl:pt-0 items-center">
            <button
              onClick={handlePrev}
              className="group/button flex size-6 xl:size-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <IconArrowLeft className="size-3.5 xl:size-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
            </button>
            <div className="relative h-1 w-24 xl:w-28 2xl:w-32 rounded-full overflow-hidden bg-gray-200">
              <div
                className="absolute h-full rounded-full top-0 left-0 bg-black"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              onClick={handleNext}
              className="group/button flex size-6 xl:size-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <IconArrowRight className="size-3.5 xl:size-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
