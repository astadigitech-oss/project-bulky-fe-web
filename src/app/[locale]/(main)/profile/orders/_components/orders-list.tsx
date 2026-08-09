"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2 } from "lucide-react";
import { useApiQuery } from "@/lib/query/use-query";
import type { GetOrdersResponse } from "@/services/orders/types";
import { EmptyState } from "../../_components/profile-shell";
import { OrderStatusFilterBar, type OrderStatusFilterValue } from "../../_components/order-status-filter";
import { OrderGroupsList, groupOrdersByKode } from "../../_components/order-groups";

export function OrdersList() {
  const t = useTranslations("ProfilePages.orders");
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState<OrderStatusFilterValue>("all");

  const { data, isLoading, isError } = useApiQuery<GetOrdersResponse>({
    key: ["orders", activeFilter, locale],
    endpoint: "/web/orders",
    searchParams: {
      payment_status: "PAID",
      payment_type: "single",
      locale,
      ...(activeFilter !== "all" && { order_status: activeFilter }),
    },
  });

  const orders = data?.data ?? [];
  const groups = groupOrdersByKode(orders);

  return (
    <>
      <OrderStatusFilterBar value={activeFilter} onChange={setActiveFilter} />

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
        <OrderGroupsList groups={groups} />
      )}
    </>
  );
}
