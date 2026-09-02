"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";

export function PaymentSuccessModal({ redirectTo = "/profile/orders" }: { redirectTo?: string }) {
  const t = useTranslations("ProfilePages.orders");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const open = searchParams.get("payment_success") === "1" && !dismissed;

  const handleClose = () => {
    setDismissed(true);
    router.replace(redirectTo);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent
        className="min-w-xl items-center justify-center flex flex-col p-8! gap-6"
        showCloseButton={false}
      >
        <div className="flex flex-col gap-3 items-center text-center">
          <div className="relative h-7 aspect-[19/4]">
            <Image
              src="/assets/images/logo-bulky.webp"
              alt="Bulky"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1280px"
            />
          </div>
          <p className="text-xl font-medium">{t("paymentSuccessTitle")}</p>
          <p className="text-sm text-gray-500">{t("paymentSuccessDesc")}</p>
        </div>
        <div className="relative size-52">
          <Image
            src="/assets/images/profile/added-to-cart.webp"
            alt="success"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
        </div>
        <div className="flex items-center gap-4 w-full">
          <Link href="/" className="w-full" onClick={handleClose}>
            <Button
              className="w-full flex-auto h-12 rounded-full bg-gray-200 text-black hover:bg-gray-300"
              size="lg"
            >
              <ArrowLeft />
              {t("paymentSuccessContinue")}
            </Button>
          </Link>
          <Button
            className="w-full flex-auto h-12 rounded-full bg-yellow-400 text-black hover:bg-yellow-500"
            size="lg"
            onClick={handleClose}
          >
            {t("paymentSuccessViewOrders")}
            <ArrowRight />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
