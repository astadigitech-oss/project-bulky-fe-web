"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2 } from "lucide-react";
import { useApiQuery } from "@/lib/query/use-query";
import type { GetOrdersResponse, Order, OrderStatus } from "@/services/orders/types";
import { EmptyState } from "../../_components/profile-shell";
import { OrderCard } from "./order-card";

type OrderGroup = {
  kode: string;
  items: Order[];
};

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

  const groups = useMemo<OrderGroup[]>(() => {
    const map = new Map<string, Order[]>();
    for (const order of orders) {
      const existing = map.get(order.kode);
      if (existing) existing.push(order);
      else map.set(order.kode, [order]);
    }
    return Array.from(map.entries()).map(([kode, items]) => ({ kode, items }));
  }, [orders]);

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
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.kode} className="rounded-xl border border-[#d9d9d9]">
              {/* Group header */}
              <div className="flex items-center justify-between border-b border-[#d9d9d9] px-4 py-3">
                <p className="text-sm font-semibold text-black">{group.kode}</p>
                {group.items.length > 1 && (
                  <span className="rounded-full bg-[#fff8df] px-2.5 py-0.5 text-xs font-semibold text-[#ff9900]">
                    {group.items.length} {t("itemCount")}
                  </span>
                )}
              </div>
              {/* Items */}
              <div className="divide-y divide-[#d9d9d9] px-4">
                {group.items.map((order, idx) => (
                  <OrderCard key={`${order.id}-${idx}`} order={order} hideKode />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
