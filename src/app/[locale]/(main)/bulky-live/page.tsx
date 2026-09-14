import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BulkyTVClient } from "./client";
import { apiUrl } from "@/config";
import { buildAlternates } from "@/lib/seo/alternates";
import type {
  GetKategoriVideoResponse,
  GetVideoListResponse,
} from "@/services/videos/types";

const REQUEST_TIMEOUT_MS = 10_000;

async function fetchBulkyLiveData(locale: "id" | "en") {
  const options = {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  };

  try {
    const [categoriesResponse, videosResponse] = await Promise.all([
      fetch(`${apiUrl}/public/kategori-video?locale=${locale}`, options),
      fetch(`${apiUrl}/public/video?locale=${locale}&halaman=1&per_halaman=18`, options),
    ]);

    return {
      categories: categoriesResponse.ok
        ? ((await categoriesResponse.json()) as GetKategoriVideoResponse)
        : undefined,
      videos: videosResponse.ok
        ? ((await videosResponse.json()) as GetVideoListResponse)
        : undefined,
    };
  } catch {
    return { categories: undefined, videos: undefined };
  }
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const lng = locale === "en" ? "en" : "id";
  const t = await getTranslations({ locale: lng, namespace: "BulkyTV" });
  const title = t("pageTitle");
  const description = t("subtitle");

  return {
    title,
    description,
    alternates: buildAlternates(lng, "/bulky-live"),
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
};

const BulkyTVPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const initialData = await fetchBulkyLiveData(locale === "en" ? "en" : "id");

  return (
    <BulkyTVClient
      initialCategories={initialData.categories}
      initialVideos={initialData.videos}
    />
  );
};

export default BulkyTVPage;
