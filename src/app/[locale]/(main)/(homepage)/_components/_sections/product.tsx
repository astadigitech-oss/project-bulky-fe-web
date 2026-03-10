import React from "react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const ProductSection = () => {
  const t = useTranslations("Homepage");
  return (
    <section className="w-full xl:max-w-7xl max-w-5xl mx-auto px-17 ">
      <div className="text-base font-bold px-6 py-2 bg-yellow-400 rounded-xl w-fit">
        <p>{t("recommendation")}</p>
      </div>
      <div className="py-14 flex flex-col gap-6">
        <div className="w-full grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }, (_, index) => (
            <Link key={index} href={`/products/${index + 1}`}>
              <div className="w-full border flex flex-col rounded-xl overflow-hidden border-gray-300 h-fit">
                <div className="aspect-square flex-none bg-gray-200 w-full relative overflow-hidden">
                  <Image
                    src={"https://github.com/shadcn.png"}
                    alt="sa"
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex-none bg-white w-full px-2.5 py-1.5 flex flex-col gap-4">
                  <p className="font-medium line-clamp-2 text-sm">
                    Palet Sepatu Olahraga lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Quisquam, voluptatum.
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] line-through font-light leading-tight text-gray-600">
                      {formatRupiah(5000000)}
                    </p>
                    <p className="font-semibold text-yellow-600 leading-tight">
                      {formatRupiah(5000000)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href={"/products"}
          className="w-fit mx-auto rounded-full overflow-hidden "
        >
          <Button
            className={"rounded-full py-2.5 h-auto px-9 text-base font-bold"}
          >
            {t("seeAllProducts")}
          </Button>
        </Link>
      </div>
    </section>
  );
};
