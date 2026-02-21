import React from "react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";

export const ProductSection = () => {
  const t = useTranslations("Homepage");
  return (
    <section className="w-full xl:max-w-7xl max-w-5xl mx-auto px-17 ">
      <div className="text-base font-bold px-6 py-2 bg-yellow-400 rounded-xl w-fit">
        <p>{t("recommendation")}</p>
      </div>
      <div className="py-14 flex flex-col gap-6">
        <div className="w-full grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="w-full border flex flex-col rounded-xl overflow-hidden border-gray-500"
            >
              <div className="aspect-square flex-none bg-gray-300 w-full"></div>
              <div className="flex-none bg-white w-full px-4 py-2 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="font-medium line-clamp-2">
                    Palet Sepatu Olahraga lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Quisquam, voluptatum.
                  </p>
                  <div className="flex 2xl:items-center 2xl:justify-between flex-col 2xl:flex-row-reverse">
                    <p className="text-[11px] line-through font-light leading-tight">
                      {formatRupiah(5000000)}
                    </p>
                    <p className="font-semibold text-yellow-600 text-lg leading-tight">
                      {formatRupiah(5000000)}
                    </p>
                  </div>
                </div>
                <p className="text-xs">1 pcs / Warehouse Depok</p>
              </div>
            </div>
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
