"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMutate } from "@/lib/query/use-mutate";
import type { MarkDoneResponse, OrderDetailProduct } from "@/services/orders/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function formatTimestampWIB(timestamp: string | null | undefined, locale: string): string | null {
  if (!timestamp) return null;
  return new Date(timestamp).toLocaleString(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
}
import { Loader2, Package, Warehouse, Truck, CheckCircle2, MapPin, FileText, Store, Ship, Users } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useApiQuery } from "@/lib/query/use-query";
import type {
  GetOrderDetailResponse,
  OrderStepperStep,
  DeliveryType,
  OrderParticipant,
  PaymentStatus,
} from "@/services/orders/types";
import { PickupInfoModal } from "../orders/_components/pickup-info-modal";
import { TrackingModal } from "../orders/_components/tracking-modal";

// ─── Stepper ──────────────────────────────────────────────────────────────────

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
  const locale = useLocale();
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
            {step.timestamp && (
              <p className="mt-0.5 whitespace-pre-line text-xs text-[#727272]">
                {formatTimestampWIB(step.timestamp, locale)}
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
  FORWARDER_LCL: Ship,
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

// ─── Split payment participants ────────────────────────────────────────────────

const PARTICIPANT_STATUS_STYLE: Record<PaymentStatus, string> = {
  PAID: "bg-[#e8f5e9] text-[#2e7d32]",
  PARTIAL: "bg-[#fff8df] text-[#ff9900]",
  PENDING: "bg-[#f5f5f5] text-[#727272]",
  EXPIRED: "bg-[#fdecea] text-[#b3261e]",
};

function ParticipantStatusBadge({ status }: { status: PaymentStatus }) {
  const t = useTranslations("ProfilePages.orderDetail.participants.status");
  return (
    <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-semibold", PARTICIPANT_STATUS_STYLE[status])}>
      {t(status)}
    </span>
  );
}

function ParticipantRow({
  participant,
  orderCode,
  orderPayable,
  locale,
}: {
  participant: OrderParticipant;
  orderCode: string;
  orderPayable: boolean;
  locale: string;
}) {
  const t = useTranslations("ProfilePages.orderDetail.participants");
  const initial = participant.name.trim().charAt(0).toUpperCase() || "?";
  const canPay = orderPayable && participant.is_me && (participant.payment_status === "PENDING" || participant.payment_status === "PARTIAL");

  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-sm font-bold text-[#01798a]">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-black">
            {participant.name}
            {participant.is_me && <span className="text-[#727272] font-normal"> ({t("you")})</span>}
          </p>
          {participant.role === "OWNER" && (
            <span className="rounded-full border border-[#d9d9d9] px-2 py-0.5 text-[10px] font-semibold text-[#727272]">
              {t("owner")}
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-[#ff9900]">{participant.amount_formatted}</p>
        {participant.payment_status === "PAID" && participant.paid_at && (
          <p className="text-xs text-[#727272]">{t("paidAt")} {formatTimestampWIB(participant.paid_at, locale)}</p>
        )}
        {participant.payment_status === "EXPIRED" && participant.expired_at && (
          <p className="text-xs text-[#b3261e]">{t("expiredAt")} {formatTimestampWIB(participant.expired_at, locale)}</p>
        )}
      </div>
      <ParticipantStatusBadge status={participant.payment_status} />
      {canPay && (
        <Link
          href={`/checkout/split/${orderCode}`}
          className="flex h-9 shrink-0 items-center justify-center rounded bg-[#ffcf02] px-4 text-xs font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300]"
        >
          {t("payMyPart")}
        </Link>
      )}
    </div>
  );
}

function ParticipantsSection({
  participants,
  orderCode,
  orderPayable,
  locale,
}: {
  participants: OrderParticipant[];
  orderCode: string;
  orderPayable: boolean;
  locale: string;
}) {
  const t = useTranslations("ProfilePages.orderDetail.participants");

  return (
    <div className="rounded-xl border border-[#d9d9d9] p-5">
      <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-black">
        <Users className="size-4 text-[#01798a]" /> {t("title")}
      </p>
      <p className="mb-3 text-xs text-[#727272]">{t("subtitle")}</p>
      <div className="divide-y divide-[#d9d9d9]">
        {participants.map((participant, idx) => (
          <ParticipantRow
            key={`${participant.buyer_id}-${idx}`}
            participant={participant}
            orderCode={orderCode}
            orderPayable={orderPayable}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OrderDetail({ code, variant = "orders" }: { code: string; variant?: "orders" | "group-buy" }) {
  const t = useTranslations("ProfilePages.orderDetail");
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pickupOpen, setPickupOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const backHref = variant === "group-buy" ? "/profile/group-buy" : "/profile/orders";
  const backLabel = variant === "group-buy" ? t("backGroupBuy") : t("back");

  const { mutate: markDone, isPending: isMarkingDone } = useMutate<
    MarkDoneResponse,
    undefined,
    { id: string }
  >({
    endpoint: "/web/orders/:id/complete",
    method: "patch",
    onSuccess: async () => {
      setConfirmOpen(false);
      toast.success(t("markDoneSuccess"));
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["order-detail", code] });
      router.refresh();
    },
    errorCustom: (error) => {
      setConfirmOpen(false);
      const msg = (error.response?.data as any)?.message ?? t("markDoneError");
      toast.error(msg);
    },
  });

  const { data, isLoading, isError } = useApiQuery<GetOrderDetailResponse>({
    key: ["order-detail", code, locale],
    endpoint: `/web/orders/by-code/${code}`,
    searchParams: { locale },
  });

  const order = data?.data;

  // Split-payment orders live under Group Buy, regular orders under Orders.
  // If this order was reached through the wrong tab (old link, bookmark, etc.),
  // send the user to the route that actually owns this order type.
  useEffect(() => {
    if (!order) return;
    const belongsToGroupBuy = order.payment_type === "SPLIT";
    if (belongsToGroupBuy && variant !== "group-buy") {
      router.replace(`/profile/group-buy/${order.code}`);
    } else if (!belongsToGroupBuy && variant === "group-buy") {
      router.replace(`/profile/orders/${order.code}`);
    }
  }, [order, variant, router]);

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

  const isSplit = order.payment_type === "SPLIT";
  const needsRedirect = isSplit !== (variant === "group-buy");

  if (needsRedirect) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#ffcf02]" />
      </div>
    );
  }

  const myParticipant = order.participants?.find((p) => p.is_me);
  const canMarkDone = order.order_status === "SHIPPED" && (!isSplit || myParticipant?.role === "OWNER");
  const markDoneHiddenForMember = order.order_status === "SHIPPED" && isSplit && myParticipant?.role !== "OWNER";

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href={backHref}
        className="inline-flex items-center text-sm text-[#727272] hover:text-black"
      >
        ← {backLabel}
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#d9d9d9] pb-5">
        <div>
          <p className="text-xs text-[#727272]">{t("orderId")}</p>
          <p className="mt-0.5 text-base font-bold text-black">{order.code}</p>
          <p className="mt-1 text-xs text-[#727272]">
            {t("createdAt")}: {new Date(order.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
              day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DeliveryBadge type={order.delivery_type} />
          {isSplit && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#01798a] px-3 py-1 text-sm text-[#01798a]">
              <Users className="size-3.5" />
              {t("splitPaymentBadge")}
            </span>
          )}
          <span className="rounded-full bg-[#fff8df] px-3 py-1 text-sm font-semibold text-[#ff9900]">
            {order.delivery_type === "PICKUP" && (order.order_status === "READY" || order.order_status === "SHIPPED")
              ? t(`orderStatusPickup.${order.order_status}`)
              : t(`orderStatus.${order.order_status}`)}
          </span>
        </div>
      </div>

      {/* Expired notice */}
      {order.payment_status === "EXPIRED" && (
        <div className="rounded-lg bg-[#fdecea] px-4 py-3 text-sm text-[#b3261e]">
          {t("expiredNotice")} {order.expired_at && formatTimestampWIB(order.expired_at, locale)}
        </div>
      )}

      {/* Products */}
      <div className="rounded-xl border border-[#d9d9d9]">
        {order.products.map((product: OrderDetailProduct, idx: number) => (
          <div
            key={`${product.order_item_id}-${idx}`}
            className={cn("flex gap-4 p-4", idx > 0 && "border-t border-[#d9d9d9]")}
          >
            <div className="flex size-[100px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#d9d9d9] bg-[#efefef]">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="size-full object-cover"
                />
              ) : (
                <Package className="size-12 text-[#727272]" strokeWidth={1.4} />
              )}
            </div>
            <div className="flex flex-col justify-center gap-1">
              <p className="text-sm font-semibold text-black">{product.name}</p>
              {product.original_price > product.subtotal && (
                <p className="text-xs text-[#727272] line-through">
                  {product.original_price_formatted}
                </p>
              )}
              <p className="text-lg font-bold text-[#ff9900]">{product.subtotal_formatted}</p>
              <p className="flex items-center gap-1 text-xs text-[#01798a]">
                <Warehouse className="size-3.5" /> {t("palletType")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stepper */}
      <div className="rounded-xl border border-[#d9d9d9] p-5">
        <p className="mb-5 text-sm font-semibold text-black">{t("progress")}</p>
        <Stepper stepper={order.stepper} deliveryType={order.delivery_type} />
      </div>

      {/* Split payment participants */}
      {isSplit && order.participants.length > 0 && (
        <ParticipantsSection
          participants={order.participants}
          orderCode={order.code}
          orderPayable={order.order_status !== "CANCELLED" && order.payment_status !== "EXPIRED"}
          locale={locale}
        />
      )}

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
                    <p className="text-xs text-[#b0b0b0]">{formatTimestampWIB(item.timestamp, locale)}</p>
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
              <CostRow label={t("biaya.produk")} value={order.cost.product_cost_formatted} />
              <CostRow
                label={t("biaya.pengiriman")}
                value={order.cost.shipping_cost_formatted}
                muted={order.cost.shipping_cost === 0}
              />
              <CostRow
                label={t("biaya.ppn")}
                value={order.cost.tax_cost_formatted}
                muted={order.cost.tax_cost === 0}
              />
              {order.cost.other_cost > 0 && (
                <CostRow label={t("biaya.lainnya")} value={order.cost.other_cost_formatted} />
              )}
              <CostRow label={t("biaya.total")} value={order.cost.total_formatted} isTotal />
            </div>
          </div>

          {/* Notes */}
          {order.note && (
            <div className="rounded-xl border border-[#d9d9d9] p-5">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-black">
                <FileText className="size-4" /> {t("notes")}
              </p>
              <p className="text-sm text-[#727272]">{order.note}</p>
            </div>
          )}

          {/* Address */}
          {order.shipping_address && (
            <div className="rounded-xl border border-[#d9d9d9] p-5">
              <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-black">
                <MapPin className="size-4" /> {t("address")}
              </p>
              <p className="text-sm font-medium text-black">
                {order.shipping_address.recipient_name} &middot; {order.shipping_address.recipient_phone}
              </p>
              <p className="mt-1 text-sm text-[#727272]">
                {order.shipping_address.full_address}, {order.shipping_address.district},{" "}
                {order.shipping_address.city}, {order.shipping_address.province}{" "}
                {order.shipping_address.postal_code}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      {(order.payment_status === "PENDING" && order.payment_url) || order.order_status !== "CANCELLED" ? (
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#d9d9d9] pt-5">
          {markDoneHiddenForMember && (
            <p className="mr-auto text-xs text-[#727272]">{t("markDoneOwnerOnlyNote")}</p>
          )}

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
          {order.order_status === "SHIPPED" && (order.delivery_type === "DELIVEREE" || order.delivery_type === "FORWARDER" || order.delivery_type === "FORWARDER_LCL") && (
            <>
              <button
                type="button"
                onClick={() => setTrackingOpen(true)}
                className="flex h-11 items-center justify-center rounded px-8 text-sm font-bold text-[#ff9900] transition-colors hover:bg-[#fff8df]"
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

          {/* Mark Done */}
          {canMarkDone && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex h-11 items-center justify-center rounded bg-[#ffcf02] px-8 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300]"
            >
              {t("markDone")}
            </button>
          )}
        </div>
      ) : null}

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("markDoneConfirmTitle")}</DialogTitle>
            <DialogDescription className="pt-1">
              {t("markDoneConfirmDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              disabled={isMarkingDone}
              onClick={() => setConfirmOpen(false)}
              className="flex h-10 items-center justify-center rounded border border-[#d9d9d9] px-6 text-sm text-[#1d1d1d] transition-colors hover:border-[#727272] disabled:opacity-60"
            >
              {t("markDoneConfirmCancel")}
            </button>
            <button
              type="button"
              disabled={isMarkingDone}
              onClick={() => markDone({ params: { id: order.id } })}
              className="flex h-10 items-center justify-center rounded bg-[#ffcf02] px-6 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300] disabled:opacity-60"
            >
              {isMarkingDone ? t("markDoneLoading") : t("markDoneConfirmOk")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
