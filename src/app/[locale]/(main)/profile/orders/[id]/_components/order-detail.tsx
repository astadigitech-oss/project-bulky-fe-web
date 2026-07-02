"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, Package, Warehouse, Truck, CheckCircle2, MapPin, FileText, Store } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useApiQuery } from "@/lib/query/use-query";
import type { GetOrderDetailResponse, OrderStepperStep, DeliveryType } from "@/services/orders/types";
import { PickupInfoModal } from "../../_components/pickup-info-modal";
import { TrackingModal } from "../../_components/tracking-modal";

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = [
  { key: "ordered", icon: Package },
  { key: "packed", icon: Warehouse },
  { key: "shipped", icon: Truck },
  { key: "done", icon: CheckCircle2 },
] as const;

function Stepper({
  stepper,
  deliveryType,
}: {
  stepper: {
    done: OrderStepperStep;
    ordered: OrderStepperStep;
    packed: OrderStepperStep;
    shipped: OrderStepperStep;
  };
  deliveryType: DeliveryType;
}) {
  const t = useTranslations("ProfilePages.orderDetail.stepper");
  const isPickup = deliveryType === "PICKUP";

  const steps = [
    { ...stepper.ordered, icon: Package, label: t("ordered") },
    { ...stepper.packed, icon: Warehouse, label: t("packed") },
    { ...stepper.shipped, icon: isPickup ? Store : Truck, label: isPickup ? t("readyPickup") : t("shipped") },
    { ...stepper.done, icon: CheckCircle2, label: t("done") },
  ];

  return (
    <div className="grid grid-cols-4 gap-0">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.label} className="relative text-center">
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-1/2 top-6 hidden h-1 w-full md:block",
                  step.done ? "bg-[#ffcf02]" : "bg-[#d9d9d9]",
                )}
              />
            )}
            <div className="relative z-10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-[#f5f5f5] text-[#01798a]">
              <Icon
                className={cn("size-6", step.done ? "text-[#01798a]" : "text-[#b0b0b0]")}
                strokeWidth={1.5}
              />
            </div>
            <div
              className={cn(
                "relative z-10 mx-auto mb-2 size-3 rounded-full",
                step.done ? "bg-[#ffcf02]" : "bg-[#d9d9d9]",
              )}
            />
            <p className={cn("text-sm font-medium", step.done ? "text-black" : "text-[#b0b0b0]")}>
              {step.label}
            </p>
            {step.timestamp_label && (
              <p className="mt-0.5 whitespace-pre-line text-xs text-[#727272]">
                {step.timestamp_label}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Cost row ─────────────────────────────────────────────────────────────────

function CostRow({
  label,
  value,
  isTotal,
  muted,
}: {
  label: string;
  value: string;
  isTotal?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex justify-between text-sm",
        isTotal && "border-t border-[#d9d9d9] pt-3 font-bold text-black",
        muted && "text-[#b0b0b0]",
        !isTotal && !muted && "text-[#727272]",
      )}
    >
      <span>{label}</span>
      <span className={isTotal ? "text-[#ff9900]" : undefined}>{value}</span>
    </div>
  );
}

// ─── Delivery badge ───────────────────────────────────────────────────────────

const DELIVERY_ICONS: Record<DeliveryType, React.ElementType> = {
  PICKUP: Store,
  DELIVEREE: Truck,
  FORWARDER: Truck,
};

function DeliveryBadge({ type }: { type: DeliveryType }) {
  const t = useTranslations("ProfilePages.orderDetail.deliveryType");
  const Icon = DELIVERY_ICONS[type];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9d9d9] px-3 py-1 text-sm text-[#727272]">
      <Icon className="size-3.5" />
      {t(type)}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OrderDetail({ id }: { id: string }) {
  const t = useTranslations("ProfilePages.orderDetail");
  const locale = useLocale();
  const [pickupOpen, setPickupOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);

  const { data, isLoading, isError } = useApiQuery<GetOrderDetailResponse>({
    key: ["order-detail", id, locale],
    endpoint: `/web/orders/${id}`,
    searchParams: { locale },
  });

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#ffcf02]" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-[#727272]">{t("errorLoading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/profile/orders"
        className="inline-flex items-center text-sm text-[#727272] hover:text-black"
      >
        ← {t("back")}
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#d9d9d9] pb-5">
        <div>
          <p className="text-xs text-[#727272]">{t("orderId")}</p>
          <p className="mt-0.5 text-base font-bold text-black">{order.kode}</p>
          <p className="mt-1 text-xs text-[#727272]">
            {t("createdAt")}: {new Date(order.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DeliveryBadge type={order.delivery_type} />
          <span className="rounded-full bg-[#fff8df] px-3 py-1 text-sm font-semibold text-[#ff9900]">
            {order.delivery_type === "PICKUP" && (order.order_status === "READY" || order.order_status === "SHIPPED")
              ? t(`orderStatusPickup.${order.order_status}`)
              : t(`orderStatus.${order.order_status}`)}
          </span>
        </div>
      </div>

      {/* Product */}
      <div className="flex gap-4 rounded-xl border border-[#d9d9d9] p-4">
        <div className="flex size-[100px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#d9d9d9] bg-[#efefef]">
          {order.produk.gambar_url ? (
            <Image
              src={order.produk.gambar_url}
              alt={order.produk.nama}
              width={100}
              height={100}
              className="size-full object-cover"
            />
          ) : (
            <Package className="size-12 text-[#727272]" strokeWidth={1.4} />
          )}
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="text-sm font-semibold text-black">{order.produk.nama}</p>
          <p className="text-xs text-[#727272] line-through">
            {order.produk.harga_sebelum_diskon_formatted}
          </p>
          <p className="text-lg font-bold text-[#ff9900]">{order.produk.subtotal_formatted}</p>
          <p className="flex items-center gap-1 text-xs text-[#01798a]">
            <Warehouse className="size-3.5" /> {t("palletType")}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="rounded-xl border border-[#d9d9d9] p-5">
        <p className="mb-5 text-sm font-semibold text-black">{t("progress")}</p>
        <Stepper stepper={order.stepper} deliveryType={order.delivery_type} />
      </div>

      {/* History + Costs */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Status history */}
        <div className="rounded-xl border border-[#d9d9d9] p-5">
          <p className="mb-4 text-sm font-semibold text-black">{t("history")}</p>
          {order.status_history.length === 0 ? (
            <p className="text-sm text-[#b0b0b0]">{t("historyEmpty")}</p>
          ) : (
            <div className="space-y-3">
              {order.status_history.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn("size-2 rounded-full mt-1.5", i === 0 ? "bg-[#01798a]" : "bg-[#d9d9d9]")} />
                    {i < order.status_history.length - 1 && (
                      <div className="w-px flex-1 bg-[#d9d9d9] mt-1" />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className={cn("text-sm", i === 0 ? "font-semibold text-black" : "text-[#727272]")}>
                      {item.label}
                    </p>
                    <p className="text-xs text-[#b0b0b0]">{item.timestamp_label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right col: costs + notes + address */}
        <div className="space-y-5">
          {/* Cost breakdown */}
          <div className="rounded-xl border border-[#d9d9d9] p-5">
            <p className="mb-4 text-sm font-semibold text-black">{t("biaya.title")}</p>
            <div className="space-y-2.5">
              <CostRow label={t("biaya.produk")} value={order.biaya.biaya_produk_formatted} />
              <CostRow
                label={t("biaya.pengiriman")}
                value={order.biaya.biaya_pengiriman_formatted}
                muted={order.biaya.biaya_pengiriman === 0}
              />
              <CostRow
                label={t("biaya.ppn")}
                value={order.biaya.biaya_ppn_formatted}
                muted={order.biaya.biaya_ppn === 0}
              />
              {order.biaya.biaya_lainnya > 0 && (
                <CostRow label={t("biaya.lainnya")} value={order.biaya.biaya_lainnya_formatted} />
              )}
              <CostRow label={t("biaya.total")} value={order.biaya.total_formatted} isTotal />
            </div>
          </div>

          {/* Notes */}
          {order.catatan && (
            <div className="rounded-xl border border-[#d9d9d9] p-5">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-black">
                <FileText className="size-4" /> {t("notes")}
              </p>
              <p className="text-sm text-[#727272]">{order.catatan}</p>
            </div>
          )}

          {/* Address */}
          {order.alamat_pengiriman && (
            <div className="rounded-xl border border-[#d9d9d9] p-5">
              <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-black">
                <MapPin className="size-4" /> {t("address")}
              </p>
              <p className="text-sm font-medium text-black">
                {order.alamat_pengiriman.nama_penerima} &middot; {order.alamat_pengiriman.telepon_penerima}
              </p>
              <p className="mt-1 text-sm text-[#727272]">
                {order.alamat_pengiriman.alamat_lengkap}, {order.alamat_pengiriman.kecamatan},{" "}
                {order.alamat_pengiriman.kota}, {order.alamat_pengiriman.provinsi}{" "}
                {order.alamat_pengiriman.kode_pos}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      {(order.payment_status === "PENDING" && order.payment_url) || order.order_status !== "CANCELLED" ? (
        <div className="flex flex-wrap justify-end gap-3 border-t border-[#d9d9d9] pt-5">
          {/* Delivery action */}
          {order.delivery_type === "PICKUP" && (
            <>
              <button
                type="button"
                onClick={() => setPickupOpen(true)}
                className="flex h-11 items-center justify-center rounded bg-[#ffcf02] px-8 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300]"
              >
                {t("pickupInfo")}
              </button>
              <PickupInfoModal open={pickupOpen} onClose={() => setPickupOpen(false)} />
            </>
          )}
          {order.order_status === "SHIPPED" && (order.delivery_type === "DELIVEREE" || order.delivery_type === "FORWARDER") && (
            <>
              <button
                type="button"
                onClick={() => setTrackingOpen(true)}
                className="flex h-11 items-center justify-center rounded bg-[#ffcf02] px-8 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300]"
              >
                {t("trackOrder")}
              </button>
              <TrackingModal
                open={trackingOpen}
                onClose={() => setTrackingOpen(false)}
                orderId={order.id}
              />
            </>
          )}

          {/* Pay now */}
          {order.payment_status === "PENDING" && order.payment_url && (
            <a
              href={order.payment_url}
              className="flex h-11 items-center justify-center rounded bg-[#ffcf02] px-10 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300]"
            >
              {t("payNow")}
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}
