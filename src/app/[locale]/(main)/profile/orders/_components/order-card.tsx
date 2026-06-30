"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Warehouse } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Order } from "@/services/orders/types";
import { PickupInfoModal } from "./pickup-info-modal";

function DeliveryButton({ order }: { order: Order }) {
  const t = useTranslations("ProfilePages.orders.card");
  const [pickupOpen, setPickupOpen] = useState(false);

  if (order.order_status === "CANCELLED") return null;

  if (order.delivery_type === "PICKUP") {
    return (
      <>
        <button
          type="button"
          onClick={() => setPickupOpen(true)}
          className="flex h-10 items-center justify-center whitespace-nowrap rounded bg-[#ffcf02] px-5 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300]"
        >
          {t("pickupInfo")}
        </button>
        <PickupInfoModal open={pickupOpen} onClose={() => setPickupOpen(false)} />
      </>
    );
  }

  if (order.delivery_type === "DELIVEREE" && order.tracking_url) {
    return (
      <a
        href={order.tracking_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 items-center justify-center whitespace-nowrap rounded bg-[#ffcf02] px-5 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300]"
      >
        {t("trackOrder")}
      </a>
    );
  }

  if (order.delivery_type === "FORWARDER") {
    // Tracking modal — API menyusul
    return (
      <button
        type="button"
        disabled
        className="flex h-10 items-center justify-center whitespace-nowrap rounded bg-[#efefef] px-5 text-sm font-bold text-[#727272] cursor-not-allowed"
      >
        {t("trackOrder")}
      </button>
    );
  }

  return null;
}

export function OrderCard({ order }: { order: Order }) {
  const t = useTranslations("ProfilePages.orders.card");

  return (
    <article className="border-b border-[#d9d9d9] py-4 last:border-b-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
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
            <p className="mt-auto flex items-center gap-1.5 text-xs text-[#01798a]">
              <Warehouse className="size-4" /> {t("palletType")}
            </p>
          </div>
        </div>

        {/* Status + actions */}
        <div className="flex shrink-0 flex-col justify-between md:h-[120px] md:items-end">
          <div className="md:text-right">
            <p className="text-sm text-[#727272]">{t("deliveryStatus")}</p>
            <p className="mt-1 text-sm font-bold text-[#01798a]">
              {order.delivery_status_label}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/profile/orders/${order.id}`}
              className="flex h-10 items-center justify-center whitespace-nowrap rounded border border-[#d9d9d9] px-5 text-sm text-[#1d1d1d] transition-colors hover:border-[#ffcf02] hover:bg-[#fff8df]"
            >
              {t("viewDetail")}
            </Link>
            <DeliveryButton order={order} />
          </div>
        </div>
      </div>
    </article>
  );
}
