"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useApiQuery } from "@/lib/query/use-query";
import type {
  GetNewsListPaginatedResponse,
  GetNewsCategoriesResponse,
  NewsListItem,
} from "@/services/news/types";

const clampLocale = (value?: string): "id" | "en" =>
  value === "en" ? "en" : "id";

function formatArticleDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

function NewsListCard({ item }: { item: NewsListItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {item.image ? (
          <Image
            unoptimized
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-[#9a9a9a]">{formatArticleDate(item.date)}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-black group-hover:text-[#b45309]">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-[#5f5f5f]">
          {item.highlight}
        </p>
      </div>
    </Link>
  );
}

export function NewsListClient({
  initialCategories,
  initialNews,
}: {
  initialCategories?: GetNewsCategoriesResponse;
  initialNews?: GetNewsListPaginatedResponse;
} = {}) {
  const t = useTranslations("BulkyNews");
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const pathname = `/` + (params?.locale ?? "id") + `/news`;
  const query = useSearchParams();
  const locale = clampLocale(params?.locale);

  const [activeCategory, setActiveCategory] = useState(
    query.get("kategori") ?? "",
  );
  const [page, setPage] = useState(Number(query.get("halaman") ?? "1") || 1);

  // `initialData` hanya boleh dipakai pada render pertama (state client masih
  // persis sama dengan searchParams yang dipakai untuk fetch di server).
  const isInitialRenderRef = React.useRef(true);
  useEffect(() => {
    isInitialRenderRef.current = false;
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (activeCategory) sp.set("kategori", activeCategory);
    if (page > 1) sp.set("halaman", String(page));

    const nextQuery = sp.toString();
    const currentQuery = query.toString();

    if (nextQuery !== currentQuery) {
      router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, page, pathname, router]);

  const kategorisQuery = useApiQuery<GetNewsCategoriesResponse>({
    key: ["news-kategoris", locale],
    endpoint: "/web/news/kategori",
    searchParams: { locale },
    staleTime: 5 * 60 * 1000,
    initialData: isInitialRenderRef.current ? initialCategories : undefined,
  });

  const newsQuery = useApiQuery<GetNewsListPaginatedResponse>({
    key: ["news-list-paginated", locale, activeCategory, page],
    endpoint: "/web/news/list",
    searchParams: {
      locale,
      halaman: String(page),
      per_halaman: "9",
      ...(activeCategory ? { kategori: activeCategory } : {}),
    },
    staleTime: 60_000,
    initialData: isInitialRenderRef.current ? initialNews : undefined,
  });

  const kategoris = kategorisQuery.data?.data ?? [];
  const news = newsQuery.data?.data ?? [];
  const meta = newsQuery.data?.meta;

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setPage(1);
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Page header */}
      <div className="xl:max-w-7xl max-w-5xl mx-auto px-8 pt-10 pb-6">
        <h1 className="font-black text-4xl">{t("pageTitle")}</h1>
        <p className="text-gray-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Category strip */}
      <div className="border-b border-gray-100">
        <div className="xl:max-w-7xl max-w-5xl mx-auto px-8 py-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => handleCategoryChange("")}
            className={cn(
              "text-sm px-4 py-1.5 rounded-full whitespace-nowrap border transition-colors flex-shrink-0 font-medium",
              activeCategory === ""
                ? "bg-yellow-400 text-black border-yellow-400"
                : "text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700",
            )}
          >
            {t("categories.all")}
          </button>
          {kategoris.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                "text-sm px-4 py-1.5 rounded-full whitespace-nowrap border transition-colors flex-shrink-0 font-medium",
                activeCategory === cat.slug
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="xl:max-w-7xl max-w-5xl mx-auto px-8 py-8">
        {newsQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[16/9] rounded-3xl bg-gray-100 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsListCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-gray-500">{t("empty")}</p>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:border-gray-400 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg border transition-colors",
                  page === p
                    ? "bg-yellow-400 border-yellow-400 text-black font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-400",
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={page >= meta.last_page}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:border-gray-400 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
