import React from "react";
import type { Metadata } from "next";
import { ProductIdClient } from "./_components/client";
import { apiUrl } from "@/config";

type Locale = "id" | "en";

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

async function fetchProductName(productId: string, locale: Locale) {
  try {
    const url = `${apiUrl}/web/products/${encodeURIComponent(productId)}?locale=${locale}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.name as string | undefined;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; productId: string }>;
}): Promise<Metadata> {
  const { locale, productId } = await params;
  const lng = clampLocale(locale);
  const name = await fetchProductName(productId, lng);

  if (!name) {
    return { title: "Bulky.id" };
  }

  return { title: `${name} - Bulky.id` };
}

const ProductDetailPage = async () => {
  return (
    <div className="w-full px-17.5 my-16 mx-auto xl:max-w-7xl max-w-5xl">
      <ProductIdClient />
    </div>
  );
};

export default ProductDetailPage;
