import React from "react";
import { ProductClient } from "./_components/client";
import type { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return {
    title: locale === "en" ? "Products" : "Produk",
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
