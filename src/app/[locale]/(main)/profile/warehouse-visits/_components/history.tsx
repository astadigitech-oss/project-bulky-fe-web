"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Loader2, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@i18n/navigation";
import { useApiQuery } from "@/lib/query/use-query";
import { useProtectRoute } from "@/providers/session-provider";

type VisitBooking = {
  id: string;
  visit_date_id: string;
  visit_date: string;
  status: "CONFIRMED" | "CANCELLED" | "ATTENDED" | "NO_SHOW";
  crew_count: number;
  capacity: number;
  display_hours?: string | null;
  created_at: string;
};

type BookingHistoryResponse = {
  data: VisitBooking[];
  meta?: { current_page: number; last_page: number; total_items: number; per_page: number };
};

const PER_PAGE = 10;

function formatVisitDate(value: string, locale: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    ...options,
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${value}T00:00:00+07:00`));
}

const statusStyles: Record<VisitBooking["status"], string> = {
  CONFIRMED: "bg-[#fff4c2] text-[#6d5600]",
  CANCELLED: "bg-[#f3e6e4] text-[#8a4035]",
  ATTENDED: "bg-[#eaf4e5] text-[#41672a]",
  NO_SHOW: "bg-[#ededeb] text-[#555550]",
};

export function WarehouseVisitHistory() {
  const t = useTranslations("WarehouseVisits.history");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const { isLoading: sessionLoading } = useProtectRoute();
  const historyQuery = useApiQuery<BookingHistoryResponse>({
    key: ["warehouse-visit-bookings", page],
    endpoint: "/web/warehouse-visits/my-bookings",
    searchParams: { page, per_page: PER_PAGE },
    enabled: !sessionLoading,
    staleTime: 30_000,
  });

  const bookings = historyQuery.data?.data ?? [];
  const meta = historyQuery.data?.meta;
  const lastPage = meta?.last_page ?? 1;

  if (sessionLoading || historyQuery.isLoading) {
    return <div className="flex min-h-72 items-center justify-center"><Loader2 className="size-8 animate-spin text-[#b08f00]" /></div>;
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#171717]">{t("heading")}</h1>
        <p className="mt-1 text-sm text-[#72726c]">{t("description")}</p>
      </header>

      {historyQuery.isError ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl bg-[#f7f7f4] p-5 text-center">
          <p className="text-sm text-[#72726c]">{t("loadError")}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl bg-[#f7f7f4] px-5 text-center">
          <CalendarDays className="mb-3 size-9 text-[#85857d]" />
          <h2 className="font-semibold text-[#292925]">{t("emptyTitle")}</h2>
          <p className="mt-1 max-w-md text-sm leading-6 text-[#777770]">{t("emptyDescription")}</p>
          <Button nativeButton={false} render={<Link href="/warehouse-visits" />} className="mt-5 bg-[#ffcf02] text-black hover:bg-[#f0c300]">{t("browseDates")}</Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-xl border border-[#e4e4de] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#777770]">{t("visitDate")}</p>
                    <h2 className="mt-1 text-lg font-bold capitalize text-[#20201d]">
                      {formatVisitDate(booking.visit_date, locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </h2>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}>{t(`status.${booking.status}`)}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#ededeb] pt-3 text-sm text-[#666660]">
                  <span className="inline-flex items-center gap-2"><UsersRound className="size-4" />{t("visitCapacity", { capacity: String(booking.capacity) })}</span>
                  {booking.display_hours ? <span className="inline-flex items-center gap-2"><Clock3 className="size-4" />{booking.display_hours}</span> : null}
                </div>
              </article>
            ))}
          </div>

          {lastPage > 1 ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e7e7e2] pt-4">
              <p className="text-sm text-[#72726c]">{t("page", { current: String(meta?.current_page ?? page), total: String(lastPage) })}</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="gap-1"><ChevronLeft className="size-4" />{t("previous")}</Button>
                <Button type="button" variant="outline" size="sm" disabled={page >= lastPage} onClick={() => setPage((current) => Math.min(lastPage, current + 1))} className="gap-1">{t("next")}<ChevronRight className="size-4" /></Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
