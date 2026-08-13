import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NewsListClient } from "./client";
import { buildAlternates } from "@/lib/seo/alternates";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const lng = locale === "en" ? "en" : "id";
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

const NewsListPage = () => {
  return <NewsListClient />;
};

export default NewsListPage;
