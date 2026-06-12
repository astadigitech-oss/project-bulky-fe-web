"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Edit3, HelpCircle, MapPin, Package, Plus, ShieldCheck, ShieldOff, Star, Tag, Trash2, Truck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useProtectRoute } from "@/providers/session-provider";
import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query/use-mutate";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressFormDialog } from "@/components/address-form-dialog";

import type {
  CheckShippingCostBody,
  CheckShippingCostResponse,
  GetCheckoutResponse,
  PlaceOrderBody,
  PlaceOrderResponse,
  ShippingCostData,
} from "@/services/checkout/types";
import type {
  Address,
  BaseProfileResponse,
  GetAddressesResponse,
} from "@/services/profile/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

type DeliveryMode = "PICKUP" | "DELIVERY";
type DeliveryProvider = "DELIVEREE" | "FORWARDER";

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-bold text-[#01798A]">{children}</p>;
}

// ─── Summary Row ───────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-black">{value}</span>
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function InfoTooltip({ content }: { content: string }) {
  return (
    <div className="relative inline-flex group/tooltip">
      <HelpCircle className="size-3.5 shrink-0 cursor-help text-gray-400 hover:text-gray-600" />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover/tooltip:opacity-100">
        {content}
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}

// ─── Provider Card ─────────────────────────────────────────────────────────────

function ProviderCard({
  id,
  logoSrc,
  logoAlt,
  name,
  cost,
  insurance,
  tooltip,
  unavailable,
  selected,
  onSelect,
}: {
  id: DeliveryProvider;
  logoSrc: string;
  logoAlt: string;
  name: string;
  cost: string;
  insurance?: { available: boolean; label: string; cost?: string };
  tooltip?: string;
  unavailable: boolean;
  selected: boolean;
  onSelect: (id: DeliveryProvider) => void;
}) {
  return (
    <button
      type="button"
      disabled={unavailable}
      onClick={() => onSelect(id)}
      className={[
        "flex w-full items-start gap-3 rounded border px-4 py-3 text-left transition-colors",
        unavailable
          ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-50"
          : selected
            ? "border-[#01798A] bg-[#f0fafb]"
            : "border-gray-200 bg-white hover:border-[#01798A]",
      ].join(" ")}
    >
      {/* Radio indicator */}
      <span
        className={[
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
          selected && !unavailable ? "border-[#01798A]" : "border-gray-300",
        ].join(" ")}
      >
        {selected && !unavailable && (
          <span className="size-2 rounded-full bg-[#01798A]" />
        )}
      </span>

      {/* Logo */}
      <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded">
        <Image src={logoSrc} alt={logoAlt} width={32} height={32} className="object-contain" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-black">{name}</span>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
        {insurance && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            {insurance.available ? (
              <ShieldCheck className="size-3 text-green-500" />
            ) : (
              <ShieldOff className="size-3 text-gray-400" />
            )}
            <span>{insurance.label}</span>
            {insurance.available && insurance.cost && (
              <span className="text-gray-400">({insurance.cost})</span>
            )}
          </div>
        )}
      </div>

      {/* Cost */}
      <span
        className={[
          "shrink-0 text-sm font-semibold",
          unavailable ? "text-gray-400" : "text-black",
        ].join(" ")}
      >
        {cost}
      </span>
    </button>
  );
}

// ─── Address Picker Dialog ─────────────────────────────────────────────────────

function AddressPickerDialog({
  open,
  onOpenChange,
  onChanged,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
}) {
  const t = useTranslations("Profile.edit");
  const [addOpen, setAddOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  const { data, isLoading, refetch } = useApiQuery<GetAddressesResponse>({
    key: ["addresses"],
    endpoint: "/addresses",
    enabled: open,
  });

  const addresses = data?.data ?? [];

  const setDefaultMutation = useMutate<BaseProfileResponse, undefined, { id: string }>({
    endpoint: "/addresses/:id/set-default",
    method: "patch",
    onSuccess: () => { refetch(); onChanged(); },
    onError: { title: "SET_DEFAULT_ADDRESS" },
  });

  const deleteMutation = useMutate<BaseProfileResponse, undefined, { id: string }>({
    endpoint: "/addresses/:id",
    method: "delete",
    onSuccess: () => { refetch(); onChanged(); },
    onError: { title: "DELETE_ADDRESS" },
  });

  const isMutating = setDefaultMutation.isPending || deleteMutation.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("addressSection")}</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#ffcf02] border-t-black" />
            </div>
          ) : addresses.length === 0 ? (
            <p className="text-sm text-[#727272]">{t("noAddress")}</p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="rounded-lg border border-[#e0e0e0] p-4">
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-black">
                        {addr.name}{" "}
                        {addr.is_default && (
                          <span className="ml-1 rounded bg-[#ffcf02] px-1.5 py-0.5 text-[10px] font-bold text-black">
                            {t("defaultBadge")}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-[#727272]">{addr.phone}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {!addr.is_default && (
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 gap-1 bg-[#ffcf02] px-3 text-xs font-bold text-black shadow-none hover:bg-[#f0c300]"
                          disabled={isMutating}
                          onClick={() => {
                            setDefaultMutation.mutate({ params: { id: addr.id } });
                            onOpenChange(false);
                          }}
                        >
                          <Star className="size-3" /> Pilih
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 gap-1 px-3 text-xs shadow-none hover:border-[#ffcf02] hover:bg-[#fff7cc]"
                        onClick={() => setEditAddress(addr)}
                      >
                        <Edit3 className="size-3" /> {t("editButton")}
                      </Button>
                      {!addr.is_default && (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-8 px-3 text-xs text-red-500 shadow-none hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                          disabled={isMutating}
                          onClick={() => deleteMutation.mutate({ params: { id: addr.id } })}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-black">{addr.formatted_address}</p>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="mt-2 h-9 w-full gap-1.5 border-dashed text-sm text-[#727272] shadow-none hover:border-[#ffcf02] hover:bg-[#fff7cc] hover:text-black"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="size-4" /> {t("addAddress")}
          </Button>
        </DialogContent>
      </Dialog>

      <AddressFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => { setAddOpen(false); refetch(); onChanged(); }}
      />
      <AddressFormDialog
        open={!!editAddress}
        onOpenChange={(val) => { if (!val) setEditAddress(null); }}
        addressId={editAddress?.id}
        onSuccess={() => { setEditAddress(null); refetch(); onChanged(); }}
      />
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export const CheckoutClient = () => {
  const t = useTranslations("CheckoutPage");
  const { isLoading: sessionLoading } = useProtectRoute();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale === "en" ? "en" : "id";

  const [notes, setNotes] = useState("");
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<DeliveryProvider | null>(null);
  const [shippingCost, setShippingCost] = useState<ShippingCostData | null>(null);
  const queryClient = useQueryClient();

  // ─── Query ──────────────────────────────────────────────────────────────────

  const checkoutQuery = useApiQuery<GetCheckoutResponse>({
    key: ["checkout"],
    endpoint: "/checkout/summary",
    searchParams: { locale },
    enabled: !sessionLoading,
  });

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const placeOrder = useMutate<PlaceOrderResponse, PlaceOrderBody>({
    endpoint: "/orders",
    method: "post",
    onError: { title: "PLACE_ORDER" },
  });

  const checkShipping = useMutate<CheckShippingCostResponse, CheckShippingCostBody>({
    endpoint: "/checkout/ongkir",
    method: "post",
    onSuccess: (res) => {
      setShippingCost(res.data?.data ?? null);
      setSelectedProvider(null);
    },
    onError: { title: "SHIPPING_COST" },
  });

  // ─── Derived data ────────────────────────────────────────────────────────────

  const data = checkoutQuery.data?.data;
  const items = data?.items ?? [];
  const address = data?.alamat_default ?? null;

  const selectedProviderCost =
    deliveryMode === "DELIVERY" && selectedProvider && shippingCost
      ? shippingCost[selectedProvider].biaya_pengiriman
      : 0;

  const totalPayment = data
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(data.biaya_produk + data.biaya_ppn + selectedProviderCost)
    : "Rp 0";

  // ─── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (deliveryMode === "DELIVERY" && address?.id) {
      setShippingCost(null);
      setSelectedProvider(null);
      checkShipping.mutate({ body: { alamat_buyer_id: address.id } });
    }
    if (deliveryMode === "PICKUP") {
      setShippingCost(null);
      setSelectedProvider(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryMode, address?.id]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handlePlaceOrder = () => {
    placeOrder.mutate({ body: { notes: notes.trim() || undefined } });
  };

  // ─── Render states ────────────────────────────────────────────────────────────

  if (sessionLoading || checkoutQuery.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffcf02] border-t-black" />
      </div>
    );
  }

  if (checkoutQuery.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {t("loadError")}
      </div>
    );
  }

  const forwarder = shippingCost?.FORWARDER;
  const deliveree = shippingCost?.DELIVEREE;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-black">{t("title")}</h1>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px] items-start">

        {/* ── Left column ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Produk Dipesan */}
          <section className="flex flex-col gap-3">
            <SectionTitle>{t("orderedProducts")}</SectionTitle>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.produk_id}
                  className="flex items-center gap-4 rounded border border-gray-200 bg-white p-4"
                >
                  <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <Image
                      src={item.gambar_url || "https://github.com/shadcn.png"}
                      alt={item.nama}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <p className="text-sm font-medium text-black line-clamp-2">
                      {item.nama}
                    </p>
                    <p className="text-base font-bold text-[#ffcf02]">
                      {item.harga_formatted}
                    </p>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="flex items-center gap-4 rounded border border-gray-200 bg-white p-4">
                  <div className="size-[72px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                    <div className="h-5 w-1/3 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Catatan */}
          <section className="flex flex-col gap-3">
            <SectionTitle>{t("notes")}</SectionTitle>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("notesPlaceholder")}
              className="min-h-[100px] resize-none rounded border border-gray-200 bg-white text-sm text-black placeholder:text-gray-400 focus-visible:ring-[#ffcf02]"
            />
          </section>

          {/* Metode Pengambilan */}
          <section className="flex flex-col gap-3">
            <SectionTitle>{t("pickupMethod")}</SectionTitle>

            {/* Toggle */}
            <div className="flex overflow-hidden rounded border border-gray-200">
              <button
                type="button"
                onClick={() => setDeliveryMode("PICKUP")}
                className={[
                  "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                  deliveryMode === "PICKUP"
                    ? "bg-[#01798A] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                <Package className="size-4" />
                {t("modePickup")}
              </button>
              <div className="w-px bg-gray-200" />
              <button
                type="button"
                onClick={() => setDeliveryMode("DELIVERY")}
                className={[
                  "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                  deliveryMode === "DELIVERY"
                    ? "bg-[#01798A] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                <Truck className="size-4" />
                {t("modeDelivery")}
              </button>
            </div>

            {/* Pickup info */}
            {deliveryMode === "PICKUP" && (
              <div className="flex items-center gap-3 rounded border border-green-200 bg-green-50 px-4 py-3">
                <Package className="size-5 shrink-0 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">{t("pickupWarehouseInfo")}</p>
                  <p className="text-xs text-green-600">{t("pickupWarehouseDesc")}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-green-700">{t("shippingFree")}</span>
              </div>
            )}

            {/* Delivery: address + providers */}
            {deliveryMode === "DELIVERY" && (
              <div className="flex flex-col gap-3">
                {/* Address card */}
                <div className="flex flex-col gap-2 rounded border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 shrink-0 text-[#ffcf02]" />
                    <span className="text-sm font-semibold text-black">
                      {address?.label ?? "—"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {address
                      ? `${address.nama_penerima} — ${address.alamat_lengkap}`
                      : "—"}
                  </p>
                  {address && (
                    <p className="text-xs text-gray-400">
                      {[address.kecamatan, address.kota, address.provinsi, address.kode_pos]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {!address && (
                    <p className="text-xs text-amber-600">{t("noAddressShipping")}</p>
                  )}
                  <div>
                    <Button
                      type="button"
                      size="sm"
                      className="h-8 bg-[#ffcf02] px-4 text-xs font-bold text-black shadow-none hover:bg-[#f0c300]"
                      onClick={() => setAddressPickerOpen(true)}
                    >
                      {t("changeAddress")}
                    </Button>
                  </div>
                </div>

                {/* Provider options */}
                {!address ? null : checkShipping.isPending ? (
                  <div className="flex items-center gap-2 rounded border border-gray-200 bg-white px-4 py-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ffcf02] border-t-black" />
                    <span className="text-sm text-gray-400">{t("shippingLoading")}</span>
                  </div>
                ) : checkShipping.isError ? (
                  <p className="text-sm text-red-500">{t("shippingError")}</p>
                ) : shippingCost ? (
                  <div className="flex flex-col gap-2">
                    <ProviderCard
                      id="DELIVEREE"
                      logoSrc="/assets/svgs/logo-deliveree.svg"
                      logoAlt="Deliveree"
                      name="Deliveree"
                      cost={
                        deliveree?.tersedia
                          ? deliveree.biaya_pengiriman_formatted
                          : t("shippingUnavailable")
                      }
                      tooltip={t("delivereeTooltip")}
                      unavailable={!deliveree?.tersedia}
                      selected={selectedProvider === "DELIVEREE"}
                      onSelect={setSelectedProvider}
                    />
                    <ProviderCard
                      id="FORWARDER"
                      logoSrc="/assets/svgs/logo-forwarder.svg"
                      logoAlt="Forwarder"
                      name="Forwarder"
                      cost={
                        forwarder?.tersedia
                          ? forwarder.biaya_pengiriman_formatted
                          : t("shippingUnavailable")
                      }
                      insurance={
                        forwarder?.tersedia
                          ? {
                              available: forwarder.asuransi.tersedia,
                              label: forwarder.asuransi.tersedia
                                ? t("insuranceAvailable")
                                : t("insuranceUnavailable"),
                              cost: forwarder.asuransi.tersedia
                                ? forwarder.asuransi.premi_formatted
                                : undefined,
                            }
                          : undefined
                      }
                      tooltip={t("forwarderTooltip")}
                      unavailable={!forwarder?.tersedia}
                      selected={selectedProvider === "FORWARDER"}
                      onSelect={setSelectedProvider}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </section>

          {/* Pilih Cara Bayar */}
          <section className="flex flex-col gap-3">
            <SectionTitle>{t("paymentMethod")}</SectionTitle>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded border border-gray-200 bg-white px-4 py-3">
                <span className="shrink-0 text-[#ffcf02]">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5 fill-[#ffcf02]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2V7zm0 4h20v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6zm3 3a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2H5z" />
                  </svg>
                </span>
                <span className="flex-1 text-sm font-medium text-black">{t("directPayment")}</span>
                <button
                  type="button"
                  className="shrink-0 text-sm text-[#01798A] hover:underline"
                >
                  {t("chooseOtherPayment")}
                </button>
              </div>
              {/* Payment method card – QRIS */}
              <div className="flex items-center gap-3 rounded border border-gray-200 bg-white px-4 py-3">
                <span className="flex h-8 items-center rounded bg-black px-2 text-xs font-black tracking-widest text-white">
                  QRIS
                </span>
                <span className="flex-1" />
                <button
                  type="button"
                  className="shrink-0 text-sm text-[#01798A] hover:underline"
                >
                  {t("choosePaymentMethod")}
                </button>
              </div>
            </div>
          </section>

          {/* Voucher */}
          <section className="flex flex-col gap-3">
            <SectionTitle>{t("voucher")}</SectionTitle>
            <div className="flex items-center gap-3 rounded border border-gray-200 bg-white px-4 py-3">
              <Tag className="size-5 shrink-0 text-gray-400" />
              <span className="flex-1 text-sm text-gray-400">{t("noVoucher")}</span>
              <button
                type="button"
                className="shrink-0 text-sm text-[#01798A] hover:underline"
              >
                {t("chooseVoucher")}
              </button>
            </div>
          </section>
        </div>

        {/* ── Right column — Rincian Pesanan ───────────────────────────────── */}
        <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
          <p className="font-bold text-base text-[#01798A]">{t("orderSummary")}</p>
          <Separator className="bg-gray-200" />

          <div className="flex flex-col gap-2.5">
            <SummaryRow
              label={t("totalProducts")}
              value={String(data?.total_item ?? 0)}
            />
            <SummaryRow
              label={t("totalOrder")}
              value={data?.biaya_produk_formatted ?? "Rp 0"}
            />
            <SummaryRow
              label={`${t("taxLabel")} ${data?.ppn_persentase ?? 0}%`}
              value={data?.biaya_ppn_formatted ?? "Rp 0"}
            />
            <SummaryRow
              label={t("shippingCost")}
              value={
                deliveryMode === "PICKUP"
                  ? t("shippingFree")
                  : checkShipping.isPending
                    ? "..."
                    : selectedProvider && shippingCost
                      ? shippingCost[selectedProvider].biaya_pengiriman_formatted
                      : "-"
              }
            />
          </div>

          <Separator className="bg-gray-200" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{t("totalPayment")}</span>
            <span className="text-xl font-bold text-orange-500">
              {totalPayment}
            </span>
          </div>

          <Button
            onClick={handlePlaceOrder}
            disabled={placeOrder.isPending}
            className="w-full bg-[#ffcf02] hover:bg-[#f0c300] text-black font-bold rounded-md h-10 shadow-none disabled:opacity-50"
          >
            {placeOrder.isPending ? t("placingOrder") : t("placeOrder")}
          </Button>
        </div>
      </div>

      <AddressPickerDialog
        open={addressPickerOpen}
        onOpenChange={setAddressPickerOpen}
        onChanged={() => queryClient.invalidateQueries({ queryKey: ["checkout"] })}
      />
    </div>
  );
};
