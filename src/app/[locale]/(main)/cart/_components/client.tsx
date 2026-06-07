"use client";

import React from "react";
import Image from "next/image";
import { useProtectRoute } from "@/providers/session-provider";
import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query/use-mutate";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Link, useRouter } from "@/i18n/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type {
  GetCartResponse,
  CartItem,
  CheckItemBody,
  CheckItemResponse,
  DeleteItemParams,
  DeleteItemResponse,
  CheckoutResponse,
} from "@/services/cart/types";

export const CartClient = () => {
  const t = useTranslations("CartPage");
  const { isLoading: sessionLoading } = useProtectRoute();
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale === "en" ? "en" : "id";

  // ─── Queries ─────────────────────────────────────────────────────────────────

  const cartQuery = useApiQuery<GetCartResponse>({
    key: ["cart"],
    endpoint: "/carts",
    searchParams: { locale },
    enabled: !sessionLoading,
  });

  // ─── Mutations ────────────────────────────────────────────────────────────────

  const checkItem = useMutate<CheckItemResponse, CheckItemBody>({
    endpoint: "/carts/check",
    method: "patch",
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    errorCustom: () => toast.error(t("checkError")),
  });

  const deleteItem = useMutate<DeleteItemResponse, undefined, DeleteItemParams>({
    endpoint: "/carts/check/:id",
    method: "delete",
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    errorCustom: () => toast.error(t("removeError")),
  });

  const checkout = useMutate<CheckoutResponse>({
    endpoint: "/checkout",
    method: "post",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/checkout");
    },
    errorCustom: (err) => {
      const msg =
        (err.response?.data as any)?.message ?? t("checkoutError");
      toast.error(msg);
    },
  });

  // ─── Derived data ─────────────────────────────────────────────────────────────

  const cartData = cartQuery.data?.data;
  const items: CartItem[] = cartData?.data ?? [];

  // Hitung client-side, exclude produk terjual
  const checkedItems = items.filter((i) => i.is_checked && !i.is_sold);
  const selectedCount = checkedItems.length;
  const totalPrice = checkedItems.length > 0
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
        checkedItems.reduce((sum, i) => {
          const num = Number(i.price.replace(/[^\d]/g, "")) || 0;
          return sum + num;
        }, 0),
      )
    : "Rp 0";

  const allChecked =
    items.length > 0 &&
    items.filter((i) => !i.is_sold).every((i) => i.is_checked);

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const handleToggleAll = () => {
    checkItem.mutate({ body: { is_bulk: true } });
  };

  const handleToggleItem = (item: CartItem) => {
    checkItem.mutate({ body: { is_bulk: false, item_id: item.id } });
  };

  const handleDeleteItem = (item: CartItem) => {
    deleteItem.mutate({ params: { id: item.id } });
  };

  const handleCheckout = () => {
    if (selectedCount === 0) return;
    checkout.mutate({});
  };

  // ─── Render states ────────────────────────────────────────────────────────────

  if (sessionLoading || cartQuery.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffcf02] border-t-black" />
      </div>
    );
  }

  if (cartQuery.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {t("loadError")}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-5">
        <div className="relative w-64 h-64">
          <Image
            src="/assets/images/cart-illustration.svg"
            alt={t("emptyTitle")}
            fill
            className="object-contain"
            sizes="256px"
          />
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="font-semibold text-lg">{t("emptyTitle")}</p>
          <p className="text-sm text-gray-500">{t("emptyDescription")}</p>
        </div>
        <Link href="/products">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full px-8">
            {t("browseProducts")}
          </Button>
        </Link>
      </div>
    );
  }

  const isMutating =
    checkItem.isPending || deleteItem.isPending || checkout.isPending;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>

      <div className="grid grid-cols-[1fr_360px] gap-8 items-start">
        {/* Left: Cart Items */}
        <div className="flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white">
          {/* Table Header */}
          <div className="flex items-center bg-yellow-300 px-4 py-3 gap-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={handleToggleAll}
              disabled={isMutating}
              aria-label="Pilih semua"
            />
            <span className="flex-1 text-sm font-bold text-black">
              {t("productName")}
            </span>
            <span className="w-28 text-center text-sm font-normal text-black">
              {t("quantity")}
            </span>
            <span className="w-36 text-right text-sm font-normal text-black">
              {t("price")}
            </span>
            <span className="w-10" />
          </div>

          {/* Sub-header: item count */}
          <div className="flex items-center px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <span className="flex-1 text-xs text-gray-500">
              {t("itemsSelected", { count: String(selectedCount) })}
            </span>
          </div>

          {/* Items */}
          <div className="flex flex-col divide-y divide-gray-100">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center px-4 py-4 gap-4 ${
                  item.is_sold ? "opacity-50" : ""
                }`}
              >
                <Checkbox
                  checked={item.is_checked}
                  onCheckedChange={() => handleToggleItem(item)}
                  disabled={isMutating || item.is_sold}
                  aria-label={`Pilih ${item.name}`}
                />
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative size-[72px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                    <Image
                      src={item.image || "https://github.com/shadcn.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm line-clamp-2 leading-snug min-w-0">
                      {item.name}
                    </p>
                    {item.is_sold && (
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded">
                        {t("sold")}
                      </span>
                    )}
                  </div>
                </div>
                <span className="w-28 text-center text-sm text-gray-700">
                  1 Palet
                </span>
                <span className="w-36 text-right text-sm font-semibold text-gray-900">
                  {item.price}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item)}
                  disabled={isMutating}
                  className="w-10 flex justify-center text-gray-400 hover:text-red-500 disabled:opacity-40"
                  aria-label={`Hapus ${item.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
          <p className="font-bold text-base text-[#01798A]">{t("summary")}</p>
          <Separator className="bg-gray-200" />
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{t("totalProductsSelected")}</span>
              <span className="font-semibold">{selectedCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{t("totalOrder")}</span>
              <span className="font-semibold">{totalPrice}</span>
            </div>
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{t("total")}</span>
            <span className="text-xl font-bold text-orange-500">{totalPrice}</span>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={selectedCount === 0 || checkout.isPending}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-md h-10 disabled:opacity-50"
          >
            {checkout.isPending ? "..." : t("buy")}
          </Button>
        </div>
      </div>
    </div>
  );
};
