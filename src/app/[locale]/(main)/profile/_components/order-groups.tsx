"use client";

import { useTranslations } from "next-intl";
import type { Order } from "@/services/orders/types";
import { OrderCard } from "../orders/_components/order-card";

export type OrderGroup = {
  kode: string;
  items: Order[];
};

export function groupOrdersByKode(orders: Order[]): OrderGroup[] {
  const map = new Map<string, Order[]>();
  for (const order of orders) {
    const existing = map.get(order.kode);
    if (existing) existing.push(order);
    else map.set(order.kode, [order]);
  }
  return Array.from(map.entries()).map(([kode, items]) => ({ kode, items }));
}

export function OrderGroupsList({ groups }: { groups: OrderGroup[] }) {
  const t = useTranslations("ProfilePages.orders");

  return (
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
  );
}
