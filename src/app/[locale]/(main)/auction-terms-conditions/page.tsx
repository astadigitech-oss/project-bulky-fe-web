import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import TermsConditionsClient from "../terms-conditions/client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as "en" | "id",
    namespace: "AuctionTermsConditions",
  });
  return { title: t("pageTitle") };
};

const AuctionTermsConditionsPage = () => {
  return <TermsConditionsClient auction />;
};

export default AuctionTermsConditionsPage;
