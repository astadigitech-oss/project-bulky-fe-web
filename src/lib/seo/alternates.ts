import { siteUrl } from "@/config";

type Locale = "id" | "en";

/**
 * Builds `metadata.alternates` (canonical + hreflang) for a locale-aware
 * route. `path` must be the locale-agnostic path, e.g. `/products` or
 * `/products/palet-elektronik-small-sale-1` (no leading locale segment).
 */
export function buildAlternates(locale: Locale, path: string = "") {
  const normalizedPath = path === "/" ? "" : path;

  return {
    canonical: `${siteUrl}/${locale}${normalizedPath}`,
    languages: {
      id: `${siteUrl}/id${normalizedPath}`,
      en: `${siteUrl}/en${normalizedPath}`,
      "x-default": `${siteUrl}/id${normalizedPath}`,
    },
  };
}
