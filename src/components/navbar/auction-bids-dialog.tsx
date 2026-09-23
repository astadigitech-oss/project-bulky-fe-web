"use client";

import Image from "next/image";
import { Gavel, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApiQuery } from "@/lib/query/use-query";
import { formatRupiah } from "@/lib/utils";
import type { MyBidsResponse, OwnBid } from "@/services/auctions/types";

const statusClass: Record<OwnBid["status"], string> = {
  PENDING: "border-[#d8b84b] bg-[#fff8d7] text-[#735a10]",
  WON: "border-[#7fa166] bg-[#eef7e9] text-[#41672a]",
  LOST: "border-[#b8b8b2] bg-[#f2f2ee] text-[#5a5a56]",
};

export function AuctionBidsDialog({
  open,
  onOpenChange,
  batchID,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchID?: string;
  title?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Auction");
  const bidsQuery = useApiQuery<MyBidsResponse>({
    key: ["auction-my-bids", locale, batchID ?? "all"],
    endpoint: "/web/auctions/my-bids",
    searchParams: { locale, page: 1, per_page: 50, ...(batchID ? { batch_id: batchID } : {}) },
    enabled: open,
  });
  const bids = bidsQuery.data?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-[calc(100%-2rem)] overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b border-gray-200 px-6 py-5 pr-12">
          <DialogTitle className="text-xl font-bold">{title ?? t("myBids")}</DialogTitle>
          <DialogDescription>{batchID && bidsQuery.data ? t("submittedBids", { count: String(bidsQuery.data.meta.total_items) }) : t("bidHistory")}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(88vh-6.5rem)] overflow-y-auto px-6 py-5">
          {bidsQuery.isLoading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Loader2 className="size-7 animate-spin text-yellow-600" />
            </div>
          ) : null}
          {bidsQuery.isError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {t("bidHistoryError")}
            </p>
          ) : null}
          {!bidsQuery.isLoading && !bidsQuery.isError && bids.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <Gavel className="mb-3 size-9 text-gray-400" />
              <h2 className="font-semibold">{t("noBids")}</h2>
              <p className="mt-1 text-sm text-gray-500">{t("noBidsDescription")}</p>
              <Button
                nativeButton={false}
                render={<Link href="/auctions" />}
                onClick={() => onOpenChange(false)}
                className="mt-5 bg-yellow-400 text-black hover:bg-yellow-500"
              >
                {t("browseAuctions")}
              </Button>
            </div>
          ) : null}
          {bids.length > 0 ? (
            <div className="space-y-3">
              {bids.map((bid) => <AuctionBidRow key={bid.id} bid={bid} />)}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AuctionBidRow({ bid }: { bid: OwnBid }) {
  const locale = useLocale();
  const t = useTranslations("Auction");
  const bidInput = bid.bid.input_mode === "PERCENT"
    ? t("percentageInput", { percent: bid.bid.input_percent })
    : t("amountInput");
  const createdAt = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(bid.created_at));

  return (
    <article className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center">
      <div className="relative aspect-square w-20 overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
        {bid.thumbnail_url ? (
          <Image src={bid.thumbnail_url} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <Gavel className="absolute inset-0 m-auto size-6 text-gray-400" />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate font-semibold">{bid.batch_name}</h2>
          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClass[bid.status]}`}>
            {bid.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {bidInput} · {formatRupiah(bid.bid.amount)}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {t("shippingShort")} {formatRupiah(bid.shipping_estimate.amount)} · {t("taxWithRate", { rate: bid.ppn_estimate.rate })} {formatRupiah(bid.ppn_estimate.amount)} · {createdAt}
        </p>
        {bid.note ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600"><span className="font-semibold text-gray-700">{t("bidNote")}:</span> {bid.note}</p> : null}
      </div>
      <div className="border-t border-gray-100 pt-3 text-left sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 sm:text-right">
        <p className="text-xs text-gray-500">{t("estimatedTotal")}</p>
        <p className="mt-1 font-bold text-orange-500">{formatRupiah(bid.estimated_total)}</p>
      </div>
    </article>
  );
}
