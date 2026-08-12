import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { SaleRibbon } from "@/components/ui/sale-ribbon";

type ProdukItem = {
  nama: string;
  slug: string;
  image: string;
  harga: {
    old: string;
    new: string;
    is_promo: boolean;
  };
  stock: string;
  warehouse: string;
  is_sale: boolean;
};

type ProductSectionProps = {
  products?: ProdukItem[];
};

const parseRupiahToNumber = (value: string) =>
  Number(value.replace(/[^\d]/g, "")) || 0;

const getDiscountPercent = (oldPrice: string, newPrice: string) => {
  const oldNum = parseRupiahToNumber(oldPrice);
  const newNum = parseRupiahToNumber(newPrice);
  if (oldNum <= 0 || newNum <= 0 || newNum >= oldNum) return 0;
  return Math.round(((oldNum - newNum) / oldNum) * 100);
};

export const ProductSection = ({ products }: ProductSectionProps) => {
  const t = useTranslations("Homepage");
  return (
    <section className="w-full xl:max-w-7xl max-w-5xl mx-auto px-17 ">
      <div className="text-base font-bold px-6 py-2 bg-yellow-400 rounded-xl w-fit">
        <p>{t("recommendation")}</p>
      </div>
      <div className="py-14 flex flex-col gap-6">
        <div className="w-full grid grid-cols-5 gap-4">
          {(products ?? []).map((item) => {
            const discountPercent = getDiscountPercent(item.harga.old, item.harga.new);
            return (
            <Link key={item.slug} href={`/products/${item.slug}`}>
              <div className="w-full border border-gray-300 rounded-3xl overflow-hidden bg-white">
                <div className="aspect-square w-full relative bg-[#e9e9e9]">
                  {item.is_sale && <SaleRibbon label={t("sale")} />}
                  {discountPercent > 0 && (
                    <div className="absolute top-2 left-0 z-10 bg-black text-white text-[10px] font-semibold px-2 py-1 rounded-r-sm">
                      {discountPercent}%
                    </div>
                  )}
                  <Image
                    src={item.image || "/assets/images/hero-stagging.webp"}
                    alt={item.nama}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
                <div className="w-full px-3 py-2.5 flex flex-col gap-2">
                  <p className="font-medium line-clamp-1 text-sm leading-tight text-gray-900">
                    {item.nama}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold text-orange-500 text-xl leading-tight whitespace-nowrap">
                      {item.harga.new}
                    </p>
                    <p className="text-[11px] line-through text-gray-400 leading-none whitespace-nowrap">
                      {item.harga.old}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-none line-clamp-1">
                    {item.stock} <span className="mx-1">/</span>
                    {item.warehouse}
                  </p>
                </div>
              </div>
            </Link>
            );
          })}
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
