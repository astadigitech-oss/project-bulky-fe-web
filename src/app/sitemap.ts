import type { MetadataRoute } from "next";
import { siteUrl } from "@/config";
import { fetchAllProductSlugs, fetchAllNewsSlugs } from "@/lib/seo/fetch-list";

export const revalidate = 3600;

const locales = ["id", "en"] as const;

const staticRoutes = [
  "",
  "/products",
  "/news",
  "/about-us",
  "/bulky-live",
  "/contact-us",
  "/faq",
  "/how-to-buy",
  "/payment-information",
  "/privacy-policy",
  "/terms-conditions",
];

function localizedEntry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        id: `${siteUrl}/id${path}`,
        en: `${siteUrl}/en${path}`,
      },
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = staticRoutes.flatMap((path) =>
    localizedEntry(path, path === "" ? "daily" : "weekly", path === "" ? 1 : 0.7),
  );

  const [productSlugsId, productSlugsEn, newsSlugsId, newsSlugsEn] =
    await Promise.all([
      fetchAllProductSlugs("id"),
      fetchAllProductSlugs("en"),
      fetchAllNewsSlugs("id"),
      fetchAllNewsSlugs("en"),
    ]);

  const productEntries: MetadataRoute.Sitemap = productSlugsId.map(
    (slug) => ({
      url: `${siteUrl}/id/products/${slug}`,
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: {
          id: `${siteUrl}/id/products/${slug}`,
          en: `${siteUrl}/en/products/${slug}`,
        },
      },
    }),
  );

  // English product entries use their own slug set in case slugs differ
  // per-locale; if a slug is already covered by the `id` alternates above
  // it is still safe to include (duplicate <loc> entries are ignored by
  // search engines, they just read the first one).
  const productEntriesEn: MetadataRoute.Sitemap = productSlugsEn
    .filter((slug) => !productSlugsId.includes(slug))
    .map((slug) => ({
      url: `${siteUrl}/en/products/${slug}`,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  const newsEntries: MetadataRoute.Sitemap = newsSlugsId.map((slug) => ({
    url: `${siteUrl}/id/news/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    alternates: {
      languages: {
        id: `${siteUrl}/id/news/${slug}`,
        en: `${siteUrl}/en/news/${slug}`,
      },
    },
  }));

  const newsEntriesEn: MetadataRoute.Sitemap = newsSlugsEn
    .filter((slug) => !newsSlugsId.includes(slug))
    .map((slug) => ({
      url: `${siteUrl}/en/news/${slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [
    ...staticEntries,
    ...productEntries,
    ...productEntriesEn,
    ...newsEntries,
    ...newsEntriesEn,
  ];
}
