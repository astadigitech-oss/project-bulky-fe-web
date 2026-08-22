import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FaqClient from "./client";
import { apiUrl } from "@/config";
import { JsonLd } from "@/components/json-ld";
import type { FaqItem, GetFaqResponse } from "@/services/faq/types";

type Locale = "id" | "en";

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

// Backend yang lambat/macet tidak boleh menggantung SSR halaman selamanya.
const REQUEST_TIMEOUT_MS = 10_000;

async function fetchFaqSeoData(locale: Locale): Promise<FaqItem[]> {
  try {
    const url = `${apiUrl}/web/faq?locale=${locale}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as GetFaqResponse;
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as "en" | "id",
    namespace: "Faq",
  });
  return {
    title: t("pageTitle"),
  };
};

const FaqPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const lng = clampLocale(locale);
  const faqItems = await fetchFaqSeoData(lng);

  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.pertanyaan,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.jawaban,
            },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <FaqClient />
    </>
  );
};

export default FaqPage;
