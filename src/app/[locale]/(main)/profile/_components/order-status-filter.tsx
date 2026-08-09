"use client";

import { useTranslations } from "next-intl";
import type { OrderStatus } from "@/services/orders/types";

export type OrderStatusFilterValue = "all" | OrderStatus;

type FilterDef = {
  value: OrderStatusFilterValue;
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

export function OrderStatusFilterBar({
  value,
  onChange,
}: {
  value: OrderStatusFilterValue;
  onChange: (value: OrderStatusFilterValue) => void;
}) {
  const t = useTranslations("ProfilePages.orders");

  return (
    <div className="mb-12 flex flex-col gap-4 xl:flex-row xl:items-center">
      <p className="shrink-0 text-base text-[#727272]">{t("statusLabel")}</p>
      <div className="grid flex-1 grid-cols-3 gap-4 xl:grid-cols-6">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`flex h-9 items-center justify-center whitespace-nowrap rounded border px-4 text-sm transition-colors ${
              value === filter.value
                ? "border-[#ff9900] bg-[#fff8df] text-[#1d1d1d]"
                : "border-[#727272] text-[#727272] hover:border-[#ffcf02] hover:bg-[#fff8df] hover:text-[#1d1d1d]"
            }`}
          >
            {t(filter.tKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
