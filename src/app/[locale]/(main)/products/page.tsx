import React from "react";
import { ProductClient } from "./_components/client";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo/alternates";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const lng = locale === "en" ? "en" : "id";
  const t = await getTranslations({ locale: lng, namespace: "Products" });
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: buildAlternates(lng, "/products"),
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
};

const ProductPage = () => {
  return (
    <div>
      <ProductClient />
    </div>
  );
};

export default ProductPage;
