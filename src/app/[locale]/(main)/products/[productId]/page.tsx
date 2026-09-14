import React from "react";
import type { Metadata } from "next";
import { ProductIdClient } from "./_components/client";
import { apiUrl } from "@/config";
import { buildAlternates } from "@/lib/seo/alternates";
import { JsonLd } from "@/components/json-ld";
import { notFound } from "next/navigation";
import type { ProductDetailResponse } from "@/services/products/types";

type Locale = "id" | "en";

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

// Backend yang lambat/macet tidak boleh menggantung SSR halaman selamanya.
const REQUEST_TIMEOUT_MS = 10_000;

async function fetchProductSeoData(productId: string, locale: Locale) {
  try {
    const url = `${apiUrl}/web/products/${encodeURIComponent(productId)}?locale=${locale}`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (res.status === 404) return { status: "not-found" as const };
    if (!res.ok) return { status: "unavailable" as const };

    const json = (await res.json()) as ProductDetailResponse;
    if (!json?.data) return { status: "unavailable" as const };

    return { status: "found" as const, product: json };
  } catch {
    return { status: "unavailable" as const };
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
  const result = await fetchProductSeoData(productId, lng);
  const alternates = buildAlternates(lng, `/products/${productId}`);

  if (result.status !== "found") {
    return { title: "Bulky.id", alternates };
  }

  const product = result.product.data;

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
  const result = await fetchProductSeoData(productId, lng);

  if (result.status === "not-found") notFound();

  const product = result.status === "found" ? result.product.data : null;

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
      <ProductIdClient
        initialProduct={result.status === "found" ? result.product : undefined}
      />
    </div>
  );
};

export default ProductDetailPage;
