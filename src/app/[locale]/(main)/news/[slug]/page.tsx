import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { apiUrl } from "@/config";
import { NewsDetailClient } from "./_components/client";
import type { GetNewsDetailResponse } from "@/services/news/types";

const clampLocale = (value?: string): "id" | "en" =>
  value === "en" ? "en" : "id";

async function fetchNewsDetail(
  slug: string,
  locale: string,
): Promise<GetNewsDetailResponse | null> {
  try {
    const url = `${apiUrl}/web/news/${encodeURIComponent(slug)}?locale=${locale}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as GetNewsDetailResponse;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lng = clampLocale(locale);
  const data = await fetchNewsDetail(slug, lng);
  const detail = data?.data?.data;

  if (!detail) {
    return {
      title: locale === "en" ? "News - Bulky.id" : "Berita - Bulky.id",
    };
  }

  const title = detail.meta_title || detail.title;
  const description = detail.meta_description || detail.title;

  return {
    title,
    description,
    keywords: detail.meta_keywords || undefined,
    openGraph: {
      title,
      description,
      type: "article",
      images: detail.image ? [{ url: detail.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: detail.image ? [detail.image] : undefined,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const lng = clampLocale(locale);

  const data = await fetchNewsDetail(slug, lng);
  if (!data) notFound();

  const t = await getTranslations("AboutUs.section5");

  return (
    <main className="w-full bg-white">
      <NewsDetailClient initialData={data} locale={lng} notFoundLabel={t("empty")} />
    </main>
  );
}
