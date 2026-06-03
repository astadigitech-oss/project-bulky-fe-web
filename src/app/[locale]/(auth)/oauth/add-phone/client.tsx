"use client";

import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useMemo, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutate } from "@/lib/query";
import type { GoogleRequestOtpResponse } from "@/services/auth/types";

type AssetWithFallbackProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  placeholderLabel: string;
};

function AssetWithFallback({
  src,
  alt,
  width,
  height,
  className,
  priority,
  sizes,
  placeholderLabel,
}: AssetWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`grid place-items-center rounded-md border border-dashed border-black/20 bg-black/5 text-center text-xs text-black/50 ${className ?? ""}`}
      >
        <span>{placeholderLabel}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}

export default function OAuthAddPhoneClient() {
  const t = useTranslations("OAuthAddPhone");
  const router = useRouter();
  const oauthTokenRef = useRef<string | null>(null);
  const [phone, setPhone] = useState("");

  const assets = useMemo(
    () => ({
      container: "/assets/images/register-container.svg",
      people: "/assets/images/register-people.svg",
      logo: "/assets/images/logo-bulky.webp",
      looperLeft: "/assets/images/Looper-kiri.svg",
      looperRight: "/assets/images/Looper-kanan.svg",
    }),
    [],
  );

  useEffect(() => {
    const token = sessionStorage.getItem("bulky_oauth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    oauthTokenRef.current = token;
  }, [router]);

  const requestOtpMutation = useMutate<
    GoogleRequestOtpResponse,
    { pending_oauth_token: string; telepon: string }
  >({
    endpoint: "/auth/oauth/request-otp",
    method: "post",
    isPublic: true,
    onSuccess: () => {
      router.push(`/oauth/verify-otp?phone=${encodeURIComponent(phone)}`);
    },
    onError: { title: "OAUTH_REQUEST_OTP" },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = oauthTokenRef.current;
    if (!token) return;
    requestOtpMutation.mutate({ body: { pending_oauth_token: token, telepon: phone } });
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#ffcf02] px-5 py-8 md:px-10">
      <AssetWithFallback
        src={assets.looperLeft}
        alt=""
        width={902}
        height={768}
        placeholderLabel="Looper kiri"
        className="pointer-events-none absolute left-0 top-1/2 h-auto w-[52vw] min-w-[700px] -translate-y-1/2 select-none opacity-80"
      />

      <AssetWithFallback
        src={assets.looperRight}
        alt=""
        width={684}
        height={768}
        placeholderLabel="Looper kanan"
        className="pointer-events-none absolute right-0 top-1/2 h-auto w-[40vw] min-w-[520px] -translate-y-1/2 select-none opacity-80"
      />

      <div className="pointer-events-none absolute left-0 bottom-0 z-0 hidden h-[740px] w-[980px] lg:block">
        <AssetWithFallback
          src={assets.container}
          alt=""
          width={926}
          height={579}
          placeholderLabel="Container background"
          className="absolute left-0 bottom-0 h-auto w-[900px] object-contain"
          sizes="900px"
          priority
        />

        <AssetWithFallback
          src={assets.people}
          alt={t("heroAlt")}
          width={542}
          height={725}
          placeholderLabel="People foreground"
          className="absolute left-[120px] bottom-0 h-auto w-[500px] object-contain"
          sizes="500px"
          priority
        />
      </div>

      <section className="relative z-10 flex w-full max-w-[1366px] items-center justify-center lg:justify-end lg:px-[146px]">
        <div className="relative flex w-full max-w-[365px] flex-col items-center rounded-[20px] bg-white px-[26px] pb-[32px] pt-[36px] shadow-sm [font-family:Roboto,Arial,sans-serif]">
          <AssetWithFallback
            src={assets.logo}
            alt="Bulky"
            width={156}
            height={37}
            placeholderLabel="Logo"
            className="mb-[20px] h-[37px] w-auto object-contain"
          />

          <h1 className="mb-[6px] w-full text-[30px] leading-none font-bold tracking-[-0.01em] text-[#222]">
            {t("title")}
          </h1>

          <p className="mb-[24px] w-full text-[14px] leading-[1.6] text-black">
            {t("description")}
          </p>

          <form onSubmit={handleSubmit} className="flex w-full flex-col">
            <div className="mb-[16px] flex flex-col gap-[6px]">
              <label
                htmlFor="phone"
                className="text-[14px] leading-none font-semibold text-[#727272]"
              >
                {t("phoneLabel")}
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("phonePlaceholder")}
                required
                className="h-[39px] rounded-lg border-[#f90] px-[12px] text-[16px] font-light text-[#727272] placeholder:text-[#9a9a9a] focus-visible:border-[#f90]"
              />
            </div>

            <Button
              type="submit"
              disabled={requestOtpMutation.isPending}
              className="h-[39px] w-full rounded-lg bg-[#ffcf02] text-[14px] leading-none font-bold text-black hover:bg-[#f5c800] active:bg-[#e8bb00]"
            >
              {requestOtpMutation.isPending ? t("processing") : t("submit")}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
