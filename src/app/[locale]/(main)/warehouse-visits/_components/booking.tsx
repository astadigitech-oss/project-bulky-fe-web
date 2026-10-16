"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useRouter } from "@i18n/navigation";
import { Button } from "@/components/ui/button";
import { SuccessCheckAnimation } from "@/components/success-check-animation";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query";
import { useSession } from "@/providers/session-provider";

type VisitAvailability = {
  id: string;
  visit_date: string;
  is_open: boolean;
  crew_count: number;
  capacity: number;
  booked_count: number;
  remaining_capacity: number;
  display_hours?: string | null;
};

type AvailabilityResponse = { data: VisitAvailability[] };

type Booking = {
  id: string;
  visit_date: string;
  status: "CONFIRMED" | "CANCELLED" | "ATTENDED" | "NO_SHOW";
  display_hours?: string | null;
};

type BookingResponse = { data: Booking };

function jakartaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

function getCurrentMonth() {
  const parts = jakartaDateParts(new Date());
  return `${parts.year}-${parts.month}`;
}

function getToday() {
  const parts = jakartaDateParts(new Date());
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function shiftMonth(value: string, amount: number) {
  const [year, month] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + amount, 1))
    .toISOString()
    .slice(0, 7);
}

function getMonthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = `${month}-01`;
  const lastDay = new Date(Date.UTC(year, monthNumber, 0))
    .toISOString()
    .slice(0, 10);
  const currentMonth = getCurrentMonth();
  const today = getToday();
  return {
    from: month === currentMonth && today > firstDay ? today : firstDay,
    to: lastDay,
  };
}

function formatVisitDate(
  value: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    ...options,
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${value}T00:00:00+07:00`));
}

type WarehouseVisitBookingProps = {
  presentation?: "page" | "modal";
  onBookingConfirmed?: (confirmed: boolean) => void;
  onDismiss?: () => void;
};

export function WarehouseVisitBooking({
  presentation = "page",
  onBookingConfirmed,
  onDismiss,
}: WarehouseVisitBookingProps) {
  const t = useTranslations("WarehouseVisits.booking");
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSession();
  const [month, setMonth] = useState(getCurrentMonth);
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(
    null,
  );

  const range = useMemo(() => getMonthRange(month), [month]);
  const availabilityQuery = useApiQuery<AvailabilityResponse>({
    key: ["warehouse-visit-availability", range.from, range.to],
    endpoint: "/web/warehouse-visits/availability",
    searchParams: range,
    staleTime: 30_000,
  });
  const dates = availabilityQuery.data?.data ?? [];
  const selectedDate = dates.find((date) => date.id === selectedDateId) ?? null;

  const bookingMutation = useMutate<BookingResponse, { visit_date_id: string }>(
    {
      endpoint: "/web/warehouse-visits/bookings",
      method: "post",
      onSuccess: async (response) => {
        const booking = response.data.data;
        setConfirmedBooking(booking);
        setSelectedDateId(null);
        onBookingConfirmed?.(true);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["warehouse-visit-availability"],
          }),
          queryClient.invalidateQueries({
            queryKey: ["warehouse-visit-bookings"],
          }),
        ]);
      },
      errorCustom: (error) => {
        if (error.response?.status === 409)
          toast.error(t("errors.unavailable"));
        else if (error.response?.status === 401)
          toast.error(t("errors.loginAgain"));
        else toast.error(t("errors.generic"));
      },
    },
  );

  function handleBooking() {
    if (!selectedDate) return;
    if (!isAuthenticated) {
      router.push("/login?reason=auth-required&next=%2Fwarehouse-visits");
      return;
    }
    bookingMutation.mutate({ body: { visit_date_id: selectedDate.id } });
  }

  const monthLabel = formatVisitDate(`${month}-01`, locale, {
    month: "long",
    year: "numeric",
  });

  const [calendarYear, calendarMonth] = month.split("-").map(Number);
  const weekStartsOn = locale === "en" ? 0 : 1;
  const daysInMonth = new Date(
    Date.UTC(calendarYear, calendarMonth, 0),
  ).getUTCDate();
  const firstWeekday =
    (new Date(Date.UTC(calendarYear, calendarMonth - 1, 1)).getUTCDay() -
      weekStartsOn +
      7) %
    7;
  const calendarCellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const calendarCells = Array.from(
    { length: calendarCellCount },
    (_, index) => {
      const day = index - firstWeekday + 1;
      if (day < 1 || day > daysInMonth) return null;
      return {
        day,
        visitDate: month + "-" + String(day).padStart(2, "0"),
      };
    },
  );
  const availabilityByDate = new Map(
    dates.map((date) => [date.visit_date, date] as const),
  );
  const weekdayLabels = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
      weekday: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2023, 9, 1 + weekStartsOn + index))),
  );

  if (presentation === "modal" && confirmedBooking) {
    return (
      <>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="relative h-7 aspect-[19/4] w-36">
            <Image
              src="/assets/images/logo-bulky.webp"
              alt="Bulky"
              fill
              className="object-contain"
              sizes="144px"
            />
          </div>
          <DialogHeader className="items-center text-center sm:items-center sm:text-center">
            <DialogTitle className="text-xl font-medium">
              {t("successTitle")}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {t("successDescription", {
                date: formatVisitDate(confirmedBooking.visit_date, locale, {
                  dateStyle: "long",
                }),
              })}
            </DialogDescription>
          </DialogHeader>
        </div>
        <SuccessCheckAnimation label={t("successTitle")} />
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            className="h-12 w-full rounded-full bg-gray-200 text-black hover:bg-gray-300 sm:flex-1"
            size="lg"
            onClick={() => onDismiss?.()}
          >
            <ArrowLeft />
            {t("closeDialog")}
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/profile/warehouse-visits" />}
            className="h-12 w-full rounded-full bg-yellow-400 text-black hover:bg-yellow-500 sm:flex-1"
            size="lg"
          >
            {t("viewHistory")}
            <ArrowRight />
          </Button>
        </div>
      </>
    );
  }

  const bookingContent = (
    <div
      className={
        presentation === "modal"
          ? "pt-1"
          : "mx-auto max-w-[1280px] px-4 py-10 sm:px-6 md:px-8 md:py-12 lg:px-12"
      }
    >
      {confirmedBooking ? (
        <section className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-[#fef8ec] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="font-bold text-[#171717]">{t("successTitle")}</p>
            <p className="mt-1 text-sm text-[#555550]">
              {t("successDescription", {
                date: formatVisitDate(confirmedBooking.visit_date, locale, {
                  dateStyle: "long",
                }),
              })}
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/profile/warehouse-visits" />}
            className="shrink-0 gap-2 bg-[#ffcf02] text-black hover:bg-[#f0c300]"
          >
            {t("viewHistory")} <ArrowRight className="size-4" />
          </Button>
        </section>
      ) : null}

      <section id="visit-dates">
        <div className="mb-5 flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          {presentation === "page" ? (
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#ffcf02] text-black">
                <CalendarDays className="size-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl leading-tight font-bold text-black md:text-3xl">
                  {t("datesTitle")}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#666660] md:text-base">
                  {t("datesDescription")}
                </p>
              </div>
            </div>
          ) : null}
          <div className="flex w-fit self-end items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 sm:ml-auto">
            <button
              type="button"
              aria-label={t("previousMonth")}
              disabled={month <= getCurrentMonth()}
              onClick={() => {
                setMonth((current) => shiftMonth(current, -1));
                setSelectedDateId(null);
              }}
              className="grid size-9 place-items-center rounded-md text-gray-700 transition-colors hover:bg-[#fef8ec] hover:text-black disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-32 px-2 text-center text-sm font-semibold capitalize text-black">
              {monthLabel}
            </span>
            <button
              type="button"
              aria-label={t("nextMonth")}
              onClick={() => {
                setMonth((current) => shiftMonth(current, 1));
                setSelectedDateId(null);
              }}
              className="grid size-9 place-items-center rounded-md text-gray-700 transition-colors hover:bg-[#fef8ec] hover:text-black"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {availabilityQuery.isLoading ? (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-gray-200 bg-white">
            <Loader2 className="size-7 animate-spin text-[#c39b00]" />
          </div>
        ) : availabilityQuery.isError ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-8 text-center">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#ffcf02] text-black">
              <CalendarDays className="size-6" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[#3f3f3b]">
              {t("loadError")}
            </p>
            <Button
              type="button"
              className="mt-3 bg-[#ffcf02] px-4 text-black hover:bg-[#f0c300]"
              onClick={() => availabilityQuery.refetch()}
            >
              {t("retry")}
            </Button>
          </div>
        ) : dates.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-8 text-center">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#ffcf02] text-black">
              <CalendarDays className="size-6" aria-hidden="true" />
            </div>
            <p className="font-bold text-[#171717]">{t("noDatesTitle")}</p>
            <p className="mt-1 max-w-md text-sm leading-6 text-[#666660]">
              {t("noDatesDescription")}
            </p>
          </div>
        ) : (
          <div
            role="group"
            aria-label={monthLabel}
            className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200"
          >
            {weekdayLabels.map((weekday, index) => (
              <div
                key={"weekday-" + index}
                aria-hidden="true"
                className="bg-gray-50 py-2 text-center text-[10px] font-semibold uppercase text-[#727272] sm:text-xs"
              >
                {weekday}
              </div>
            ))}
            {calendarCells.map((cell, index) => {
              if (!cell) {
                return (
                  <div
                    key={"blank-" + index}
                    aria-hidden="true"
                    className="min-h-[56px] bg-gray-50 sm:min-h-16"
                  />
                );
              }

              const availability = availabilityByDate.get(cell.visitDate);
              const available =
                !!availability &&
                availability.is_open &&
                availability.remaining_capacity > 0;
              const selected = availability?.id === selectedDateId;
              const dateLabel = formatVisitDate(cell.visitDate, locale, {
                dateStyle: "full",
              });
              const statusLabel = !availability
                ? t("noDatesTitle")
                : !availability.is_open
                  ? t("noDatesTitle")
                  : available
                    ? t("remaining", {
                        count: String(availability.remaining_capacity),
                      })
                    : t("full");
              const accessibleLabel = dateLabel + ", " + statusLabel;
              const dayNumber = (
                <span
                  className={
                    "grid size-7 place-items-center rounded-full text-sm " +
                    (selected
                      ? "bg-[#ffcf02] font-bold text-black"
                      : available
                        ? "font-semibold text-black"
                        : "text-gray-400")
                  }
                >
                  {cell.day}
                </span>
              );
              const capacityLabel = availability?.is_open ? (
                <span
                  className={
                    "mt-1 inline-flex items-center gap-1 text-[10px] sm:text-xs " +
                    (available ? "text-[#727272]" : "text-gray-400")
                  }
                >
                  <span
                    className={
                      "size-1.5 shrink-0 rounded-full " +
                      (available ? "bg-emerald-600" : "bg-gray-400")
                    }
                    aria-hidden="true"
                  />
                  <span className="hidden whitespace-nowrap sm:inline">
                    {available
                      ? t("remaining", {
                          count: String(availability.remaining_capacity),
                        })
                      : t("full")}
                  </span>
                  <span className="sm:hidden">
                    {available ? availability.remaining_capacity : 0}
                  </span>
                </span>
              ) : null;

              if (!availability || !available) {
                return (
                  <div
                    key={cell.visitDate}
                    role="group"
                    aria-label={accessibleLabel}
                    className={
                      "flex min-h-[56px] flex-col items-center p-1.5 sm:min-h-16 sm:items-start sm:p-2 " +
                      (availability ? "bg-gray-50" : "bg-white")
                    }
                  >
                    {dayNumber}
                    {capacityLabel}
                  </div>
                );
              }

              return (
                <button
                  type="button"
                  key={cell.visitDate}
                  aria-label={accessibleLabel}
                  aria-pressed={selected}
                  onClick={() => setSelectedDateId(availability.id)}
                  className={
                    "flex min-h-[56px] flex-col items-center p-1.5 text-left transition-colors sm:min-h-16 sm:items-start sm:p-2 " +
                    (selected ? "bg-[#fff9e3]" : "bg-white hover:bg-[#fff9e3]")
                  }
                >
                  {dayNumber}
                  {capacityLabel}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-[#fef8ec] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <CalendarDays
            className="mt-0.5 size-5 shrink-0 text-[#c39b00]"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-black">
              {selectedDate
                ? formatVisitDate(selectedDate.visit_date, locale, {
                    dateStyle: "full",
                  })
                : t("selectDatePrompt")}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#727272]">
              {selectedDate ? (
                <span className="inline-flex items-center gap-1.5">
                  <UsersRound
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  {t("visitCapacity", {
                    capacity: String(selectedDate.capacity),
                  })}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
                {selectedDate?.display_hours || t("hoursNote")}
              </span>
            </div>
          </div>
        </div>
        {isAuthenticated ? (
          <Button
            type="button"
            disabled={!selectedDate || bookingMutation.isPending}
            onClick={handleBooking}
            className="min-h-11 gap-2 bg-[#ffcf02] px-6 font-semibold text-black hover:bg-[#f0c300] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            {bookingMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("processing")}
              </>
            ) : (
              <>
                {t("confirmBooking")}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            disabled={!selectedDate}
            onClick={handleBooking}
            className="min-h-11 gap-2 bg-[#ffcf02] px-6 font-semibold text-black hover:bg-[#f0c300] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            {t("loginToBook")}
            <ArrowRight className="size-4" />
          </Button>
        )}
      </section>

      {!isAuthenticated ? (
        <p className="mt-5 text-center text-sm text-[#666660]">
          {t("historyPrompt")}{" "}
          <Link
            className="font-bold text-[#705900] underline underline-offset-2"
            href="/profile/warehouse-visits"
          >
            {t("viewHistory")}
          </Link>
        </p>
      ) : null}
    </div>
  );

  if (presentation === "modal") return bookingContent;

  return (
    <main className="bg-white">
      <header className="mx-auto max-w-[1280px] px-4 pt-9 sm:px-6 md:px-8 lg:px-12">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#705900]">
          <CalendarDays className="size-4 text-[#c39b00]" aria-hidden="true" />
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl leading-tight font-bold text-black sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#666660] sm:text-base">
          {t("description")}
        </p>
      </header>
      {bookingContent}
    </main>
  );
}
