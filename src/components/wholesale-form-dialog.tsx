"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@ui/dialog";
import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query";

type WholesaleFormBody = {
  full_name: string;
  phone_number: string;
  address: string;
  budget: string;
  categories: string[];
};

const EMPTY_FORM: WholesaleFormBody = {
  full_name: "",
  phone_number: "",
  address: "",
  budget: "",
  categories: [],
};

type BudgetResponse = { success: boolean; message: string; data: string[] };
type CategoryItem = { label: string; value: string };
type CategoriesResponse = { success: boolean; message: string; data: CategoryItem[] };
type RegisterResponse = { success: boolean; message: string; data: null };

export function WholesaleFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Homepage.wholesale.form");
  const locale = useLocale();
  const [form, setForm] = useState<WholesaleFormBody>(EMPTY_FORM);

  const { data: budgetData, isLoading: budgetLoading } = useApiQuery<BudgetResponse>({
    key: ["wholesale-budget"],
    endpoint: "/web/general/wholesale-form/budget",
    enabled: open,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useApiQuery<CategoriesResponse>({
    key: ["wholesale-categories", locale],
    endpoint: "/web/general/wholesale-form/categories",
    searchParams: { lang: locale },
    enabled: open,
  });

  const { mutate: submitForm, isPending } = useMutate<RegisterResponse, WholesaleFormBody>({
    endpoint: "/web/general/wholesale-form/register",
    method: "post",
    isPublic: true,
    onSuccess: (res) => {
      toast.success(res.data.message);
      onOpenChange(false);
      setForm(EMPTY_FORM);
    },
    errorCustom: (err: any) => {
      const msg = err?.response?.data?.message ?? t("errorMessage");
      toast.error(msg);
    },
  });

  function setField<K extends keyof WholesaleFormBody>(key: K, value: WholesaleFormBody[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCategory(value: string) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((c) => c !== value)
        : [...prev.categories, value],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.categories.length === 0) {
      toast.error(t("categoriesRequired"));
      return;
    }
    submitForm({ body: form });
  }

  const budgets = budgetData?.data ?? [];
  const categories = categoriesData?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg lg:max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">
              {t("fullNameLabel")}<span className="text-red-500 ml-0.5">*</span>
            </label>
            <Input
              value={form.full_name}
              onChange={(e) => setField("full_name", e.target.value)}
              placeholder={t("fullNamePlaceholder")}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">
              {t("phoneLabel")}<span className="text-red-500 ml-0.5">*</span>
            </label>
            <Input
              type="tel"
              value={form.phone_number}
              onChange={(e) => setField("phone_number", e.target.value)}
              placeholder={t("phonePlaceholder")}
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">
              {t("addressLabel")}<span className="text-red-500 ml-0.5">*</span>
            </label>
            <Input
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              placeholder={t("addressPlaceholder")}
              required
            />
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">
              {t("budgetLabel")}<span className="text-red-500 ml-0.5">*</span>
            </label>
            <select
              value={form.budget}
              onChange={(e) => setField("budget", e.target.value)}
              required
              disabled={budgetLoading}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>{budgetLoading ? "..." : t("budgetPlaceholder")}</option>
              {budgets.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Product Categories */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">
              {t("categoriesLabel")}<span className="text-red-500 ml-0.5">*</span>
            </label>
            {categoriesLoading ? (
              <p className="text-sm text-muted-foreground">...</p>
            ) : (
              <div className="max-h-40 overflow-y-auto rounded-md border p-2 grid grid-cols-2 gap-1">
                {categories.map((cat) => (
                  <label key={cat.value} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={form.categories.includes(cat.value)}
                      onChange={() => toggleCategory(cat.value)}
                      className="rounded"
                    />
                    {cat.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-[#ffcf02] text-black shadow-none hover:bg-[#f0c300]"
              disabled={isPending}
            >
              {isPending ? t("submitting") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
