import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactUsClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactUs" });
  return {
    title: t("pageTitle"),
  };
};

const ContactUsPage = () => {
  return <ContactUsClient />;
};

export default ContactUsPage;
