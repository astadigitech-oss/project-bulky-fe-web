"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutate } from "@/lib/query";
import type { RegisterRequestOtpBody, RegisterRequestOtpResponse } from "@/services/auth/types";

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

function OrDivider({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex-1 border-t border-[#727272]/40" />
      <span className="text-xs text-[#727272]">{label}</span>
      <div className="flex-1 border-t border-[#727272]/40" />
    </div>
  );
}

type SocialButtonProps = {
  iconSrc?: string;
  iconAlt: string;
  label: string;
  onClick?: () => void;
};

function SocialButton({ iconSrc, iconAlt, label, onClick }: SocialButtonProps) {
  const [iconFailed, setIconFailed] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      className="h-[39px] w-full justify-center gap-2 rounded-lg border-[#727272]/60 bg-white text-sm font-bold text-black hover:bg-gray-50"
      onClick={onClick}
    >
      {iconSrc && !iconFailed ? (
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={22}
          height={22}
          className="h-[22px] w-[22px] object-contain"
          onError={() => setIconFailed(true)}
        />
      ) : (
        <span className="grid h-[22px] w-[22px] place-items-center rounded-sm border border-dashed border-black/20 text-[9px] text-black/50">
          {iconAlt.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span>{label}</span>
    </Button>
  );
}

export default function RegisterPage() {
  const t = useTranslations("Register");
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assets = useMemo(
    () => ({
      container: "/assets/images/register-container.svg",
      people: "/assets/images/register-people.svg",
      logo: "/assets/images/logo-bulky.webp",
      looperLeft: "/assets/images/Looper-kiri.svg",
      looperRight: "/assets/images/Looper-kanan.svg",
      google: "/assets/images/login-google.svg",
    }),
    [],
  );

  const requestOtpMutation = useMutate<RegisterRequestOtpResponse, RegisterRequestOtpBody>({
    endpoint: "/auth/register/request-otp",
    method: "post",
    isPublic: true,
    onSuccess: () => {
      sessionStorage.setItem("bulky_otp_phone", phone);
      const query = phone ? `?phone=${encodeURIComponent(phone)}` : "";
      router.push(`/otp${query}`);
    },
    onError: { title: "REGISTER_REQUEST_OTP" },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError(t("errors.mustAgree"));
      return;
    }
    setError(null);
    requestOtpMutation.mutate({ body: { phone } });
  }

  function handleGoogleRegister() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    const redirectUri = `${window.location.origin}/oauth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "email profile",
      access_type: "offline",
      prompt: "consent",
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#ffcf02] px-5 py-8 md:px-10">
      <AssetWithFallback
        src={assets.looperLeft}
        alt=""
        width={902}
        height={768}
        placeholderLabel="Looper kiri"
        className="pointer-events-none absolute left-0 top-0 h-screen w-auto select-none opacity-80"
      />

      <AssetWithFallback
        src={assets.looperRight}
        alt=""
        width={684}
        height={768}
        placeholderLabel="Looper kanan"
        className="pointer-events-none absolute right-0 top-0 h-screen w-auto select-none opacity-80"
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
          <Link
            href="/"
            className="absolute right-[22px] top-[25px]"
            aria-label={t("close")}
          >
            <X className="h-[22px] w-[22px] text-black/70" />
          </Link>

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

          <div className="mb-[24px] flex w-full items-center gap-1">
            <span className="text-[14px] text-black">
              {t("alreadyHaveAccount")}
            </span>
            <Link
              href="/login"
              className="text-[14px] text-[#f90] hover:underline"
            >
              {t("login")}
            </Link>
          </div>

          <div className="mb-[16px] flex w-full flex-col gap-[10px]">
            <SocialButton
              iconSrc={assets.google}
              iconAlt="Google"
              label={t("registerWithGoogle")}
              onClick={handleGoogleRegister}
            />
          </div>

          <div className="mb-[16px] w-full">
            <OrDivider label={t("or")} />
          </div>

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

            {error && (
              <p className="mb-[10px] text-[12px] text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              disabled={requestOtpMutation.isPending}
              className="mb-[16px] h-[39px] w-full rounded-lg bg-[#ffcf02] text-[14px] leading-none font-bold text-black hover:bg-[#f5c800] active:bg-[#e8bb00]"
            >
              {requestOtpMutation.isPending ? t("processing") : t("submit")}
            </Button>

            <label className="flex cursor-pointer items-start gap-[8px]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-[3px] shrink-0 accent-[#f90]"
              />
              <p className="text-[12px] leading-[20px] text-black">
                {t("termsPrefix")}{" "}
                <Link
                  href="/syarat-ketentuan"
                  className="text-[#f90] hover:underline"
                >
                  {t("terms")}
                </Link>{" "}
                {t("and")}{" "}
                <Link
                  href="/kebijakan-privasi"
                  className="text-[#f90] hover:underline"
                >
                  {t("privacy")}
                </Link>
              </p>
            </label>
          </form>
        </div>
      </section>
    </main>
  );
}
