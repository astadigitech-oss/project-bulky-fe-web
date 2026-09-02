"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Clock, Edit3, HelpCircle, Info, MapPin, Package, Phone, Plus, Search, ShieldCheck, ShieldOff, Star, Store, Tag, Trash2, Truck, UserRound, Users, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useProtectRoute } from "@/providers/session-provider";
import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query/use-mutate";
import { useSearch } from "@/hooks/use-serach";
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
  ApplyVoucherBody,
  ApplyVoucherResponse,
  CheckShippingCostBody,
  CheckShippingCostResponse,
  DisclaimerData,
  GetCheckoutResponse,
  GetDisclaimerResponse,
  GetPaymentMethodsResponse,
  GetPickupInfoResponse,
  PickupInfoData,
  PaymentGroup,
  PaymentType,
  PlaceOrderBody,
  PlaceOrderResponse,
  SearchFriendResponse,
  ShippingCostData,
  SplitPaymentFriend,
  VoucherData,
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
      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs leading-relaxed text-gray-700 opacity-0 shadow-lg transition-opacity group-hover/tooltip:opacity-100">
        {content}
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
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
  leadTime,
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
  leadTime?: number;
  insurance?: { available: boolean; label: string; cost?: string };
  tooltip?: string;
  unavailable: boolean;
  selected: boolean;
  onSelect: (id: DeliveryProvider) => void;
}) {
  const t = useTranslations("CheckoutPage");

  return (
    <button
      type="button"
      disabled={unavailable}
      onClick={() => onSelect(id)}
      className={[
        "flex w-full items-center gap-3 rounded border px-4 py-3 text-left transition-colors",
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
          "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
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
        {!unavailable && leadTime !== undefined && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="size-3 text-gray-500" />
            <span>
              {leadTime === 0
                ? t("leadTimeSameDay")
                : t("leadTimeDays", { days: String(leadTime) })}
            </span>
          </div>
        )}
        {insurance && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            {insurance.available ? (
              <ShieldCheck className="size-3 text-green-600" />
            ) : (
              <ShieldOff className="size-3 text-gray-500" />
            )}
            <span>{insurance.label}</span>
            {insurance.available && insurance.cost && (
              <span className="text-gray-500">({insurance.cost})</span>
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
        <DialogContent className="max-h-[90vh] max-w-lg lg:max-w-2xl overflow-y-auto">
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

// ─── Friend Search Dialog (Patungan) ───────────────────────────────────────────

function FriendSearchDialog({
  open,
  onOpenChange,
  addedIds,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addedIds: string[];
  onAdd: (friend: SplitPaymentFriend) => void;
}) {
  const t = useTranslations("CheckoutPage");
  const { search, searchValue, setSearch } = useSearch();

  useEffect(() => {
    if (open) setSearch("");
  }, [open, setSearch]);

  const trimmed = searchValue.trim();

  const friendsQuery = useApiQuery<SearchFriendResponse>({
    key: ["checkout-friends-search", trimmed],
    endpoint: "/checkout/friends/search",
    searchParams: { phone: trimmed },
    enabled: open && trimmed.length >= 4,
  });

  const results = friendsQuery.data?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("searchFriendTitle")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchFriendPlaceholder")}
              className="h-10 w-full rounded border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-[#01798A] focus:ring-1 focus:ring-[#01798A]"
              autoFocus
            />
          </div>

          {search.trim().length > 0 && search.trim().length < 4 ? (
            <p className="py-6 text-center text-sm text-gray-400">{t("searchFriendMinChars")}</p>
          ) : friendsQuery.isFetching ? (
            <div className="flex items-center justify-center gap-2 py-6">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ffcf02] border-t-black" />
              <span className="text-sm text-gray-600">{t("searchFriendLoading")}</span>
            </div>
          ) : trimmed.length >= 4 && results.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">{t("searchFriendEmpty")}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {results.map((friend) => {
                const isAdded = addedIds.includes(friend.buyer_id);
                return (
                  <div
                    key={friend.buyer_id}
                    className="flex items-center gap-3 rounded border border-gray-200 bg-white px-3 py-2.5"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <UserRound className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-black">{friend.nama}</p>
                      <p className="text-xs text-gray-500">{friend.telepon}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      disabled={isAdded}
                      onClick={() => onAdd(friend)}
                      className="h-8 shrink-0 bg-[#ffcf02] px-3 text-xs font-bold text-black shadow-none hover:bg-[#f0c300] disabled:opacity-50"
                    >
                      {isAdded ? t("searchFriendAlreadyAdded") : t("searchFriendAdd")}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-2 h-9 w-full text-sm shadow-none"
          onClick={() => onOpenChange(false)}
        >
          {t("searchFriendDone")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── Pickup Info Card ─────────────────────────────────────────────────────────

const DAY_NAMES_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function PickupInfoCard({
  data,
  isLoading,
  isError,
  locale,
}: {
  data: PickupInfoData | undefined;
  isLoading: boolean;
  isError: boolean;
  locale: string;
}) {
  const t = useTranslations("CheckoutPage");
  const dayNames = locale === "en" ? DAY_NAMES_EN : DAY_NAMES_ID;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded border border-green-200 bg-green-50 px-4 py-3">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        <span className="text-sm text-green-900">{t("pickupLoadingInfo")}</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center gap-3 rounded border border-green-200 bg-green-50 px-4 py-3">
        <Package className="size-5 shrink-0 text-green-700" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-900">{t("pickupWarehouseInfo")}</p>
          <p className="text-xs text-green-800">{t("pickupWarehouseDesc")}</p>
        </div>
        <span className="shrink-0 text-sm font-bold text-green-900">{t("shippingFree")}</span>
      </div>
    );
  }

  const sortedSchedule = [...data.jadwal].sort((a, b) => Number(a.hari) - Number(b.hari));

  return (
    <div className="flex flex-col gap-3 rounded border border-green-200 bg-green-50 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Package className="size-5 shrink-0 text-green-600" />
          <p className="text-sm font-semibold text-green-900">{data.nama}</p>
        </div>
        <span className="shrink-0 rounded bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
          {t("shippingFree")}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-green-900">{t("pickupWarehouseDesc")}</p>

      {/* Info + Schedule grid */}
      <div className="mt-1 grid grid-cols-1 gap-4 border-t border-green-200 pt-4 sm:grid-cols-2">

        {/* Left: address & phone */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start gap-2 text-sm text-green-900">
            <MapPin className="mt-0.5 size-4 shrink-0 text-green-700" />
            <span>{data.alamat}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-900">
            <Phone className="size-4 shrink-0 text-green-700" />
            <span>{data.telepon}</span>
          </div>
        </div>

        {/* Right: schedule */}
        {sortedSchedule.length > 0 && (
          <div className="flex flex-col gap-0">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="size-4 text-green-700" />
              <span className="text-sm font-semibold text-green-900">{t("pickupScheduleTitle")}</span>
            </div>
            <div className="flex flex-col divide-y divide-green-200">
              {sortedSchedule.map((d) => (
                <div key={d.hari} className="flex items-center justify-between py-1.5 text-sm">
                  <span className="w-20 font-medium text-green-900">{dayNames[Number(d.hari)]}</span>
                  {d.is_buka && d.jam_buka && d.jam_tutup ? (
                    <span className="flex items-center gap-1 text-green-900">
                      <Clock className="size-3.5 text-green-700" />
                      {d.jam_buka} – {d.jam_tutup}
                    </span>
                  ) : (
                    <span className="flex-1" />
                  )}
                  <span
                    className={[
                      "flex w-20 shrink-0 items-center justify-center gap-1.5 rounded-full py-1 text-xs font-bold",
                      d.is_buka
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white",
                    ].join(" ")}
                  >
                    <Store className="size-3.5" />
                    {d.is_buka ? t("pickupStatusOpen") : t("pickupStatusClosed")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Payment Logo ──────────────────────────────────────────────────────────────

export const LOGO_EXT: Record<string, string> = {
  gopay: "png",
};

export const LOGO_COLORS: Record<string, string> = {
  bca: "bg-blue-600",
  mandiri: "bg-yellow-500",
  bni: "bg-orange-600",
  bri: "bg-blue-800",
  permata: "bg-red-600",
  cimb: "bg-red-700",
  bsi: "bg-green-700",
  bjb: "bg-blue-700",
  gopay: "bg-green-500",
  ovo: "bg-purple-600",
  dana: "bg-blue-500",
  linkaja: "bg-red-500",
  shopeepay: "bg-orange-500",
  akulaku: "bg-blue-400",
  "credit-card": "bg-gray-700",
  qris: "bg-red-600",
};

export function PaymentLogo({ logoValue, nama }: { logoValue: string; nama: string }) {
  const [imgError, setImgError] = React.useState(false);
  const colorClass = LOGO_COLORS[logoValue] ?? "bg-gray-500";
  const initials = nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (!imgError) {
    return (
      <Image
        src={`/assets/images/payment/${logoValue}.${LOGO_EXT[logoValue] ?? "svg"}`}
        alt={nama}
        width={56}
        height={32}
        className="h-8 w-14 object-contain"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span
      className={[
        "flex h-8 w-14 shrink-0 items-center justify-center rounded text-xs font-bold text-white",
        colorClass,
      ].join(" ")}
    >
      {initials}
    </span>
  );
}

// ─── Payment Method Selector ───────────────────────────────────────────────────

export function PaymentMethodSelector({
  groups,
  isLoading,
  isError,
  selectedKode,
  onSelect,
  qrisDisabled,
}: {
  groups: PaymentGroup[];
  isLoading: boolean;
  isError: boolean;
  selectedKode: string | null;
  onSelect: (kode: string) => void;
  qrisDisabled?: boolean;
}) {
  const t = useTranslations("CheckoutPage");
  const [activeGroupUrutan, setActiveGroupUrutan] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (groups.length > 0 && activeGroupUrutan === null) {
      setActiveGroupUrutan(groups[0].urutan);
    }
  }, [groups, activeGroupUrutan]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded border border-gray-200 bg-white px-4 py-3">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ffcf02] border-t-black" />
        <span className="text-sm text-gray-600">{t("paymentMethodLoading")}</span>
      </div>
    );
  }

  if (isError || groups.length === 0) {
    return (
      <p className="text-sm text-red-500">{t("paymentMethodError")}</p>
    );
  }

  const activeGroup = groups.find((g) => g.urutan === activeGroupUrutan) ?? groups[0];
  const selectedChannel = groups
    .flatMap((g) => g.metode)
    .find((c) => c.kode === selectedKode);

  return (
    <div className="flex flex-col gap-3">
      {/* Selected summary — shown when a method is picked */}
      {selectedChannel && (
        <div className="flex items-center gap-4 rounded border border-[#01798A] bg-[#f0fafb] px-4 py-3">
          <div className="flex h-10 w-16 shrink-0 items-center justify-center">
            <PaymentLogo logoValue={selectedChannel.logo_value} nama={selectedChannel.nama} />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-xs font-medium text-[#01798A]">{t("paymentMethodSelected")}</span>
            <span className="text-base font-semibold text-black">{selectedChannel.nama}</span>
          </div>
        </div>
      )}

      {/* Group tabs */}
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <button
            key={group.urutan}
            type="button"
            onClick={() => setActiveGroupUrutan(group.urutan)}
            className={[
              "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              activeGroupUrutan === group.urutan
                ? "border-[#ffcf02] bg-[#ffcf02] text-black"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400",
            ].join(" ")}
          >
            {group.nama}
          </button>
        ))}
      </div>

      {/* Channel grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {activeGroup.metode
          .slice()
          .sort((a, b) => a.urutan - b.urutan)
          .map((channel) => {
            const isSelected = selectedKode === channel.kode;
            const isQrisLimitExceeded = channel.logo_value === "qris" && !!qrisDisabled;
            const isUnavailable = !channel.is_active || isQrisLimitExceeded;

            return (
              <button
                key={channel.id}
                type="button"
                disabled={isUnavailable}
                onClick={() => onSelect(channel.kode)}
                className={[
                  "relative flex flex-col items-center justify-center gap-1.5 rounded border px-2 py-3 text-center transition-colors",
                  isUnavailable
                    ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-40"
                    : isSelected
                      ? "border-[#01798A] bg-[#f0fafb]"
                      : "border-gray-200 bg-white hover:border-[#01798A]",
                ].join(" ")}
              >
                {isSelected && (
                  <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-[#01798A]">
                    <svg viewBox="0 0 10 8" className="size-2.5 fill-none stroke-white stroke-2">
                      <polyline points="1,4 4,7 9,1" />
                    </svg>
                  </span>
                )}
                <PaymentLogo logoValue={channel.logo_value} nama={channel.nama} />
                <span className={[
                  "text-xs font-medium leading-tight",
                  isSelected ? "text-[#01798A]" : "text-gray-700",
                ].join(" ")}>
                  {channel.nama}
                </span>
                {isQrisLimitExceeded
                  ? <span className="text-[10px] text-gray-400">{t("paymentMethodQrisLimit")}</span>
                  : isUnavailable && (
                    <span className="text-[10px] text-gray-400">{t("paymentMethodUnavailable")}</span>
                  )}
              </button>
            );
          })}
      </div>
    </div>
  );
}

// ─── Disclaimer Consent Dialog ────────────────────────────────────────────────

function DisclaimerConsentDialog({
  open,
  onOpenChange,
  onAgree,
  disclaimer,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree: () => void;
  disclaimer: DisclaimerData | null;
  isLoading: boolean;
}) {
  const t = useTranslations("CheckoutPage");
  const [checked, setChecked] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  // Reset checkbox setiap kali dialog dibuka
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setChecked(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-5 text-[#01798A]" />
            {isLoading ? t("disclaimerTitle") : (disclaimer?.judul ?? t("disclaimerTitle"))}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Konten HTML dari API */}
          <div className="flex-1 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#ffcf02] border-t-black" />
              </div>
            ) : disclaimer?.konten ? (
              <div
                className="prose prose-sm max-w-none text-gray-700 [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_ul]:pl-4 [&_li]:mb-1 [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: disclaimer.konten }}
              />
            ) : (
              <p className="text-sm text-gray-500">{t("disclaimerLoadError")}</p>
            )}
          </div>

          {/* Checkbox persetujuan */}
          <button
            type="button"
            onClick={() => setChecked((v) => !v)}
            className="flex items-start gap-3 rounded border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-[#01798A] hover:bg-[#f0fafb]"
          >
            <span
              className={[
                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
                checked ? "border-[#01798A] bg-[#01798A]" : "border-gray-300",
              ].join(" ")}
            >
              {checked && (
                <svg viewBox="0 0 10 8" className="size-2.5 fill-none stroke-white stroke-2">
                  <polyline points="1,4 4,7 9,1" />
                </svg>
              )}
            </span>
            <span className="text-sm text-gray-700">{t("disclaimerCheckboxLabel")}</span>
          </button>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-10 text-sm shadow-none"
            onClick={() => onOpenChange(false)}
          >
            {t("disclaimerCancel")}
          </Button>
          <Button
            type="button"
            disabled={!checked || isLoading || !disclaimer}
            className="flex-1 h-10 bg-[#ffcf02] hover:bg-[#f0c300] text-black font-bold text-sm shadow-none disabled:opacity-50"
            onClick={onAgree}
          >
            {t("disclaimerAgree")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export const CheckoutClient = ({ productSlug }: { productSlug?: string }) => {
  const t = useTranslations("CheckoutPage");
  const { isLoading: sessionLoading } = useProtectRoute();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale === "en" ? "en" : "id";
  const router = useRouter();

  const [notes, setNotes] = useState("");
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<DeliveryProvider | null>(null);
  const [shippingCost, setShippingCost] = useState<ShippingCostData | null>(null);
  const [voucherInputOpen, setVoucherInputOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherData | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [selectedPaymentKode, setSelectedPaymentKode] = useState<string | null>(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>("single_payment");
  const [splitFriends, setSplitFriends] = useState<SplitPaymentFriend[]>([]);
  const [friendSearchOpen, setFriendSearchOpen] = useState(false);
  const queryClient = useQueryClient();

  // ─── Query ──────────────────────────────────────────────────────────────────

  const checkoutQuery = useApiQuery<GetCheckoutResponse>({
    key: ["checkout", productSlug ?? "cart"],
    endpoint: "/checkout/summary",
    searchParams: { locale, ...(productSlug ? { slug: productSlug } : {}) },
    enabled: !sessionLoading,
  });

  const pickupInfoQuery = useApiQuery<GetPickupInfoResponse>({
    key: ["pickup-info"],
    endpoint: "/checkout/pickup-info",
    enabled: !sessionLoading && deliveryMode === "PICKUP",
  });

  const paymentMethodsQuery = useApiQuery<GetPaymentMethodsResponse>({
    key: ["payment-methods"],
    endpoint: "/checkout/payment-methods",
    enabled: !sessionLoading,
  });

  const disclaimerQuery = useApiQuery<GetDisclaimerResponse>({
    key: ["checkout-disclaimer"],
    endpoint: "/checkout/disclaimer",
    searchParams: { locale },
    enabled: !sessionLoading,
  });

  const disclaimerData = disclaimerQuery.data?.data ?? null;

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const placeOrder = useMutate<PlaceOrderResponse, PlaceOrderBody>({
    endpoint: "/place-order",
    method: "post",
    onSuccess: (res) => {
      const orderData = res.data?.data;
      if (paymentType === "split_payment" && orderData?.kode) {
        router.push(`/checkout/split/${orderData.kode}`);
        return;
      }
      if (orderData?.payment_url) {
        window.location.href = orderData.payment_url;
      } else {
        router.push("/profile");
      }
    },
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

  const applyVoucher = useMutate<ApplyVoucherResponse, ApplyVoucherBody, undefined, { locale: string }>({
    endpoint: "/checkout/voucher",
    method: "post",
    onSuccess: (res) => {
      setAppliedVoucher(res.data?.data ?? null);
      setVoucherError(null);
      setVoucherInputOpen(false);
      setVoucherCode("");
    },
    errorCustom: () => {
      setVoucherError(t("voucherErrorDefault"));
    },
  });

  // ─── Derived data ────────────────────────────────────────────────────────────

  const data = checkoutQuery.data?.data;
  const items = data?.items ?? [];
  const address = data?.alamat_default ?? null;

  const selectedProviderCost =
    deliveryMode === "DELIVERY" && selectedProvider && shippingCost
      ? shippingCost[selectedProvider].biaya_pengiriman
      : 0;

  const insuranceCost =
    insuranceSelected && selectedProvider === "FORWARDER" && shippingCost?.FORWARDER?.asuransi.tersedia
      ? shippingCost.FORWARDER.asuransi.premi
      : 0;

  const voucherDiscount = appliedVoucher?.nilai_potongan ?? 0;

  const totalAmount = data
    ? Math.max(0, data.biaya_produk + data.biaya_ppn + selectedProviderCost + insuranceCost - voucherDiscount)
    : 0;

  const totalPayment = data
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(totalAmount)
    : "Rp 0";

  const isQrisDisabled = totalAmount > 10_000_000;
  const paymentChannels = (paymentMethodsQuery.data?.data ?? []).flatMap(
    (group) => group.metode,
  );
  const selectedPaymentChannel = paymentChannels.find(
    (channel) => channel.kode === selectedPaymentKode,
  );
  const effectivePaymentKode =
    isQrisDisabled && selectedPaymentChannel?.logo_value === "qris"
      ? null
      : selectedPaymentKode;

  // ─── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (deliveryMode === "DELIVERY" && address?.id) {
      checkShipping.mutate({ body: { alamat_buyer_id: address.id, ...(productSlug ? { slug: productSlug } : {}) } });
    }
  }, [deliveryMode, address?.id]);

  const handleDeliveryModeChange = (mode: DeliveryMode) => {
    setDeliveryMode(mode);
    setShippingCost(null);
    setSelectedProvider(null);
    setInsuranceSelected(false);
  };

  const handleProviderSelect = (provider: DeliveryProvider) => {
    setSelectedProvider(provider);
    setInsuranceSelected(false);
  };

  const handleAddressChanged = () => {
    setShippingCost(null);
    setSelectedProvider(null);
    setInsuranceSelected(false);
    void queryClient.invalidateQueries({ queryKey: ["checkout"] });
  };

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const executePlaceOrder = () => {
    if (!deliveryMode) {
      toast.error(t("deliveryModeRequired"));
      return;
    }
    if (deliveryMode === "DELIVERY" && !selectedProvider) {
      toast.error(t("deliveryProviderRequired"));
      return;
    }
    if (deliveryMode === "DELIVERY" && !address) {
      toast.error(t("deliveryAddressRequired"));
      return;
    }
    if (deliveryMode === "DELIVERY" && !shippingCost) {
      toast.error(t("deliveryShippingCostRequired"));
      return;
    }
    if (paymentType === "single_payment" && !effectivePaymentKode) {
      toast.error(t("paymentMethodRequired"));
      return;
    }
    if (paymentType === "split_payment" && splitFriends.length === 0) {
      toast.error(t("splitFriendsRequired"));
      return;
    }

    const deliveryType: "PICKUP" | "DELIVEREE" | "FORWARDER" =
      deliveryMode === "PICKUP" ? "PICKUP" : selectedProvider!;

    const selectedChannel = paymentChannels.find(
      (channel) => channel.kode === effectivePaymentKode,
    );

    const successReturnUrl = `${window.location.origin}/${locale}/profile/orders?payment_success=1`;

    placeOrder.mutate({
      body: {
        delivery_type: deliveryType,
        biaya_pengiriman:
          deliveryMode === "PICKUP"
            ? 0
            : (shippingCost?.[deliveryType]?.biaya_pengiriman ?? 0),
        ...(deliveryMode !== "PICKUP" && address?.id
          ? { alamat_buyer_id: address.id }
          : {}),
        ...(insuranceSelected && shippingCost?.FORWARDER?.asuransi.tersedia
          ? { with_insurance: true, insurance_premi: shippingCost.FORWARDER.asuransi.premi }
          : {}),
        ...(selectedChannel
          ? { metode_pembayaran_id: selectedChannel.id, metode_pembayaran_kode: selectedChannel.kode }
          : {}),
        ...(notes.trim() ? { catatan: notes.trim() } : {}),
        ...(appliedVoucher ? { kupon_kode: appliedVoucher.kode } : {}),
        ...(productSlug ? { slug: productSlug } : {}),
        success_return_url: successReturnUrl,
        disclaimer_id: disclaimerData!.id,
        disclaimer_agreed: true,
        payment_type: paymentType,
        ...(paymentType === "split_payment"
          ? { friend_ids: splitFriends.map((f) => f.buyer_id) }
          : {}),
      },
    });
  };

  const handlePlaceOrder = () => {
    if (!disclaimerAgreed) {
      setDisclaimerOpen(true);
      return;
    }
    executePlaceOrder();
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
                onClick={() => handleDeliveryModeChange("PICKUP")}
                className={[
                  "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                  deliveryMode === "PICKUP"
                    ? "bg-[#ffcf02] text-black"
                    : "bg-white text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                <Package className="size-4" />
                {t("modePickup")}
              </button>
              <div className="w-px bg-gray-200" />
              <button
                type="button"
                onClick={() => handleDeliveryModeChange("DELIVERY")}
                className={[
                  "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                  deliveryMode === "DELIVERY"
                    ? "bg-[#ffcf02] text-black"
                    : "bg-white text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                <Truck className="size-4" />
                {t("modeDelivery")}
              </button>
            </div>

            {/* Pickup info */}
            {deliveryMode === "PICKUP" && (
              <PickupInfoCard
                data={pickupInfoQuery.data?.data}
                isLoading={pickupInfoQuery.isLoading}
                isError={pickupInfoQuery.isError}
                locale={locale}
              />
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
                    <p className="text-xs text-gray-500">
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
                    <span className="text-sm text-gray-600">{t("shippingLoading")}</span>
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
                      leadTime={deliveree?.tersedia ? deliveree.lead_time : undefined}
                      tooltip={t("delivereeTooltip")}
                      unavailable={!deliveree?.tersedia}
                      selected={selectedProvider === "DELIVEREE"}
                      onSelect={handleProviderSelect}
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
                      leadTime={forwarder?.tersedia ? forwarder.lead_time : undefined}
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
                      onSelect={handleProviderSelect}
                    />
                    {/* Insurance opt-in */}
                    {selectedProvider === "FORWARDER" && forwarder?.asuransi.tersedia && (
                      <button
                        type="button"
                        onClick={() => setInsuranceSelected((v) => !v)}
                        className={[
                          "flex w-full items-center gap-3 rounded border px-4 py-3 text-left transition-colors",
                          insuranceSelected
                            ? "border-[#01798A] bg-[#f0fafb]"
                            : "border-gray-200 bg-white hover:border-[#01798A]",
                        ].join(" ")}
                      >
                        {/* Checkbox */}
                        <span
                          className={[
                            "flex size-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
                            insuranceSelected ? "border-[#01798A] bg-[#01798A]" : "border-gray-300",
                          ].join(" ")}
                        >
                          {insuranceSelected && (
                            <svg viewBox="0 0 10 8" className="size-2.5 fill-none stroke-white stroke-2">
                              <polyline points="1,4 4,7 9,1" />
                            </svg>
                          )}
                        </span>
                        <ShieldCheck className={["size-5 shrink-0", insuranceSelected ? "text-[#01798A]" : "text-gray-400"].join(" ")} />
                        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                          <span className="text-sm font-semibold text-black">{t("insuranceOptIn")}</span>
                          <span className="text-xs text-gray-600">{t("insuranceOptInDesc")}</span>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-black">
                          +{forwarder.asuransi.premi_formatted}
                        </span>
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </section>

          {/* Tipe Pembayaran */}
          <section className="flex flex-col gap-3">
            <SectionTitle>{t("paymentTypeTitle")}</SectionTitle>

            <div className="flex overflow-hidden rounded border border-gray-200">
              <button
                type="button"
                onClick={() => setPaymentType("single_payment")}
                className={[
                  "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                  paymentType === "single_payment"
                    ? "bg-[#ffcf02] text-black"
                    : "bg-white text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                <UserRound className="size-4" />
                {t("paymentTypeSelf")}
              </button>
              <div className="w-px bg-gray-200" />
              <button
                type="button"
                onClick={() => setPaymentType("split_payment")}
                className={[
                  "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                  paymentType === "split_payment"
                    ? "bg-[#ffcf02] text-black"
                    : "bg-white text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                <Users className="size-4" />
                {t("paymentTypeSplit")}
              </button>
            </div>

            {paymentType === "split_payment" && (
              <div className="flex flex-col gap-2 rounded border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-black">{t("splitFriendsLabel")}</span>
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 gap-1.5 bg-[#ffcf02] px-3 text-xs font-bold text-black shadow-none hover:bg-[#f0c300]"
                    onClick={() => setFriendSearchOpen(true)}
                  >
                    <Search className="size-3.5" /> {t("splitAddFriend")}
                  </Button>
                </div>

                {splitFriends.length === 0 ? (
                  <p className="text-sm text-gray-400">{t("splitFriendsEmpty")}</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {splitFriends.map((friend) => (
                      <div
                        key={friend.buyer_id}
                        className="flex items-center gap-3 rounded border border-gray-200 bg-gray-50 px-3 py-2"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500">
                          <UserRound className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-black">{friend.nama}</p>
                          <p className="text-xs text-gray-500">{friend.telepon}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setSplitFriends((prev) => prev.filter((f) => f.buyer_id !== friend.buyer_id))
                          }
                          className="shrink-0 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                          aria-label={t("splitFriendRemove")}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Pilih Cara Bayar */}
          <section className="flex flex-col gap-3">
            <SectionTitle>{t("paymentMethod")}</SectionTitle>
            {paymentType === "single_payment" ? (
              <PaymentMethodSelector
                groups={paymentMethodsQuery.data?.data ?? []}
                isLoading={paymentMethodsQuery.isLoading}
                isError={paymentMethodsQuery.isError}
                selectedKode={effectivePaymentKode}
                onSelect={setSelectedPaymentKode}
                qrisDisabled={isQrisDisabled}
              />
            ) : (
              <div className="flex items-start gap-3 rounded border border-[#01798A]/30 bg-[#f0fafb] px-4 py-3">
                <Info className="mt-0.5 size-4 shrink-0 text-[#01798A]" />
                <span className="text-sm text-[#01798A]">{t("paymentMethodSplitInfo")}</span>
              </div>
            )}
          </section>

          {/* Voucher */}
          <section className="flex flex-col gap-3">
            <SectionTitle>{t("voucher")}</SectionTitle>

            {appliedVoucher ? (
              /* Applied voucher card */
              <div className="flex items-start gap-3 rounded border border-green-200 bg-green-50 px-4 py-3">
                <Tag className="mt-0.5 size-4 shrink-0 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-800">
                    {appliedVoucher.kode}
                    {" "}
                    <span className="font-normal text-green-700">— {appliedVoucher.nama}</span>
                  </p>
                  <p className="text-xs text-green-600">
                    {appliedVoucher.jenis_diskon === "persentase"
                      ? `${appliedVoucher.nilai_diskon}% off`
                      : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(appliedVoucher.nilai_diskon) + " off"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setAppliedVoucher(null); setVoucherError(null); }}
                  className="shrink-0 rounded p-0.5 text-green-600 hover:bg-green-100"
                  aria-label={t("voucherRemove")}
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : voucherInputOpen ? (
              /* Input row */
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => { setVoucherCode(e.target.value.toUpperCase()); setVoucherError(null); }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && voucherCode.trim()) {
                        applyVoucher.mutate({ body: { kode: voucherCode.trim() }, searchParams: { locale } });
                      }
                    }}
                    placeholder={t("voucherPlaceholder")}
                    className="h-10 flex-1 rounded border border-gray-200 bg-white px-3 text-sm uppercase tracking-wider outline-none transition-colors focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02]"
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={!voucherCode.trim() || applyVoucher.isPending}
                    onClick={() => applyVoucher.mutate({ body: { kode: voucherCode.trim() }, searchParams: { locale } })}
                    className="h-10 bg-[#ffcf02] px-4 text-xs font-bold text-black shadow-none hover:bg-[#f0c300] disabled:opacity-50"
                  >
                    {applyVoucher.isPending ? t("voucherApplying") : t("voucherApply")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => { setVoucherInputOpen(false); setVoucherCode(""); setVoucherError(null); }}
                    className="h-10 px-3 text-xs shadow-none"
                  >
                    {t("voucherCancel")}
                  </Button>
                </div>
                {voucherError && (
                  <p className="text-xs text-red-500">{voucherError}</p>
                )}
              </div>
            ) : (
              /* Empty state */
              <div className="flex items-center gap-3 rounded border border-gray-200 bg-white px-4 py-3">
                <Tag className="size-5 shrink-0 text-gray-400" />
                <span className="flex-1 text-sm text-gray-400">{t("noVoucher")}</span>
                <button
                  type="button"
                  onClick={() => setVoucherInputOpen(true)}
                  className="shrink-0 text-sm text-[#01798A] hover:underline"
                >
                  {t("chooseVoucher")}
                </button>
              </div>
            )}
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
            {insuranceSelected && shippingCost?.FORWARDER?.asuransi.tersedia && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <ShieldCheck className="size-3.5 text-[#01798A]" />
                  {t("insuranceSummaryLabel")}
                </span>
                <span className="font-semibold text-black">
                  +{shippingCost.FORWARDER.asuransi.premi_formatted}
                </span>
              </div>
            )}
            {appliedVoucher && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">{t("voucherDiscount")} ({appliedVoucher.kode})</span>
                <span className="font-semibold text-green-600">
                  -{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(appliedVoucher.nilai_potongan)}
                </span>
              </div>
            )}
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
        onChanged={handleAddressChanged}
      />

      <FriendSearchDialog
        open={friendSearchOpen}
        onOpenChange={setFriendSearchOpen}
        addedIds={splitFriends.map((f) => f.buyer_id)}
        onAdd={(friend) => setSplitFriends((prev) => [...prev, friend])}
      />

      {disclaimerOpen && (
        <DisclaimerConsentDialog
          open
          onOpenChange={setDisclaimerOpen}
          disclaimer={disclaimerData}
          isLoading={disclaimerQuery.isLoading}
          onAgree={() => {
            setDisclaimerAgreed(true);
            setDisclaimerOpen(false);
            executePlaceOrder();
          }}
        />
      )}

    </div>
  );
};
