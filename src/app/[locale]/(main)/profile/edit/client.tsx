"use client";

import { useEffect, useRef, useState } from "react";
import {
  Edit3,
  Eye,
  EyeOff,
  LockKeyhole,
  MapPin,
  Plus,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next/client";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { UserAvatar } from "@/components/ui/avatar";
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
import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query";
import { invalidateQuery } from "@/lib/query/utils";
import { cookiesKey } from "@/config";
import { AddressFormDialog } from "@/components/address-form-dialog";

import type {
  Address,
  BaseProfileResponse,
  ChangePasswordBody,
  EmailVerifyOtpResponse,
  GetAddressesResponse,
  GetProfileResponse,
  PhoneVerifyOtpResponse,
  UploadPhotoResponse,
} from "@/services/profile/types";

// ─── Edit Info Dialog ─────────────────────────────────────────────────────────

function EditInfoDialog({
  open,
  onOpenChange,
  currentName,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onSuccess: () => void;
}) {
  const t = useTranslations("Profile");
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

  const mutation = useMutate<BaseProfileResponse, FormData>({
    endpoint: "/profile",
    method: "put",
    onSuccess: () => {
      toast.success(t("edit.saving"));
      onOpenChange(false);
      onSuccess();
    },
    onError: { title: "UPDATE_PROFILE" },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    mutation.mutate({ body: formData });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("editInfoDialog.title")}</DialogTitle>
          <DialogDescription>{t("editInfoDialog.description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="edit-name" className="text-sm font-medium text-black">
              {t("editInfoDialog.nameLabel")}
            </label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("editInfoDialog.namePlaceholder")}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-[#ffcf02] text-black shadow-none hover:bg-[#f0c300]"
              disabled={!name.trim() || mutation.isPending}
            >
              {mutation.isPending ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Change Phone Dialog ──────────────────────────────────────────────────────

function ChangePhoneDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const t = useTranslations("Profile.changePhoneDialog");
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  function handleClose(val: boolean) {
    if (!val) { setStep(1); setPhone(""); setOtp(""); }
    onOpenChange(val);
  }

  const updatePhoneMutation = useMutate<BaseProfileResponse, { token: string }>({
    endpoint: "/profile/phone",
    method: "patch",
    onSuccess: () => { handleClose(false); onSuccess(); },
    onError: { title: "UPDATE_PHONE" },
  });

  const verifyOtpMutation = useMutate<PhoneVerifyOtpResponse, { otp: string }>({
    endpoint: "/profile/phone/verify-otp",
    method: "post",
    onSuccess: (data) => {
      const token = data.data.data?.token;
      if (token) updatePhoneMutation.mutate({ body: { token } });
    },
    onError: { title: "VERIFY_OTP_PHONE" },
  });

  const requestOtpMutation = useMutate<BaseProfileResponse, { phone: string }>({
    endpoint: "/profile/phone/request-otp",
    method: "post",
    onSuccess: () => { setStep(2); },
    onError: { title: "REQUEST_OTP_PHONE" },
  });

  const isPending =
    requestOtpMutation.isPending || verifyOtpMutation.isPending || updatePhoneMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {step === 1 ? t("step1Description") : t("step2Description", { phone })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">{t("newPhoneLabel")}</label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("phonePlaceholder")} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleClose(false)} disabled={isPending}>{t("back")}</Button>
                <Button className="bg-[#ffcf02] text-black shadow-none hover:bg-[#f0c300]" onClick={() => requestOtpMutation.mutate({ body: { phone } })} disabled={!phone || isPending}>
                  {requestOtpMutation.isPending ? t("sending") : t("sendOtp")}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">{t("otpLabel")}</label>
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t("otpPlaceholder")} maxLength={6} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setOtp(""); setStep(1); }} disabled={isPending}>{t("back")}</Button>
                <Button className="bg-[#ffcf02] text-black shadow-none hover:bg-[#f0c300]" onClick={() => verifyOtpMutation.mutate({ body: { otp } })} disabled={!otp || isPending}>
                  {isPending ? t("verifying") : t("verify")}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Change Email Dialog ──────────────────────────────────────────────────────

function ChangeEmailDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const t = useTranslations("Profile.changeEmailDialog");
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  function handleClose(val: boolean) {
    if (!val) { setStep(1); setEmail(""); setOtp(""); }
    onOpenChange(val);
  }

  const updateEmailMutation = useMutate<BaseProfileResponse, { token: string }>({
    endpoint: "/profile/email",
    method: "patch",
    onSuccess: () => { handleClose(false); onSuccess(); },
    onError: { title: "UPDATE_EMAIL" },
  });

  const verifyOtpMutation = useMutate<EmailVerifyOtpResponse, { otp: string }>({
    endpoint: "/profile/email/verify-otp",
    method: "post",
    onSuccess: (data) => {
      const token = data.data.data?.token;
      if (token) updateEmailMutation.mutate({ body: { token } });
    },
    onError: { title: "VERIFY_OTP_EMAIL" },
  });

  const requestOtpMutation = useMutate<BaseProfileResponse, { email: string }>({
    endpoint: "/profile/email/request-otp",
    method: "post",
    onSuccess: () => { setStep(2); },
    onError: { title: "REQUEST_OTP_EMAIL" },
  });

  const isPending =
    requestOtpMutation.isPending || verifyOtpMutation.isPending || updateEmailMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {step === 1 ? t("step1Description") : t("step2Description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">{t("newEmailLabel")}</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleClose(false)} disabled={isPending}>{t("back")}</Button>
                <Button className="bg-[#ffcf02] text-black shadow-none hover:bg-[#f0c300]" onClick={() => requestOtpMutation.mutate({ body: { email } })} disabled={!email || isPending}>
                  {requestOtpMutation.isPending ? t("sending") : t("sendOtp")}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">{t("otpLabel")}</label>
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t("otpPlaceholder")} maxLength={6} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setOtp(""); setStep(1); }} disabled={isPending}>{t("back")}</Button>
                <Button className="bg-[#ffcf02] text-black shadow-none hover:bg-[#f0c300]" onClick={() => verifyOtpMutation.mutate({ body: { otp } })} disabled={!otp || isPending}>
                  {isPending ? t("verifying") : t("verify")}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Change Password Dialog ───────────────────────────────────────────────────

function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Profile.changePasswordDialog");
  const tc = useTranslations("Profile.common");
  const emptyFields: ChangePasswordBody = { old_password: "", new_password: "", confirm_new_password: "" };
  const [fields, setFields] = useState<ChangePasswordBody>(emptyFields);
  const [show, setShow] = useState({ old: false, new_: false, confirm: false });

  function handleClose(val: boolean) {
    if (!val) { setFields(emptyFields); setShow({ old: false, new_: false, confirm: false }); }
    onOpenChange(val);
  }

  const mutation = useMutate<BaseProfileResponse, ChangePasswordBody>({
    endpoint: "/profile/password",
    method: "patch",
    onSuccess: () => { handleClose(false); },
    onError: { title: "CHANGE_PASSWORD" },
  });

  const passwordFields = [
    { key: "old_password" as const, label: t("oldPassword"), showKey: "old" as const },
    { key: "new_password" as const, label: t("newPassword"), showKey: "new_" as const },
    { key: "confirm_new_password" as const, label: t("confirmPassword"), showKey: "confirm" as const },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ body: fields }); }} className="space-y-4 pt-2">
          {passwordFields.map(({ key, label, showKey }) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-black">{label}</label>
              <div className="relative">
                <Input
                  type={show[showKey] ? "text" : "password"}
                  value={fields[key]}
                  onChange={(e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={t("passwordPlaceholder")}
                  required
                  className="pr-10"
                />
                <button type="button" onClick={() => setShow((prev) => ({ ...prev, [showKey]: !prev[showKey] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50">
                  {show[showKey] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          ))}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={mutation.isPending}>{tc("cancel")}</Button>
            <Button type="submit" className="bg-[#ffcf02] text-black shadow-none hover:bg-[#f0c300]" disabled={mutation.isPending}>
              {mutation.isPending ? tc("saving") : tc("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Account Dialog ────────────────────────────────────────────────────

function DeleteAccountDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Profile.deleteAccountDialog");
  const tc = useTranslations("Profile.common");
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutate<BaseProfileResponse>({
    endpoint: "/profile",
    method: "delete",
    onSuccess: async () => {
      deleteCookie(cookiesKey, { path: "/" });
      queryClient.removeQueries({ queryKey: ["session"] });
      router.replace("/login");
    },
    onError: { title: "DELETE_ACCOUNT" },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>{tc("cancel")}</Button>
          <Button className="bg-red-500 text-white shadow-none hover:bg-red-600" onClick={() => mutation.mutate({})} disabled={mutation.isPending}>
            {mutation.isPending ? t("deleting") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Addresses Section ────────────────────────────────────────────────────────

function AddressesSection({
  addresses,
  onRefresh,
}: {
  addresses: Address[];
  onRefresh: () => void;
}) {
  const t = useTranslations("Profile.edit");
  const [addOpen, setAddOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  const setDefaultMutation = useMutate<BaseProfileResponse, undefined, { id: string }>({
    endpoint: "/addresses/:id/set-default",
    method: "patch",
    onSuccess: () => onRefresh(),
    onError: { title: "SET_DEFAULT_ADDRESS" },
  });

  const deleteMutation = useMutate<BaseProfileResponse, undefined, { id: string }>({
    endpoint: "/addresses/:id",
    method: "delete",
    onSuccess: () => onRefresh(),
    onError: { title: "DELETE_ADDRESS" },
  });

  return (
    <div>
      {addresses.length === 0 ? (
        <p className="text-sm text-[#727272]">{t("noAddress")}</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-lg border border-[#e0e0e0] p-4">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-black">
                    {addr.name}{" "}
                    {addr.is_default && (
                      <span className="ml-1 rounded bg-[#ffcf02] px-1.5 py-0.5 text-[10px] font-bold text-black">
                        {t("defaultBadge")}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-[#727272]">{addr.phone}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button type="button" variant="outline" className="h-8 gap-1 px-3 text-xs shadow-none hover:border-[#ffcf02] hover:bg-[#fff7cc]" onClick={() => setEditAddress(addr)}>
                    <Edit3 className="size-3" /> {t("editButton")}
                  </Button>
                  {!addr.is_default && (
                    <>
                      <Button type="button" variant="outline" className="h-8 gap-1 px-3 text-xs shadow-none hover:border-[#ffcf02] hover:bg-[#fff7cc]" disabled={setDefaultMutation.isPending} onClick={() => setDefaultMutation.mutate({ params: { id: addr.id } })}>
                        <Star className="size-3" /> {t("makeDefault")}
                      </Button>
                      <Button type="button" variant="outline" className="h-8 px-3 text-xs text-red-500 shadow-none hover:border-red-300 hover:bg-red-50 hover:text-red-500" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate({ params: { id: addr.id } })}>
                        <Trash2 className="size-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-black">{addr.formatted_address}</p>
            </div>
          ))}
        </div>
      )}

      <Button type="button" variant="outline" className="mt-4 h-9 gap-1.5 border-dashed text-sm text-[#727272] shadow-none hover:border-[#ffcf02] hover:bg-[#fff7cc] hover:text-black" onClick={() => setAddOpen(true)}>
        <Plus className="size-4" /> {t("addAddress")}
      </Button>

      <AddressFormDialog open={addOpen} onOpenChange={setAddOpen} onSuccess={() => { setAddOpen(false); onRefresh(); }} />
      <AddressFormDialog open={!!editAddress} onOpenChange={(val) => { if (!val) setEditAddress(null); }} addressId={editAddress?.id} onSuccess={() => { setEditAddress(null); onRefresh(); }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EditProfileClient() {
  const t = useTranslations("Profile.edit");
  const queryClient = useQueryClient();

  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [changePhoneOpen, setChangePhoneOpen] = useState(false);
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const uploadPhotoMutation = useMutate<UploadPhotoResponse>({ 
    endpoint: "/user/profile/upload-photo",
    method: "post",
    onSuccess: () => onProfileUpdated(),
    onError: { title: "Upload Foto" },
  });

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    uploadPhotoMutation.mutate({ body: formData as any });
    e.target.value = "";
  }

  const { data: profileData, isLoading: profileLoading } =
    useApiQuery<GetProfileResponse>({
      key: ["profile"],
      endpoint: "/profile",
    });

  const {
    data: addressesData,
    isLoading: addressesLoading,
    refetch: refetchAddresses,
  } = useApiQuery<GetAddressesResponse>({
    key: ["addresses"],
    endpoint: "/addresses",
  });

  const profile = profileData?.data;
  const addresses = addressesData?.data ?? [];

  async function onProfileUpdated() {
    await invalidateQuery(queryClient, [["profile"], ["session"]]);
  }

  async function onAddressesRefresh() {
    await invalidateQuery(queryClient, [["addresses"]]);
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div>
      <p className="mb-8 text-base text-[#727272]">{t("heading")}</p>

      {/* Avatar */}
      <div className="mb-9 flex items-center gap-8">
        <UserAvatar
          src={profile?.image}
          name={profile?.name ?? ""}
          isLoading={profileLoading}
          className="size-24"
          fallbackClassName="bg-[#f7f7f7] text-3xl font-bold text-black"
        />
        <div className="space-y-3">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <Button
            variant="outline"
            className="h-9 px-5 text-sm font-bold text-black shadow-none hover:border-[#ffcf02] hover:bg-[#fff7cc]"
            disabled={uploadPhotoMutation.isPending || profileLoading}
            onClick={() => photoInputRef.current?.click()}
          >
            {uploadPhotoMutation.isPending ? t("saving") : t("changePhoto")}
          </Button>
          <p className="whitespace-pre-line text-sm text-[#727272]">{t("photoHint")}</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Informasi Data Diri */}
        <section className="rounded-lg border border-[#727272cc] p-5">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 text-base font-bold text-black">
              <User className="size-4" /> {t("infoSection")}
            </h3>
            <Button variant="outline" className="h-9 px-4 text-sm font-bold shadow-none transition-colors hover:border-[#ffcf02] hover:bg-[#fff7cc] hover:text-black" onClick={() => setEditInfoOpen(true)} disabled={profileLoading}>
              <Edit3 className="size-4" /> {t("editButton")}
            </Button>
          </div>
          <dl className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              { label: t("fullName"), value: profile?.name },
              { label: t("email"), value: profile?.email },
              { label: t("phone"), value: profile?.phone },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-2">
                <dt className="text-base text-[#727272]">{label}</dt>
                <dd className="text-base text-black">
                  {profileLoading ? <span className="inline-block h-5 w-32 animate-pulse rounded bg-black/10" /> : (value ?? "—")}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Daftar Alamat */}
        <section className="rounded-lg border border-[#727272cc] p-5">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-base font-bold text-black">
              <MapPin className="size-4" /> {t("addressSection")}
            </h3>
          </div>
          {addressesLoading ? (
            <p className="text-sm text-[#727272]">{t("loadingAddresses")}</p>
          ) : (
            <AddressesSection addresses={addresses} onRefresh={onAddressesRefresh} />
          )}
        </section>

        {/* Pengaturan Akun */}
        <section className="rounded-lg border border-[#727272cc] p-5">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-base font-bold text-black">
              <LockKeyhole className="size-4" /> {t("accountSection")}
            </h3>
          </div>
          <dl className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              { label: t("linkedEmail"), value: profile?.email, onClick: () => setChangeEmailOpen(true) },
              { label: t("phoneNumber"), value: profile?.phone, onClick: () => setChangePhoneOpen(true) },
              { label: t("password"), value: "*************", onClick: () => setChangePasswordOpen(true) },
            ].map(({ label, value, onClick }) => (
              <div key={label} className="space-y-2">
                <dt className="text-base text-[#727272]">{label}</dt>
                <dd className="flex flex-wrap items-center gap-3">
                  <span className="text-base text-black">{value ?? "—"}</span>
                  <Button variant="outline" className="h-7 px-3 text-xs shadow-none hover:border-[#ffcf02] hover:bg-[#fff7cc]" onClick={onClick}>{t("changeButton")}</Button>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-5">
        <Button variant="outline" className="h-9 rounded px-6 text-sm font-bold text-red-500 shadow-none hover:border-red-300 hover:bg-red-50 hover:text-red-600" onClick={() => setDeleteAccountOpen(true)}>
          {t("deleteAccount")}
        </Button>
      </div>

      {/* Dialogs */}
      <EditInfoDialog
        open={editInfoOpen}
        onOpenChange={setEditInfoOpen}
        currentName={profile?.name ?? ""}
        onSuccess={onProfileUpdated}
      />
      <ChangePhoneDialog
        open={changePhoneOpen}
        onOpenChange={setChangePhoneOpen}
        onSuccess={onProfileUpdated}
      />
      <ChangeEmailDialog
        open={changeEmailOpen}
        onOpenChange={setChangeEmailOpen}
        onSuccess={onProfileUpdated}
      />
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
      <DeleteAccountDialog
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
      />
    </div>
  );
}
