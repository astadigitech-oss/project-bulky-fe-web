import React from "react";
import type { Metadata } from "next";
import { ProductIdClient } from "./_components/client";
import { apiUrl } from "@/config";
import { buildAlternates } from "@/lib/seo/alternates";
import { JsonLd } from "@/components/json-ld";

type Locale = "id" | "en";

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

// Backend yang lambat/macet tidak boleh menggantung SSR halaman selamanya.
const REQUEST_TIMEOUT_MS = 10_000;

type ProductSeoData = {
  name: string;
  images: string[];
  price: { old_price: string; current_price: string };
  detail: { category: string; stock: number };
};

async function fetchProductSeoData(productId: string, locale: Locale) {
  try {
    const url = `${apiUrl}/web/products/${encodeURIComponent(productId)}?locale=${locale}`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data as ProductSeoData | undefined;
  } catch {
    return null;
  }
}

const parsePrice = (value?: string) => Number((value ?? "").replace(/[^\d]/g, "")) || undefined;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; productId: string }>;
}): Promise<Metadata> {
  const { locale, productId } = await params;
  const lng = clampLocale(locale);
  const product = await fetchProductSeoData(productId, lng);
  const alternates = buildAlternates(lng, `/products/${productId}`);

  if (!product) {
    return { title: "Bulky.id", alternates };
  }

  const title = `${product.name} - Bulky.id`;
  const description = product.detail?.category
    ? `${product.name} - ${product.detail.category}. Harga ${product.price.current_price} di Bulky.id.`
    : `${product.name} - Belanja di Bulky.id.`;
  const image = product.images?.[0];

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image }] : [{ url: "/assets/images/logo-bulky.webp" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image || "/assets/images/logo-bulky.webp"],
    },
  };
}

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ locale: string; productId: string }>;
}) => {
  const { locale, productId } = await params;
  const lng = clampLocale(locale);
  const product = await fetchProductSeoData(productId, lng);

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.images ?? [],
        category: product.detail?.category || undefined,
        offers: {
          "@type": "Offer",
          priceCurrency: "IDR",
          price: parsePrice(product.price?.current_price),
          availability:
            (product.detail?.stock ?? 0) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      }
    : null;

  return (
    <div className="w-full px-17.5 my-16 mx-auto xl:max-w-7xl max-w-5xl">
      {productJsonLd && <JsonLd data={productJsonLd} />}
      <ProductIdClient />
    </div>
  );
};

export default ProductDetailPage;
