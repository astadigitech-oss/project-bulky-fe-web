"use client";

import { MapPin, Phone, Loader2, Copy, Check } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { useApiQuery } from "@/lib/query/use-query";
import type { GetPickupInfoResponse } from "@/services/orders/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DAY_NAMES_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDayName(hari: number | string, locale: string): string {
  const index = Number(hari);
  if (isNaN(index) || index < 0 || index > 6) return String(hari);
  return locale === "id" ? DAY_NAMES_ID[index] : DAY_NAMES_EN[index];
}

export function PickupInfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("ProfilePages.orders.pickupModal");
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const todayIndex = new Date().getDay(); // 0 = Sunday

  const { data, isLoading } = useApiQuery<GetPickupInfoResponse>({
    key: ["pickup-info"],
    endpoint: "/web/orders/pickup-info",
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  const info = data?.data;

  function handleCopyAddress() {
    if (!info?.alamat) return;
    navigator.clipboard.writeText(info.alamat).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-black">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-8 animate-spin text-[#ffcf02]" />
          </div>
        ) : info ? (
          <div className="space-y-4 pt-1">
            <p className="text-sm text-[#727272]">{t("description")}</p>

            <div className="grid grid-cols-2 gap-6 border-t border-[#d9d9d9] pt-4">
              {/* Left: warehouse details */}
              <div className="space-y-4">
                <p className="text-base font-bold text-black">{info.nama}</p>

                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#01798a]" />
                  <div className="flex-1">
                    <p className="text-sm text-[#727272]">{info.alamat}</p>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="mt-1 flex items-center gap-1 text-xs text-[#01798a] transition-opacity hover:opacity-70"
                    >
                      {copied ? (
                        <><Check className="size-3" /> {t("copied")}</>
                      ) : (
                        <><Copy className="size-3" /> {t("copyAddress")}</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-[#01798a]" />
                  <a
                    href={`tel:${info.telepon}`}
                    className="text-sm text-[#727272] hover:text-[#01798a] hover:underline"
                  >
                    {info.telepon}
                  </a>
                </div>
              </div>

              {/* Right: schedule */}
              <div>
                <p className="mb-3 text-sm font-semibold text-black">
                  {t("schedule")}
                </p>
                <div className="space-y-1.5">
                  {info.jadwal.map((day, i) => {
                    const isToday = Number(day.hari) === todayIndex;
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm ${
                          isToday ? "bg-[#fff8df]" : ""
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            isToday
                              ? "text-[#1d1d1d]"
                              : day.is_buka
                              ? "text-black"
                              : "text-[#b0b0b0]"
                          }`}
                        >
                          {getDayName(day.hari, locale)}
                          {isToday && (
                            <span className="ml-2 rounded-full bg-[#ffcf02] px-1.5 py-0.5 text-[10px] font-bold text-[#1d1d1d]">
                              {t("today")}
                            </span>
                          )}
                        </span>
                        <span
                          className={
                            day.is_buka
                              ? isToday
                                ? "font-semibold text-[#1d1d1d]"
                                : "text-black"
                              : "text-[#b0b0b0]"
                          }
                        >
                          {day.is_buka
                            ? `${day.jam_buka} – ${day.jam_tutup}`
                            : t("closed")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
