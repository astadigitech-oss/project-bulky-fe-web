import { apiUrl } from "@/config";

/**
 * Server-side paginated list fetchers used to build the sitemap.
 *
 * These intentionally use plain `fetch` (not `useApiQuery`, which is a
 * client-only React Query hook) and never throw — sitemap generation must
 * never fail the build/route just because the backend is briefly down.
 */

const SITEMAP_REVALIDATE_SECONDS = 3600;
// Safety cap so a misbehaving API (e.g. `last_page` never converging) can
// never turn sitemap generation into an unbounded loop.
const MAX_PAGES = 200;

type ProductListItem = {
  slug: string;
};

type ProductListResponse = {
  success: boolean;
  data: ProductListItem[];
  meta: {
    last_page: number;
    current_page: number;
  };
};

type NewsListItem = {
  slug: string;
};

type NewsListResponse = {
  success: boolean;
  data: NewsListItem[];
  meta: {
    last_page: number;
    current_page: number;
  };
};

export async function fetchAllProductSlugs(
  locale: "id" | "en",
): Promise<string[]> {
  const slugs: string[] = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `${apiUrl}/web/products?locale=${locale}&p=${page}`;
      const res = await fetch(url, {
        next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
      });
      if (!res.ok) break;

      const json = (await res.json()) as ProductListResponse;
      const items = json?.data ?? [];
      items.forEach((item) => {
        if (item?.slug) slugs.push(item.slug);
      });

      const lastPage = json?.meta?.last_page ?? page;
      if (page >= lastPage || items.length === 0) break;
    }
  } catch {
    // Backend unreachable — return whatever was collected so far (may be
    // empty). Sitemap generation must degrade gracefully, never throw.
  }

  return slugs;
}

export async function fetchAllNewsSlugs(
  locale: "id" | "en",
): Promise<string[]> {
  const slugs: string[] = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `${apiUrl}/web/news/list?locale=${locale}&halaman=${page}&per_halaman=50`;
      const res = await fetch(url, {
        next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
      });
      if (!res.ok) break;

      const json = (await res.json()) as NewsListResponse;
      const items = json?.data ?? [];
      items.forEach((item) => {
        if (item?.slug) slugs.push(item.slug);
      });

      const lastPage = json?.meta?.last_page ?? page;
      if (page >= lastPage || items.length === 0) break;
    }
  } catch {
    // Same graceful-degradation rationale as fetchAllProductSlugs.
  }

  return slugs;
}
