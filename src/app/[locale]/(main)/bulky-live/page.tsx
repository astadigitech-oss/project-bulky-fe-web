import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BulkyTVClient } from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BulkyTV" });
  return { title: t("pageTitle") };
};

const BulkyTVPage = () => {
  return <BulkyTVClient />;
};

export default BulkyTVPage;
