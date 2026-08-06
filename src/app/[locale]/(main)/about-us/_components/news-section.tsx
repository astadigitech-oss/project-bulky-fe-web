"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useApiQuery } from "@/lib/query/use-query";
import { Link } from "@/i18n/navigation";
import type { GetNewsListResponse, NewsListItem } from "@/services/news/types";

type Locale = "id" | "en";

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

function NewsCard({ item }: { item: NewsListItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group grid grid-cols-[140px_1fr] gap-3 rounded-2xl transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="overflow-hidden rounded-2xl bg-[#f5f5f5]">
        {item.image ? (
          <Image
            unoptimized
            src={item.image}
            alt={item.title}
            width={280}
            height={200}
            className="h-[95px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-[95px] w-full" />
        )}
      </div>
      <div>
        <h5 className="line-clamp-1 text-base font-semibold text-black group-hover:text-[#b45309]">
          {item.title}
        </h5>
        <p className="line-clamp-2 text-sm text-[#5f5f5f]">{item.highlight}</p>
        <p className="mt-2 text-xs text-[#9a9a9a]">{item.date}</p>
      </div>
    </Link>
  );
}

export function NewsSection() {
  const t = useTranslations("AboutUs.section5");
  const params = useParams<{ locale: string }>();
  const locale = clampLocale(params?.locale);

  const listQuery = useApiQuery<GetNewsListResponse>({
    key: ["news-list", locale],
    endpoint: "/web/news",
    searchParams: { locale },
  });

  const news = listQuery.data?.data ?? [];
  const featured = news[0];
  const rest = news.slice(1, 5);

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-12 md:px-8 lg:px-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h3 className="text-4xl font-bold text-black">{t("heading")}</h3>
        <Link
          href="/news"
          className="group flex shrink-0 items-center gap-1.5 rounded-full border border-[#b45309] px-4 py-2 text-sm font-medium text-[#b45309] transition-colors hover:bg-[#b45309] hover:text-white"
        >
          {t("viewAll")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {listQuery.isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffcf02] border-t-black" />
        </div>
      ) : listQuery.isError || news.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">{t("empty")}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          {featured && (
            <Link
              href={`/news/${featured.slug}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-3xl bg-[#f5f5f5]">
                {featured.image && (
                  <Image
                    unoptimized
                    src={featured.image}
                    alt={featured.title}
                    width={1240}
                    height={479}
                    className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <h4 className="mt-4 text-3xl font-semibold leading-tight text-black group-hover:text-[#b45309]">
                {featured.title}
              </h4>
              <p className="mt-2 line-clamp-2 text-sm text-[#8a8a8a]">
                {featured.highlight}
              </p>
              <p className="mt-3 text-sm text-[#8a8a8a]">{featured.date}</p>
            </Link>
          )}

          <div className="space-y-4">
            {rest.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
