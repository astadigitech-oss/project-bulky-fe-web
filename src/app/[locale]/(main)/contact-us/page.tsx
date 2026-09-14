import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactUsClient from "./client";
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
    namespace: "ContactUs",
  });
  const title = t("pageTitle");
  const description = t("hero.description");

  return {
    title,
    description,
    alternates: buildAlternates(lng, "/contact-us"),
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/assets/images/contact-us/7A (Hubungi Kami) (1).webp" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/images/contact-us/7A (Hubungi Kami) (1).webp"],
    },
  };
};

const ContactUsPage = () => {
  return <ContactUsClient />;
};

export default ContactUsPage;
