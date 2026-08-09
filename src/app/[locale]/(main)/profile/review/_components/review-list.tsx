"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Star, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useApiQuery } from "@/lib/query/use-query";
import { EmptyState } from "../../_components/profile-shell";
import { AddReviewModal } from "./add-review-modal";
import type {
  GetPendingReviewResponse,
  GetReviewedListResponse,
  PendingReviewItem,
} from "@/services/review/types";

type Tab = "pending" | "reviewed";

// ─── Pending tab ──────────────────────────────────────────────────────────────

function PendingReviewCard({
  item,
  onReview,
}: {
  item: PendingReviewItem;
  onReview: (item: PendingReviewItem) => void;
}) {
  const t = useTranslations("ProfilePages.review.pendingCard");

  return (
    <article className="border-b border-[#d9d9d9] py-4 last:border-b-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="flex size-[100px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[#727272cc] bg-[#efefef]">
            {item.gambar_produk ? (
              <Image
                src={item.gambar_produk}
                alt={item.nama_produk}
                width={100}
                height={100}
                className="size-full object-cover"
              />
            ) : (
              <Package className="size-12 text-[#727272]" strokeWidth={1.4} />
            )}
          </div>
          <div className="flex min-w-0 flex-col justify-center gap-1">
            <h3 className="text-sm font-medium text-black">{item.nama_produk}</h3>
            <p className="text-sm font-bold text-[#ff9900]">{item.harga_satuan_formatted}</p>
            <p className="text-xs text-[#727272]">{t("qty", { qty: String(item.qty) })}</p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onReview(item)}
            className="flex h-10 items-center justify-center whitespace-nowrap rounded bg-[#ffcf02] px-5 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300]"
          >
            {t("writeReview")}
          </button>
        </div>
      </div>
    </article>
  );
}

function PendingList({ onReview }: { onReview: (item: PendingReviewItem) => void }) {
  const t = useTranslations("ProfilePages.review");

  const { data, isLoading, isError } = useApiQuery<GetPendingReviewResponse>({
    key: ["review-pending"],
    endpoint: "/web/review/pending",
  });

  const items = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#ffcf02]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-[#727272]">{t("errorLoading")}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="payment"
        title={t("emptyPendingTitle")}
        actionLabel={t("emptyAction")}
      />
    );
  }

  return (
    <div>
      {items.map((item) => (
        <PendingReviewCard key={item.pesanan_item_id} item={item} onReview={onReview} />
      ))}
    </div>
  );
}

// ─── Reviewed tab ─────────────────────────────────────────────────────────────

const PER_PAGE = 10;

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="size-4"
          fill={rating >= star ? "#ffcf02" : "none"}
          stroke={rating >= star ? "#ffcf02" : "#d9d9d9"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ReviewedList() {
  const t = useTranslations("ProfilePages.review");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useApiQuery<GetReviewedListResponse>({
    key: ["review-reviewed", page],
    endpoint: "/web/review",
    searchParams: { page: String(page), per_page: String(PER_PAGE) },
  });

  const items = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#ffcf02]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-[#727272]">{t("errorLoading")}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="payment"
        title={t("emptyReviewedTitle")}
        actionLabel={t("emptyAction")}
      />
    );
  }

  return (
    <div>
      {items.map((item) => (
        <article key={item.id} className="border-b border-[#d9d9d9] py-4 last:border-b-0">
          <div className="flex gap-3">
            <div className="flex size-[100px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[#727272cc] bg-[#efefef]">
              {item.gambar_produk ? (
                <Image
                  src={item.gambar_produk}
                  alt={item.nama_produk}
                  width={100}
                  height={100}
                  className="size-full object-cover"
                />
              ) : (
                <Package className="size-12 text-[#727272]" strokeWidth={1.4} />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <h3 className="text-sm font-medium text-black">{item.nama_produk}</h3>
              <StarDisplay rating={item.rating} />
              {item.komentar && (
                <p className="text-sm text-[#727272]">{item.komentar}</p>
              )}
              <span
                className={`mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  item.is_approved
                    ? "bg-[#e6f7f5] text-[#01798a]"
                    : "bg-[#fff8df] text-[#ff9900]"
                }`}
              >
                {item.is_approved ? t("reviewedCard.approved") : t("reviewedCard.pending")}
              </span>
            </div>
          </div>
        </article>
      ))}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#d9d9d9] text-sm text-[#727272] transition-colors hover:border-[#ffcf02] disabled:opacity-40"
          >
            &lsaquo;
          </button>
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded border text-sm transition-colors ${
                p === page
                  ? "border-[#ffcf02] bg-[#fff8df] font-bold text-black"
                  : "border-[#d9d9d9] text-[#727272] hover:border-[#ffcf02]"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#d9d9d9] text-sm text-[#727272] transition-colors hover:border-[#ffcf02] disabled:opacity-40"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReviewList() {
  const t = useTranslations("ProfilePages.review");
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [reviewTarget, setReviewTarget] = useState<PendingReviewItem | null>(null);

  return (
    <>
      {/* Tabs */}
      <div className="mb-8 flex gap-3">
        {(["pending", "reviewed"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex h-9 items-center justify-center whitespace-nowrap rounded border px-5 text-sm transition-colors ${
              activeTab === tab
                ? "border-[#ff9900] bg-[#fff8df] font-medium text-[#1d1d1d]"
                : "border-[#727272] text-[#727272] hover:border-[#ffcf02] hover:bg-[#fff8df] hover:text-[#1d1d1d]"
            }`}
          >
            {tab === "pending" ? t("tabPending") : t("tabReviewed")}
          </button>
        ))}
      </div>

      {activeTab === "pending" ? (
        <PendingList onReview={setReviewTarget} />
      ) : (
        <ReviewedList />
      )}

      <AddReviewModal item={reviewTarget} onClose={() => setReviewTarget(null)} />
    </>
  );
}
