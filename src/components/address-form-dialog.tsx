"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPickerTrigger, type ResolvedAddress } from "@/components/map-picker";

import type {
  AddressDetail,
  AddressFormBody,
  BaseProfileResponse,
  GetAddressDetailResponse,
} from "@/services/profile/types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const EMPTY_ADDRESS: AddressFormBody = {
  name: "",
  phone: "",
  address_reference: "",
  address_detail: "",
  district: "",
  city: "",
  province: "",
  postal_code: "",
  latitude: "0",
  longitude: "0",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AddressFormDialog({
  open,
  onOpenChange,
  addressId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressId?: string;
  onSuccess: () => void;
}) {
  const t = useTranslations("Profile.addressDialog");
  const isEdit = !!addressId;
  const [form, setForm] = useState<AddressFormBody>(EMPTY_ADDRESS);

  const { data: detailData, isLoading: detailLoading } =
    useApiQuery<GetAddressDetailResponse>({
      key: ["address-detail", addressId],
      endpoint: `/addresses/${addressId}`,
      enabled: isEdit && open,
    });

  useEffect(() => {
    if (!open) return;
    if (!isEdit) {
      setForm(EMPTY_ADDRESS);
      return;
    }
    if (detailData?.data) {
      const d: AddressDetail = detailData.data;
      setForm({
        name: d.name,
        phone: d.phone,
        address_reference: d.address_reference ?? "",
        address_detail: d.address_detail,
        district: d.district,
        city: d.city,
        province: d.province,
        postal_code: d.postal_code,
        latitude: d.latitude ?? "0",
        longitude: d.longitude ?? "0",
      });
    }
  }, [open, isEdit, detailData]);

  function setField(key: keyof AddressFormBody, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const createMutation = useMutate<BaseProfileResponse, AddressFormBody>({
    endpoint: "/addresses",
    method: "post",
    onSuccess: () => { onOpenChange(false); onSuccess(); },
    onError: { title: "CREATE_ADDRESS" },
  });

  const updateMutation = useMutate<BaseProfileResponse, AddressFormBody, { id: string }>({
    endpoint: "/addresses/:id",
    method: "put",
    onSuccess: () => { onOpenChange(false); onSuccess(); },
    onError: { title: "UPDATE_ADDRESS" },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body: AddressFormBody = {
      ...form,
      latitude: form.latitude || "0",
      longitude: form.longitude || "0",
    };
    if (isEdit) updateMutation.mutate({ body, params: { id: addressId! } });
    else createMutation.mutate({ body });
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  const textFields = [
    { key: "name" as const, label: t("nameLabel"), placeholder: t("namePlaceholder"), required: true },
    { key: "phone" as const, label: t("phoneLabel"), placeholder: t("phonePlaceholder"), required: true, type: "tel" },
    { key: "address_detail" as const, label: t("detailLabel"), placeholder: t("detailPlaceholder"), required: true },
    { key: "address_reference" as const, label: t("referenceLabel"), placeholder: t("referencePlaceholder") },
    { key: "district" as const, label: t("districtLabel"), placeholder: t("districtPlaceholder"), required: true },
    { key: "city" as const, label: t("cityLabel"), placeholder: t("cityPlaceholder"), required: true },
    { key: "province" as const, label: t("provinceLabel"), placeholder: t("provincePlaceholder"), required: true },
    { key: "postal_code" as const, label: t("postalCodeLabel"), placeholder: t("postalCodePlaceholder"), required: true },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editTitle") : t("addTitle")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("editDescription") : t("addDescription")}
          </DialogDescription>
        </DialogHeader>
        {isEdit && detailLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#ffcf02] border-t-black" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            {textFields.map(({ key, label, placeholder, required, type }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-black">{label}</label>
                <Input
                  type={type ?? "text"}
                  value={form[key] ?? ""}
                  onChange={(e) => setField(key, e.target.value)}
                  placeholder={placeholder}
                  required={required}
                />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-black">{t("locationLabel")}</label>
              <MapPickerTrigger
                latitude={form.latitude}
                longitude={form.longitude}
                onConfirm={(lat, lng, resolved?: ResolvedAddress) => {
                  setField("latitude", lat);
                  setField("longitude", lng);
                  if (resolved) {
                    if (resolved.address_detail) setField("address_detail", resolved.address_detail);
                    if (resolved.district) setField("district", resolved.district);
                    if (resolved.city) setField("city", resolved.city);
                    if (resolved.province) setField("province", resolved.province);
                    if (resolved.postal_code) setField("postal_code", resolved.postal_code);
                  }
                }}
              />
              <p className="text-xs text-[#727272]">
                {t("locationHint")}
              </p>
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
                {isPending ? t("saving") : isEdit ? t("updateButton") : t("addButton")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
