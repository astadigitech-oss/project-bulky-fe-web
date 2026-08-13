"use client";

import { HeroSection } from "./_sections/hero";
import { ProductSection } from "./_sections/product";
import { PromoSection } from "./_sections/promo";
import { TVSection } from "./_sections/tv";
import { InfoSection } from "./_sections/info";
import { HowToWorkSecttion } from "./_sections/how-to-work";
import { TestimonySection } from "./_sections/testimony";
import { WholesaleSection } from "./_sections/wholesale";
import { useApiQuery } from "@/lib/query/use-query";
import { useParams } from "next/navigation";
import { PageLoader } from "@/components/ui/page-loader";
import { useTranslations } from "next-intl";

type Locale = "id" | "en";

type HomepageResponse = {
  status: boolean;
  message: string;
  data: {
    hero_url: string;
    promo: {
      banner_url: string;
      nama: string;
      kategori: string[];
    }[];
    produk: {
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
    }[];
    bulky_tv: {
      nama: string;
      slug: string;
      thumbnail_url: string;
    }[];
    testimoni: {
      buyer: {
        nama: string;
        image: string;
      };
      nama_produk: string;
      rating: number;
      deskripsi: string;
      image: string[];
      tanggal: string;
    }[];
  };
};

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

export const HompageClient = () => {
  const params = useParams<{ locale: string }>();
  const locale = clampLocale(params?.locale);
  const tHero = useTranslations("Homepage.hero");

  const { data, isLoading } = useApiQuery<HomepageResponse>({
    key: ["homepage", locale],
    endpoint: "/web/homepage",
    searchParams: { locale },
  });

  if (isLoading) return <PageLoader />;

  const homepage = data?.data;

  return (
    <main className="flex flex-col w-full">
      <h1 className="sr-only">{tHero("title")}</h1>
      <HeroSection heroUrl={homepage?.hero_url} />
      <PromoSection promos={homepage?.promo} />
      <ProductSection products={homepage?.produk} />
      <TVSection bulkyTv={homepage?.bulky_tv} />
      <InfoSection />
      <HowToWorkSecttion />
      <TestimonySection testimonials={homepage?.testimoni} />
      <WholesaleSection />
    </main>
  );
};
