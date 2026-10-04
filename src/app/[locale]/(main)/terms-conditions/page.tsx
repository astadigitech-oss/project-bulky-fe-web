import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { siteUrl } from "@/config";
import TermsConditionsClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const currentLocale = locale === "en" ? "en" : "id";
  const localizedPaths = {
    id: getPathname({ locale: "id", href: "/terms-conditions" }),
    en: getPathname({ locale: "en", href: "/terms-conditions" }),
  };
  const t = await getTranslations({
    locale: currentLocale,
    namespace: "TermsConditions",
  });
  return {
    title: t("pageTitle"),
    alternates: {
      canonical: siteUrl + localizedPaths[currentLocale],
      languages: {
        id: siteUrl + localizedPaths.id,
        en: siteUrl + localizedPaths.en,
        "x-default": siteUrl + localizedPaths.id,
      },
    },
  };
};

const TermsConditionsPage = () => {
  return <TermsConditionsClient />;
};

export default TermsConditionsPage;
