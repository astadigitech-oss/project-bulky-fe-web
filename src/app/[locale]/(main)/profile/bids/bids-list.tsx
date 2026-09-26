"use client";

import Image from "next/image";
import { Gavel, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/lib/query/use-query";
import { formatRupiah } from "@/lib/utils";
import { useProtectRoute } from "@/providers/session-provider";
import type { MyBidsResponse, OwnBid } from "@/services/auctions/types";

export function BidsList() {
  const locale = useLocale();
  const t = useTranslations("Auction");
  const { isLoading: sessionLoading } = useProtectRoute();
  const bidsQuery = useApiQuery<MyBidsResponse>({ key: ["auction-my-bids", locale], endpoint: "/web/auctions/my-bids", searchParams: { locale, page: 1, per_page: 50 }, enabled: !sessionLoading });
  const bids = bidsQuery.data?.data ?? [];
  if (sessionLoading || bidsQuery.isLoading) return <div className="flex min-h-72 items-center justify-center"><Loader2 className="size-7 animate-spin text-[#b08f00]" /></div>;
  if (bidsQuery.isError) return <p className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{t("bidHistoryError")}</p>;
  if (bids.length === 0) return <div className="flex min-h-72 flex-col items-center justify-center text-center"><Gavel className="mb-3 size-9 text-[#7b7b73]" /><h1 className="font-semibold">{t("noBids")}</h1><p className="mt-1 text-sm text-[#72726c]">{t("noBidsDescription")}</p><Button nativeButton={false} render={<Link href="/auctions" />} className="mt-5 bg-[#ffcf02] text-black hover:bg-[#eabb00]">{t("browseAuctions")}</Button></div>;
  return <div><div className="mb-6"><h1 className="text-2xl font-bold">{t("myBids")}</h1><p className="mt-1 text-sm text-[#72726c]">{t("bidHistory")}</p></div><div className="space-y-3">{bids.map((bid) => <BidRow key={bid.id} bid={bid} />)}</div></div>;
}

function BidRow({ bid }: { bid: OwnBid }) {
  const locale = useLocale();
  const t = useTranslations("Auction");
  const createdAt = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(bid.created_at));
  return <article className="grid gap-4 border border-[#e0e0da] p-4 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center"><div className="relative aspect-square w-20 overflow-hidden bg-[#ecece6]">{bid.thumbnail_url ? <Image src={bid.thumbnail_url} alt="" fill sizes="80px" className="object-cover" /> : <Gavel className="absolute inset-0 m-auto size-6 text-[#8d8d85]" />}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate font-semibold">{bid.batch_name}</h2>{bid.submitted ? <span className="border border-[#7fa166] bg-[#eef7e9] px-2 py-0.5 text-xs font-semibold text-[#41672a]">{t("submitted")}</span> : null}</div><p className="mt-1 text-sm text-[#5f5f59]">{bid.bid.input_mode === "PERCENT" ? `${bid.bid.input_percent}%` : t("amountMode")} · {formatRupiah(bid.bid.amount)}</p><p className="mt-1 text-xs text-[#777770]">{t("shippingShort")} {formatRupiah(bid.shipping_estimate.amount)} · {t("taxShort")} {formatRupiah(bid.ppn_estimate.amount)} · {createdAt}</p></div><div className="border-t pt-3 text-left sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 sm:text-right"><p className="text-xs text-[#74746e]">{t("estimatedTotal")}</p><p className="mt-1 font-bold">{formatRupiah(bid.estimated_total)}</p></div></article>;
}
