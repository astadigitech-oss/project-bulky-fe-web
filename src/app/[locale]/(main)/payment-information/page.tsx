import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PaymentInformationClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as "en" | "id",
    namespace: "PaymentInformation",
  });
  return {
    title: t("pageTitle"),
  };
};

const PaymentInformationPage = () => {
  return <PaymentInformationClient />;
};

export default PaymentInformationPage;
