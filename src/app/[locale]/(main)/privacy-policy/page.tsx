import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PrivacyPolicyClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as "en" | "id",
    namespace: "PrivacyPolicy",
  });
  return {
    title: t("pageTitle"),
  };
};

const PrivacyPolicyPage = () => {
  return <PrivacyPolicyClient />;
};

export default PrivacyPolicyPage;
