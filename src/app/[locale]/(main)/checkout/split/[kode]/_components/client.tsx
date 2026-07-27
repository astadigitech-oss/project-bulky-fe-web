"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Coins, Users } from "lucide-react";

import { useProtectRoute } from "@/providers/session-provider";
import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query/use-mutate";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PaymentMethodSelector } from "../../../_components/client";

import type {
  CreateSplitPaymentBody,
  CreateSplitPaymentResponse,
  GetPaymentMethodsResponse,
  SetSplitPaymentAmountBody,
  SetSplitPaymentAmountResponse,
} from "@/services/checkout/types";

function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-bold text-[#01798A]">{children}</p>;
}

// ─── Main Component ────────────────────────────────────────────────────────────

export const SplitPaymentClient = ({ kode }: { kode: string }) => {
  const t = useTranslations("SplitPaymentPage");
  const { isLoading: sessionLoading } = useProtectRoute();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale === "en" ? "en" : "id";

  const [amountInput, setAmountInput] = useState("");
  const [amountConfirmed, setAmountConfirmed] = useState<{ remaining_after: number; total: number } | null>(null);
  const [selectedPaymentKode, setSelectedPaymentKode] = useState<string | null>(null);

  const paymentMethodsQuery = useApiQuery<GetPaymentMethodsResponse>({
    key: ["payment-methods"],
    endpoint: "/checkout/payment-methods",
    enabled: !sessionLoading,
  });

  const setAmount = useMutate<SetSplitPaymentAmountResponse, SetSplitPaymentAmountBody, { kode: string }>({
    endpoint: "/pesanan/:kode/split-payment/amount",
    method: "patch",
    onSuccess: (res) => {
      if (res.data?.data) {
        setAmountConfirmed(res.data.data);
        toast.success(t("amountSaved"));
      }
    },
    onError: { title: "SET_SPLIT_PAYMENT_AMOUNT" },
  });

  const createSplitPayment = useMutate<CreateSplitPaymentResponse, CreateSplitPaymentBody, { kode: string }>({
    endpoint: "/pesanan/:kode/split-payment/pay",
    method: "post",
    onSuccess: (res) => {
      const paymentUrl = res.data?.data?.payment_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    },
    onError: { title: "CREATE_SPLIT_PAYMENT" },
  });

  const handleSaveAmount = () => {
    const amount = Number(amountInput);
    if (!amountInput.trim() || Number.isNaN(amount) || amount <= 0) {
      toast.error(t("amountRequired"));
      return;
    }
    setAmountConfirmed(null);
    setAmount.mutate({ body: { amount }, params: { kode } });
  };

  const handlePay = () => {
    if (!amountConfirmed) {
      toast.error(t("setAmountFirst"));
      return;
    }
    if (!selectedPaymentKode) {
      toast.error(t("paymentMethodRequired"));
      return;
    }

    const allChannels = (paymentMethodsQuery.data?.data ?? []).flatMap((g) => g.metode);
    const selectedChannel = allChannels.find((c) => c.kode === selectedPaymentKode);
    if (!selectedChannel) {
      toast.error(t("paymentMethodRequired"));
      return;
    }

    const successReturnUrl = `${window.location.origin}/${locale}/profile/orders?payment_success=1`;

    createSplitPayment.mutate({
      body: {
        metode_pembayaran_id: selectedChannel.id,
        metode_pembayaran_kode: selectedChannel.kode,
        success_return_url: successReturnUrl,
      },
      params: { kode },
    });
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffcf02] border-t-black" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Users className="size-6 text-[#01798A]" />
        <h1 className="text-2xl font-bold text-black">{t("title")}</h1>
      </div>

      <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-3">
        <span className="text-sm text-gray-500">{t("orderCode")}</span>
        <span className="text-sm font-bold text-black">{kode}</span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-6">

        {/* Nominal */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Coins className="size-4 text-[#01798A]" />
            <SectionTitle>{t("amountSectionTitle")}</SectionTitle>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="number"
              min={1}
              value={amountInput}
              onChange={(e) => {
                setAmountInput(e.target.value);
                setAmountConfirmed(null);
              }}
              placeholder={t("amountPlaceholder")}
              className="h-10 flex-1 rounded border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02]"
            />
            <Button
              type="button"
              disabled={setAmount.isPending}
              onClick={handleSaveAmount}
              className="h-10 shrink-0 bg-[#ffcf02] px-5 text-sm font-bold text-black shadow-none hover:bg-[#f0c300] disabled:opacity-50"
            >
              {setAmount.isPending ? t("savingAmount") : t("saveAmount")}
            </Button>
          </div>

          {amountConfirmed && (
            <div className="flex flex-col gap-1 rounded border border-green-200 bg-green-50 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-800">{t("orderTotal")}</span>
                <span className="font-semibold text-green-900">{formatIdr(amountConfirmed.total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-800">{t("remainingAfter")}</span>
                <span className="font-semibold text-green-900">{formatIdr(amountConfirmed.remaining_after)}</span>
              </div>
            </div>
          )}
        </section>

        <Separator className="bg-gray-200" />

        {/* Metode Pembayaran */}
        <section className="flex flex-col gap-3">
          <SectionTitle>{t("paymentMethodSectionTitle")}</SectionTitle>
          <PaymentMethodSelector
            groups={paymentMethodsQuery.data?.data ?? []}
            isLoading={paymentMethodsQuery.isLoading}
            isError={paymentMethodsQuery.isError}
            selectedKode={selectedPaymentKode}
            onSelect={setSelectedPaymentKode}
          />
        </section>

        <Button
          onClick={handlePay}
          disabled={createSplitPayment.isPending}
          className="w-full bg-[#ffcf02] hover:bg-[#f0c300] text-black font-bold rounded-md h-10 shadow-none disabled:opacity-50"
        >
          {createSplitPayment.isPending ? t("paying") : t("payButton")}
        </Button>
      </div>
    </div>
  );
};
