import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NewsListClient } from "./client";
import { buildAlternates } from "@/lib/seo/alternates";
import { buildUrl } from "@/lib/query/utils";
import type {
  GetNewsCategoriesResponse,
  GetNewsListPaginatedResponse,
} from "@/services/news/types";

const clampLocale = (value?: string): "id" | "en" =>
  value === "en" ? "en" : "id";

// Backend yang lambat/macet tidak boleh menggantung SSR halaman selamanya.
const REQUEST_TIMEOUT_MS = 10_000;

async function fetchNewsCategories(
  locale: string,
): Promise<GetNewsCategoriesResponse | null> {
  try {
    const url = buildUrl("/web/news/kategori", { locale });
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as GetNewsCategoriesResponse;
  } catch {
    return null;
  }
}

async function fetchNewsList(
  locale: string,
): Promise<GetNewsListPaginatedResponse | null> {
  try {
    const url = buildUrl("/web/news/list", {
      locale,
      halaman: "1",
      per_halaman: "9",
    });
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as GetNewsListPaginatedResponse;
  } catch {
    return null;
  }
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const lng = clampLocale(locale);
  const t = await getTranslations({
    locale: lng,
    namespace: "BulkyNews",
  });
  const title = t("pageTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: buildAlternates(lng, "/news"),
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
};

const NewsListPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { locale } = await params;
  const lng = clampLocale(locale);
  const sp = await searchParams;

  // Data awal (SSR) hanya diambil untuk kondisi default (halaman 1, tanpa
  // filter kategori) supaya konten berita terindeks search engine.
  const isDefaultView = Object.keys(sp).length === 0;

  const [initialCategories, initialNews] = await Promise.all([
    fetchNewsCategories(lng),
    isDefaultView ? fetchNewsList(lng) : Promise.resolve(null),
  ]);

  return (
    <NewsListClient
      initialCategories={initialCategories ?? undefined}
      initialNews={initialNews ?? undefined}
    />
  );
};

export default NewsListPage;
