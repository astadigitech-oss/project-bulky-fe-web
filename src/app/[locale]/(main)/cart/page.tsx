import React from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CartClient } from "./_components/client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CartPage");
  return { title: t("title"), robots: { index: false, follow: false } };
}

const CartPage = () => {
  return (
    <div className="w-full px-17.5 my-16 mx-auto xl:max-w-7xl max-w-5xl">
      <CartClient />
    </div>
  );
};

export default CartPage;
