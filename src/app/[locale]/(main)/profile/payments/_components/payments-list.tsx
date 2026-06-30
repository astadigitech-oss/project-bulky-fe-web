"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2 } from "lucide-react";
import { useApiQuery } from "@/lib/query/use-query";
import type { GetOrdersResponse, Order } from "@/services/orders/types";
import { EmptyState } from "../../_components/profile-shell";

function PaymentCard({ order }: { order: Order }) {
  const t = useTranslations("ProfilePages.payment.card");

  return (
    <article className="border-b border-[#d9d9d9] py-4 last:border-b-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        {/* Product info */}
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="flex size-[120px] shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-[#727272cc] bg-[#efefef]">
            {order.gambar_url ? (
              <Image
                src={order.gambar_url}
                alt={order.nama_produk}
                width={120}
                height={120}
                className="size-full object-cover"
              />
            ) : (
              <Package className="size-16 text-[#727272]" strokeWidth={1.4} />
            )}
          </div>
          <div className="flex min-w-0 h-[120px] flex-col">
            <p className="mb-0.5 text-xs text-[#727272]">{order.kode}</p>
            <h3 className="mb-2 text-sm text-black">{order.nama_produk}</h3>
            <p className="text-xl font-bold text-[#ff9900]">
              {order.harga_setelah_diskon_formatted ?? order.harga_sebelum_diskon_formatted}
            </p>
          </div>
        </div>

        {/* Payment button */}
        <div className="shrink-0">
          {order.payment_url ? (
            <a
              href={order.payment_url}
              className="flex h-10 items-center justify-center whitespace-nowrap rounded bg-[#ffcf02] px-5 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300]"
            >
              {t("payNow")}
            </a>
          ) : (
            <div className="flex h-10 items-center justify-center whitespace-nowrap rounded bg-[#efefef] px-5 text-sm text-[#727272]">
              {t("payNow")}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function PaymentsList() {
  const t = useTranslations("ProfilePages.payment");
  const locale = useLocale();

  const { data, isLoading, isError } = useApiQuery<GetOrdersResponse>({
    key: ["orders", "PENDING", locale],
    endpoint: "/web/orders",
    searchParams: { payment_status: "PENDING", locale },
  });

  const orders = data?.data ?? [];

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

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="payment"
        title={t("emptyTitle")}
        actionLabel={t("emptyAction")}
      />
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <PaymentCard key={order.id} order={order} />
      ))}
    </div>
  );
}
