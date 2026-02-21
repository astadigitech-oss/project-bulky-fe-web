import { AnimatedTestimonials } from "@/components/ui/testimoni";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const data = [
  {
    date: "Januari 10, 2026",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit.",
    images: [],
    name: "fulan",
    src: "https://github.com/shadcn.png",
  },
  {
    date: "Januari 11, 2026",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere.",
    images: [],
    name: "fulan ahmad",
    src: "https://github.com/evilrabbit.png",
  },
];

export const TestimonySection = () => {
  const t = useTranslations("Homepage.testimony");
  return (
    <section className="relative w-full aspect-[2.2/1]">
      <Image
        src={"/assets/images/testimoni-stagging.webp"}
        fill
        alt="testimoni_stagging"
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute top-0 left-0 size-full">
        <div className="w-full 2xl:max-w-7xl max-w-5xl mx-auto px-17 flex flex-col justify-center h-full gap-10 pb-5">
          <div className="flex flex-col gap-2 w-full items-center">
            <p className="text-3xl xl:text-4xl 2xl:text-5xl font-bold">
              {t("title")}
            </p>
            <p className="text-sm xl:text-base 2xl:text-xl font-light">
              {t("description")}
            </p>
          </div>
          <AnimatedTestimonials testimonials={data} autoplay={true} />
        </div>
      </div>
    </section>
  );
};
