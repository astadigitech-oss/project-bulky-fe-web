"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";
import { setCookie } from "cookies-next/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useMutate } from "@/lib/query";
import { cookiesKey } from "@/config";
import type { LoginBody, LoginResponse } from "@/services/auth/types";
import { useSession } from "@/providers/session-provider";

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
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
};

function SocialButton({
  iconSrc,
  iconAlt,
  icon,
  label,
  onClick,
}: SocialButtonProps) {
  const [iconFailed, setIconFailed] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      className="h-[39px] w-full justify-center gap-2 border-[#727272]/60 bg-white text-sm font-bold text-black hover:bg-gray-50"
      onClick={onClick}
    >
      {icon ? (
        <span className="grid h-[22px] w-[22px] place-items-center">
          {icon}
        </span>
      ) : iconSrc && !iconFailed ? (
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

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useParams<{ locale: string }>();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const { isAuthenticated } = useSession();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const loginMutation = useMutate<LoginResponse, LoginBody>({
    endpoint: "/auth/login",
    method: "post",
    isPublic: true,
    onSuccess: (data) => {
      const token = data.data.data?.token;
      if (token) {
        setCookie(cookiesKey, token, { path: "/" });
        window.location.href = `/${locale}`;
      }
    },
    onError: { title: "LOGIN" },
  });

  const loginReason = searchParams.get("reason");
  const action = searchParams.get("action");

  const loginMessage =
    loginReason === "auth-required"
      ? action === "buy-now"
        ? t("authRequiredBuyNow")
        : action === "add-to-cart"
          ? t("authRequiredAddToCart")
          : t("authRequired")
      : null;

  const assets = useMemo(
    () => ({
      hero: "/assets/images/hero-login.svg",
      logo: "/assets/images/logo-bulky.webp",
      looperLeft: "/assets/images/Looper-kiri.svg",
      looperRight: "/assets/images/Looper-kanan.svg",
      google: "/assets/images/login-google.svg",
    }),
    [],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    loginMutation.mutate({ body: { phone, password, remember_me: true } });
  }

  function handleGoogleLogin() {
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

      <section className="relative z-10 flex w-full max-w-[1366px] items-center justify-center gap-12 lg:justify-between lg:px-[146px]">
        <div className="hidden lg:block">
          <AssetWithFallback
            src={assets.hero}
            alt="Dua orang memegang kardus"
            width={537}
            height={537}
            placeholderLabel="Hero image"
            className="h-[537px] w-auto rounded-xl object-cover"
            sizes="(min-width: 1024px) 537px, 0px"
            priority
          />
        </div>

        <div className="relative flex w-full max-w-[365px] flex-col items-center rounded-[20px] bg-white px-[26px] pb-[40px] pt-[36px] shadow-sm [font-family:Roboto,Arial,sans-serif]">
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
            className="mb-[20px] h-auto w-[156px] object-contain"
          />

          <h1 className="mb-[6px] w-full text-[30px] leading-none font-bold tracking-[-0.01em] text-[#222]">
            {t("title")}
          </h1>

          <div className="mb-[24px] flex w-full items-center gap-1">
            <span className="text-[14px] text-black">{t("noAccount")}</span>
            <Link href="/register" className="text-[14px] text-[#f90] hover:underline">
              {t("register")}
            </Link>
          </div>

          {loginMessage && (
            <div className="mb-4 w-full rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
              {loginMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex w-full flex-col">
            <div className="mb-[20px] flex flex-col gap-[6px]">
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
                className="h-[39px] rounded border-[#f90] px-[12px] text-[16px] font-light text-[#727272] placeholder:text-[#9a9a9a] focus-visible:border-[#f90]"
              />
            </div>

            <div className="mb-[10px] flex flex-col gap-[6px]">
              <label
                htmlFor="password"
                className="text-[14px] leading-none font-semibold text-[#727272]"
              >
                {t("passwordLabel")}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  required
                  className="h-[39px] rounded border-[#f90] px-[12px] pr-[40px] text-[16px] font-light text-[#727272] placeholder:text-[#9a9a9a] focus-visible:border-[#f90]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-black/60"
                  aria-label={showPass ? t("hidePassword") : t("showPassword")}
                >
                  {showPass ? (
                    <EyeOff className="h-[16px] w-[20px]" />
                  ) : (
                    <Eye className="h-[16px] w-[20px]" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-[24px] flex justify-end">
              <Link
                href="/forgot-password"
                className="text-[12px] leading-none font-normal text-[#f90] hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="mb-[16px] h-[39px] w-full rounded-lg bg-[#ffcf02] text-[14px] leading-none font-bold text-black hover:bg-[#f5c800] active:bg-[#e8bb00]"
            >
              {loginMutation.isPending ? t("processing") : t("submit")}
            </Button>

            <div className="mb-[16px]">
              <OrDivider label={t("or")} />
            </div>

            <div className="mb-[10px]">
              <SocialButton
                iconSrc={assets.google}
                iconAlt="Google"
                label={t("loginWithGoogle")}
                onClick={handleGoogleLogin}
              />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
