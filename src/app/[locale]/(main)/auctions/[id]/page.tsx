import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuctionDetailClient } from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auction");
  return { title: t("detailPageTitle") };
}

export default function AuctionDetailPage() {
  return <AuctionDetailClient />;
}
