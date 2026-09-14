import { Metadata } from "next";
import { HompageClient } from "./_components/client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale, Locale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { buildAlternates } from "@/lib/seo/alternates";
import { apiUrl } from "@/config";
import type { HomepageResponse } from "./_components/client";

const REQUEST_TIMEOUT_MS = 10_000;

async function fetchHomepage(locale: "id" | "en"): Promise<HomepageResponse | undefined> {
  try {
    const response = await fetch(`${apiUrl}/web/homepage?locale=${locale}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) return undefined;
    return (await response.json()) as HomepageResponse;
  } catch {
    return undefined;
  }
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const lng = locale as Locale;
  const t = await getTranslations({
    locale: lng,
    namespace: "Header.navigation",
  });
  const tHero = await getTranslations({
    locale: lng,
    namespace: "Homepage.hero",
  });
  const title = t("home");
  const description = tHero("description");

  return {
    title,
    description,
    alternates: buildAlternates(lng === "en" ? "en" : "id"),
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/assets/images/logo-bulky.webp" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/images/logo-bulky.webp"],
    },
  };
};

const HomePage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const initialData = await fetchHomepage(locale === "en" ? "en" : "id");
  return <HompageClient initialData={initialData} />;
};

export default HomePage;
