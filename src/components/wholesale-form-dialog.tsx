"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@ui/dialog";

type WholesaleFormBody = {
  full_name: string;
  business_name: string;
  phone: string;
  email: string;
  business_type: string;
  address: string;
  notes: string;
};

const EMPTY_FORM: WholesaleFormBody = {
  full_name: "",
  business_name: "",
  phone: "",
  email: "",
  business_type: "",
  address: "",
  notes: "",
};

export function WholesaleFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Homepage.wholesale.form");
  const [form, setForm] = useState<WholesaleFormBody>(EMPTY_FORM);
  const [isPending, setIsPending] = useState(false);

  function setField(key: keyof WholesaleFormBody, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: connect to API endpoint when ready
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      onOpenChange(false);
      setForm(EMPTY_FORM);
    }, 500);
  }

  const textFields: {
    key: keyof WholesaleFormBody;
    label: string;
    placeholder: string;
    type?: string;
    required?: boolean;
  }[] = [
    { key: "full_name", label: t("fullNameLabel"), placeholder: t("fullNamePlaceholder"), required: true },
    { key: "business_name", label: t("businessNameLabel"), placeholder: t("businessNamePlaceholder"), required: true },
    { key: "phone", label: t("phoneLabel"), placeholder: t("phonePlaceholder"), type: "tel", required: true },
    { key: "email", label: t("emailLabel"), placeholder: t("emailPlaceholder"), type: "email", required: true },
    { key: "address", label: t("addressLabel"), placeholder: t("addressPlaceholder"), required: true },
  ];

  const businessTypes = [
    { value: "retailer", label: t("businessTypes.retailer") },
    { value: "distributor", label: t("businessTypes.distributor") },
    { value: "reseller", label: t("businessTypes.reseller") },
    { value: "other", label: t("businessTypes.other") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {textFields.map(({ key, label, placeholder, type, required }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-medium text-black">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <Input
                type={type ?? "text"}
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder}
                required={required}
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">
              {t("businessTypeLabel")}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <select
              value={form.business_type}
              onChange={(e) => setField("business_type", e.target.value)}
              required
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>{t("businessTypePlaceholder")}</option>
              {businessTypes.map((bt) => (
                <option key={bt.value} value={bt.value}>{bt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">{t("notesLabel")}</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder={t("notesPlaceholder")}
              rows={3}
            />
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
