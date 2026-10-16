"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WarehouseVisitBooking } from "../../../warehouse-visits/_components/booking";

export function WarehouseVisitSection() {
  const t = useTranslations("Homepage.warehouseVisitShortcut");
  const booking = useTranslations("WarehouseVisits.booking");
  const [open, setOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  return (
    <>
      <section className="w-full px-4 pb-10 sm:px-6 md:px-8 md:pb-14">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-2xl border border-[#f0e3bd] bg-[#fef8ec] p-5 sm:p-7 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:px-9 md:py-8">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#ffcf02] text-black">
              <CalendarDays aria-hidden="true" className="size-5" />
            </div>
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-bold tracking-[0.16em] text-[#775f00] uppercase">
                {t("eyebrow")}
              </p>
              <h2 className="text-xl font-bold text-black md:text-2xl">
                {t("title")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b] md:text-base">
                {t("description")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 justify-self-start rounded-lg bg-[#ffcf02] px-5 text-sm font-bold text-black transition-colors hover:bg-[#f0c300] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:w-fit md:justify-self-end"
          >
            <CalendarDays aria-hidden="true" className="size-4" />
            {t("cta")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </section>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setBookingConfirmed(false);
        }}
      >
        <DialogContent
          className={
            bookingConfirmed
              ? "flex max-h-[90vh] w-[calc(100%-2rem)] max-w-xl flex-col items-center justify-center gap-6 overflow-y-auto p-8!"
              : "max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-3xl"
          }
          showCloseButton={!bookingConfirmed}
        >
          {bookingConfirmed ? null : (
            <DialogHeader className="pr-10">
              <DialogTitle className="text-base font-bold text-black sm:text-lg">
                {booking("datesTitle")}
              </DialogTitle>
              <DialogDescription className="leading-relaxed text-[#727272]">
                {booking("datesDescription")}
              </DialogDescription>
            </DialogHeader>
          )}
          {open ? (
            <WarehouseVisitBooking
              presentation="modal"
              onBookingConfirmed={setBookingConfirmed}
              onDismiss={() => {
                setOpen(false);
                setBookingConfirmed(false);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
