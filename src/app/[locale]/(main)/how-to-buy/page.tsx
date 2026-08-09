import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HowToBuyClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as "en" | "id",
    namespace: "HowToBuy",
  });
  return {
    title: t("pageTitle"),
  };
};

const HowToBuyPage = () => {
  return <HowToBuyClient />;
};

export default HowToBuyPage;
