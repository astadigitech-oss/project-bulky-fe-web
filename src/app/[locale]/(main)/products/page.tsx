import { ProductClient } from "./_components/client";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo/alternates";
import { buildUrl } from "@/lib/query/utils";
import type {
  FilterResponse,
  ProductListResponse,
} from "@/services/products/types";

const clampLocale = (value?: string): "id" | "en" =>
  value === "en" ? "en" : "id";

// Backend yang lambat/macet tidak boleh menggantung SSR halaman selamanya.
const REQUEST_TIMEOUT_MS = 10_000;

async function fetchProductFilters(
  locale: string,
): Promise<FilterResponse | null> {
  try {
    const url = buildUrl("/web/products/filters", { locale });
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as FilterResponse;
  } catch {
    return null;
  }
}

async function fetchProductList(
  locale: string,
): Promise<ProductListResponse | null> {
  try {
    const url = buildUrl("/web/products", {
      locale,
      p: 1,
      order: "new",
      sort: "desc",
    });
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as ProductListResponse;
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
  const t = await getTranslations({ locale: lng, namespace: "Products" });
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: buildAlternates(lng, "/products"),
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
};

const ProductPage = async ({
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
  // filter/pencarian) supaya konten produk terindeks search engine.
  // Kalau URL sudah mengandung filter/pencarian/halaman lain, biarkan
  // client-side query yang mengambil data (menghindari fetch server yang
  // tidak akan dipakai oleh initialData di client).
  const isDefaultView = Object.keys(sp).length === 0;

  const [initialFilters, initialProducts] = await Promise.all([
    fetchProductFilters(lng),
    isDefaultView ? fetchProductList(lng) : Promise.resolve(null),
  ]);

  return (
    <div>
      <ProductClient
        initialFilters={initialFilters ?? undefined}
        initialProducts={initialProducts ?? undefined}
      />
    </div>
  );
};

export default ProductPage;
