import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuctionListClient } from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auction");
  return { title: t("pageTitle") };
}

export default function AuctionListPage() {
  return <AuctionListClient />;
}
