"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutate } from "@/lib/query";
import type { ForgotRequestOtpBody, ForgotRequestOtpResponse } from "@/services/auth/types";

export default function ForgotPasswordClient() {
  const t = useTranslations("ForgotPassword");
  const router = useRouter();

  const [phone, setPhone] = useState("");

  const assets = useMemo(
    () => ({
      hero: "/assets/images/hero-login-forgot.webp",
      logo: "/assets/images/logo-bulky.webp",
      looperLeft: "/assets/images/Looper-kiri.svg",
      looperRight: "/assets/images/Looper-kanan.svg",
    }),
    [],
  );

  const requestOtpMutation = useMutate<ForgotRequestOtpResponse, ForgotRequestOtpBody>({
    endpoint: "/auth/forgot-password/request-otp",
    method: "post",
    isPublic: true,
    onSuccess: () => {
      const query = phone ? `?phone=${encodeURIComponent(phone)}` : "";
      router.push(`/forgot-password/verify-otp${query}`);
    },
    onError: { title: "FORGOT_PASSWORD_REQUEST_OTP" },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    requestOtpMutation.mutate({ body: { phone } });
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#ffcf02] px-5 py-8 md:px-10">
      <Image src={assets.looperLeft} alt="" width={902} height={768} className="pointer-events-none absolute left-0 top-0 h-screen w-auto select-none opacity-80" />
      <Image src={assets.looperRight} alt="" width={684} height={768} className="pointer-events-none absolute right-0 top-0 h-screen w-auto select-none opacity-80" />

      <section className="relative z-10 flex w-full max-w-[1366px] items-center justify-center gap-12 lg:justify-between lg:px-[146px]">
        <div className="hidden lg:block">
          <Image src={assets.hero} alt={t("heroAlt")} width={537} height={537} className="h-[537px] w-[537px] rounded-xl object-cover" sizes="(min-width: 1024px) 537px, 0px" priority />
        </div>

        <div className="relative flex w-full max-w-[420px] flex-col rounded-[20px] bg-white px-[26px] pb-[32px] pt-[36px] shadow-sm">
          <Image src={assets.logo} alt="Bulky" width={156} height={37} className="mb-[20px] h-[37px] w-auto object-contain" />
          <h1 className="mb-[8px] text-[30px] leading-none font-bold text-[#222]">{t("title")}</h1>
          <p className="mb-[20px] text-[14px] leading-[1.5] text-[#727272]">{t("description")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-[16px] flex flex-col gap-[6px]">
              <label htmlFor="phone" className="text-[14px] font-semibold text-[#727272]">{t("phoneLabel")}</label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("phonePlaceholder")} required className="h-[39px] rounded border-[#f90] px-[12px] text-[16px] font-light text-[#727272] placeholder:text-[#9a9a9a] focus-visible:border-[#f90]" />
            </div>

            <Button type="submit" disabled={requestOtpMutation.isPending} className="mb-[16px] h-[39px] w-full rounded-lg bg-[#ffcf02] text-[14px] font-bold text-black hover:bg-[#f5c800]">
              {requestOtpMutation.isPending ? t("processing") : t("submit")}
            </Button>

            <Link href="/login" className="text-center text-[13px] text-[#f90] hover:underline">{t("backToLogin")}</Link>
          </form>
        </div>
      </section>
    </main>
  );
}
