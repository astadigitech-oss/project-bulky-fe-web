"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2 } from "lucide-react";
import { useApiQuery } from "@/lib/query/use-query";
import type { GetOrdersResponse, OrderStatus } from "@/services/orders/types";
import { EmptyState } from "../../_components/profile-shell";
import { OrderCard } from "./order-card";

type FilterValue = "all" | OrderStatus;

type FilterDef = {
  value: FilterValue;
  tKey:
    | "filters.all"
    | "filters.inProcess"
    | "filters.arrived"
    | "filters.shipped"
    | "filters.completed"
    | "filters.cancelled";
};

const FILTERS: FilterDef[] = [
  { value: "all", tKey: "filters.all" },
  { value: "PROCESSING", tKey: "filters.inProcess" },
  { value: "READY", tKey: "filters.arrived" },
  { value: "SHIPPED", tKey: "filters.shipped" },
  { value: "COMPLETED", tKey: "filters.completed" },
  { value: "CANCELLED", tKey: "filters.cancelled" },
];

export function OrdersList() {
  const t = useTranslations("ProfilePages.orders");
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const { data, isLoading, isError } = useApiQuery<GetOrdersResponse>({
    key: ["orders", activeFilter, locale],
    endpoint: "/web/orders",
    searchParams: {
      payment_status: "PAID",
      locale,
      ...(activeFilter !== "all" && { order_status: activeFilter }),
    },
  });

  const orders = data?.data ?? [];

  return (
    <>
      <div className="mb-12 flex flex-col gap-4 xl:flex-row xl:items-center">
        <p className="shrink-0 text-base text-[#727272]">{t("statusLabel")}</p>
        <div className="grid flex-1 grid-cols-3 gap-4 xl:grid-cols-6">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`flex h-9 items-center justify-center whitespace-nowrap rounded border px-4 text-sm transition-colors ${
                activeFilter === filter.value
                  ? "border-[#ff9900] bg-[#fff8df] text-[#1d1d1d]"
                  : "border-[#727272] text-[#727272] hover:border-[#ffcf02] hover:bg-[#fff8df] hover:text-[#1d1d1d]"
              }`}
            >
              {t(filter.tKey)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#ffcf02]" />
        </div>
      ) : isError ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-sm text-[#727272]">{t("errorLoading")}</p>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="payment"
          title={t("emptyTitle")}
          actionLabel={t("emptyAction")}
        />
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}
