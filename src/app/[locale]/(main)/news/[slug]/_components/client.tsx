"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CalendarDays, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useApiQuery } from "@/lib/query/use-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type {
  GetNewsDetailResponse,
  NewsListItem,
} from "@/services/news/types";

type Locale = "id" | "en";

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

function formatArticleDate(date: string, locale: Locale): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

function RecommendationCard({ item, locale }: { item: NewsListItem; locale: Locale }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex items-center gap-3 rounded-2xl transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5]">
        {item.image && (
          <Image
            unoptimized
            src={item.image}
            alt={item.title}
            width={200}
            height={140}
            className="h-[72px] w-[96px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="min-w-0">
        <h5 className="line-clamp-2 text-sm font-semibold leading-snug text-black group-hover:text-[#b45309]">
          {item.title}
        </h5>
        <p className="mt-1 text-xs text-[#9a9a9a]">{formatArticleDate(item.date, locale)}</p>
      </div>
    </Link>
  );
}

export function NewsDetailClient({
  initialData,
  locale: serverLocale,
  notFoundLabel,
}: {
  initialData: GetNewsDetailResponse;
  locale: Locale;
  notFoundLabel: string;
}) {
  const t = useTranslations("AboutUs.section5");
  const params = useParams<{ locale: string; slug: string }>();
  const locale = clampLocale(params?.locale) || serverLocale;

  const { data } = useApiQuery<GetNewsDetailResponse>({
    key: ["news-detail", params?.slug, locale],
    endpoint: `/web/news/${params?.slug ?? ""}`,
    searchParams: { locale },
    initialData,
    enabled: !!params?.slug,
  });

  const detail = data?.data?.data;
  const recommendations = data?.data?.recomendation ?? [];

  if (!detail) {
    return (
      <p className="py-20 text-center text-sm text-gray-500">{notFoundLabel}</p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-8 lg:px-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="text-xs">
            <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-xs">
            <BreadcrumbLink href="/news">{t("breadcrumbLabel")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-xs">
            <BreadcrumbPage>{detail.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ── Main content ── */}
        <article className="min-w-0">
          <header>
            {detail.category?.name && (
              <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-medium text-[#b45309]">
                {detail.category.name}
              </span>
            )}
            <h1 className="mt-3 text-3xl font-bold leading-tight text-black md:text-4xl">
              {detail.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#8a8a8a]">
              <CalendarDays className="size-4" />
              <time dateTime={detail.date}>
                {formatArticleDate(detail.date, locale)}
              </time>
            </div>
          </header>

          {detail.image && (
            <div className="mt-6 overflow-hidden rounded-3xl bg-[#f5f5f5]">
              <Image
                unoptimized
                src={detail.image}
                alt={detail.title}
                width={1240}
                height={600}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* Konten artikel HTML dari backend */}
          <div
            className="mt-8 text-[15px] leading-relaxed text-[#3e3e3e] [&_img]:rounded-xl [&_img]:h-auto [&_img]:max-w-full"
            dangerouslySetInnerHTML={{ __html: detail.content }}
          />

          {detail.label && detail.label.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-[#ededed] pt-6">
              {detail.label.map((l) => (
                <span
                  key={l.slug}
                  className="rounded-full bg-[#f5f5f5] px-3 py-1 text-xs text-[#6b6b6b]"
                >
                  {l.name}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* ── Sidebar: Artikel Lainnya ── */}
        {recommendations.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-black">
                {t("relatedTitle")}
              </h2>
              <Link
                href="/news"
                className="flex items-center gap-1 text-xs font-medium text-[#b45309] hover:underline"
              >
                {t("viewAll")}
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-4 space-y-5">
              {recommendations.map((item) => (
                <RecommendationCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
