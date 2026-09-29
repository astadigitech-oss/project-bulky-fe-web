import type { Metadata } from "next";
import { redirect } from "@/i18n/navigation";

export const metadata: Metadata = { title: "Bid Saya" };

export default async function BidsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect({ href: "/auctions", locale: locale === "en" ? "en" : "id" });
}
