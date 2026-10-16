"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
        <div className="mx-auto grid max-w-6xl grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-3 gap-y-4 rounded-2xl border border-[#f0e3bd] bg-[#fef8ec] p-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-5 sm:gap-y-5 sm:p-6 lg:grid-cols-[10rem_minmax(0,1fr)_auto] lg:gap-x-7 lg:gap-y-0 lg:px-8 lg:py-5">
          <div className="flex h-20 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-32 lg:h-32 lg:w-40">
            <Image
              src="/assets/images/warehouse-visit-reservation.png"
              alt=""
              width={240}
              height={200}
              sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold tracking-[0.16em] text-[#775f00] uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="text-lg font-bold text-black sm:text-xl md:text-2xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b] md:text-base">
              {t("description")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="col-span-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#ffcf02] px-5 text-sm font-bold text-black transition-colors hover:bg-[#f0c300] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:w-fit sm:justify-self-end lg:col-span-1"
          >
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
