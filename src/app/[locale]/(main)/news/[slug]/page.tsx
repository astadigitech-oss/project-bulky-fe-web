import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { apiUrl } from "@/config";
import { NewsDetailClient } from "./_components/client";
import type { GetNewsDetailResponse } from "@/services/news/types";
import { buildAlternates } from "@/lib/seo/alternates";
import { JsonLd } from "@/components/json-ld";
import { siteUrl } from "@/config";

const clampLocale = (value?: string): "id" | "en" =>
  value === "en" ? "en" : "id";

// Backend yang lambat/macet tidak boleh menggantung SSR halaman selamanya.
const REQUEST_TIMEOUT_MS = 10_000;

async function fetchNewsDetail(
  slug: string,
  locale: string,
): Promise<GetNewsDetailResponse | null> {
  try {
    const url = `${apiUrl}/web/news/${encodeURIComponent(slug)}?locale=${locale}`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
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
    alternates: buildAlternates(lng, `/news/${slug}`),
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
  const detail = data.data?.data;

  const articleJsonLd = detail
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: detail.title,
        image: detail.image ? [detail.image] : undefined,
        datePublished: detail.date,
        articleSection: detail.category?.name,
        mainEntityOfPage: `${siteUrl}/${lng}/news/${slug}`,
        publisher: {
          "@type": "Organization",
          name: "Bulky.id",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/assets/images/logo-bulky.webp`,
          },
        },
      }
    : null;

  return (
    <main className="w-full bg-white">
      {articleJsonLd && <JsonLd data={articleJsonLd} />}
      <NewsDetailClient initialData={data} locale={lng} notFoundLabel={t("empty")} />
    </main>
  );
}
