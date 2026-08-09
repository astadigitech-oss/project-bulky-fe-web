"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useApiQuery } from "@/lib/query/use-query";
import type { GetTrackingResponse } from "@/services/orders/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TrackingModal({
  open,
  onClose,
  orderId,
}: {
  open: boolean;
  onClose: () => void;
  orderId: string;
}) {
  const t = useTranslations("ProfilePages.orderDetail.trackingModal");

  const { data, isLoading } = useApiQuery<GetTrackingResponse>({
    key: ["tracking", orderId],
    endpoint: `/web/orders/${orderId}/tracking`,
    enabled: open,
    retry: false,
  });

  const tracking = data?.data;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-[#ffcf02]" />
          </div>
        ) : !tracking ? (
          <p className="py-4 text-center text-sm text-[#b0b0b0]">{t("noData")}</p>
        ) : (
          <div className="space-y-4">
            {tracking.booking_number && (
              <div>
                <p className="text-xs text-[#727272]">{t("bookingNumber")}</p>
                <p className="mt-0.5 text-sm font-semibold text-black">{tracking.booking_number}</p>
              </div>
            )}
            {tracking.delivery_status && (
              <div>
                <p className="text-xs text-[#727272]">{t("deliveryStatus")}</p>
                <p className="mt-0.5 text-sm font-semibold text-black">{tracking.delivery_status}</p>
              </div>
            )}
            {tracking.tracking_url && (
              <a
                href={tracking.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#01798a] hover:underline"
              >
                <ExternalLink className="size-3.5" />
                {t("trackExternally")}
              </a>
            )}
            {!tracking.booking_number && !tracking.delivery_status && !tracking.tracking_url && (
              <p className="py-2 text-center text-sm text-[#b0b0b0]">{t("noData")}</p>
            )}
            {tracking.status_history && tracking.status_history.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-[#727272]">{t("history")}</p>
                <div className="space-y-0">
                  {tracking.status_history.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "mt-1.5 size-2 rounded-full",
                            i === 0 ? "bg-[#01798a]" : "bg-[#d9d9d9]",
                          )}
                        />
                        {i < tracking.status_history!.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-[#d9d9d9]" />
                        )}
                      </div>
                      <div className="pb-3">
                        <p className={cn("text-sm", i === 0 ? "font-semibold text-black" : "text-[#727272]")}>
                          {item.status_name}
                        </p>
                        <p className="text-xs text-[#b0b0b0]">
                          {item.status_date} {item.status_time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
