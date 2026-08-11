"use client";

import Image from "next/image";
import NextLink from "next/link";
import { Link, useRouter } from "@/i18n/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Eye, EyeOff, KeyRound, Lock, Phone, X } from "lucide-react";
import { setCookie } from "cookies-next/client";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { AuthField } from "../_components/auth-field";
import { BrandFlowField } from "../_components/brand-flow-field";
import { useTranslations } from "next-intl";
import { useMutate } from "@/lib/query";
import { cookiesKey } from "@/config";
import type { LoginBody, LoginResponse } from "@/services/auth/types";
import { useSession } from "@/providers/session-provider";

/**
 * The auth screen is a brand surface: it stays on the yellow/light palette in
 * both colour schemes on purpose, so no `dark:` variants here.
 *
 * Radius scale, applied everywhere on this page with no exceptions:
 *   card    -> 24px
 *   control -> 10px (inputs, buttons, banner)
 *   pill    -> full (only the accent rule under the wordmark)
 *
 * Accent is #f90 for every link and focus ring; #ffcf02 is reserved for the
 * page field and the single primary action.
 */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
    // Decorative assets pass an empty label and just collapse silently.
    if (!placeholderLabel) return null;
    return (
      <div
        className={`grid place-items-center rounded-[10px] border border-dashed border-black/20 bg-black/5 text-center text-xs text-black/50 ${className ?? ""}`}
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
      <div className="h-px flex-1 bg-[#e4e4e4]" />
      <span className="text-[12px] font-medium text-[#757575]">{label}</span>
      <div className="h-px flex-1 bg-[#e4e4e4]" />
    </div>
  );
}

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useParams<{ locale: string }>();
  const reduceMotion = useReducedMotion();

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
      hero: "/assets/images/hero-login.png",
      logo: "/assets/images/logo-bulky.webp",
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

  // One entry transition, staggered brand-then-form so the reading order is
  // established on a page users always land on cold. Collapses to static
  // under prefers-reduced-motion.
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 16 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.5, delay, ease: EASE },
  });

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#ffcf02]">
      <BrandFlowField />

      <section className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-y-8 px-5 py-10 md:px-8 lg:min-h-[100dvh] lg:grid-cols-[1fr_380px] lg:gap-x-10 lg:py-0 lg:pl-12 xl:gap-x-16">
        {/* Brand column. Bottom-aligned on desktop so the couriers stand on the
            viewport floor, the way they sit on the reference banner. */}
        <motion.div
          {...enter(0)}
          className="flex flex-col lg:self-stretch lg:justify-end lg:pt-14"
        >
          <div className="text-center lg:pl-2 lg:text-left">
            <p className="text-[22px] leading-tight font-medium text-white drop-shadow-[0_1px_6px_rgba(150,100,0,0.3)] sm:text-[26px] lg:text-[30px]">
              {t("welcomePrefix")}
            </p>
            <p className="mt-1 text-[44px] leading-[0.98] font-extrabold tracking-[-0.02em] text-white drop-shadow-[0_2px_10px_rgba(150,100,0,0.32)] sm:text-[56px] lg:text-[64px]">
              Bulky.id
            </p>
            <span className="mx-auto mt-4 block h-[5px] w-[86px] rounded-full bg-white lg:mx-0" />
          </div>

          <AssetWithFallback
            src={assets.hero}
            alt={t("heroAlt")}
            width={1620}
            height={1136}
            placeholderLabel="Hero"
            className="mt-5 hidden h-auto w-full max-w-[760px] object-contain object-bottom select-none lg:block lg:max-h-[64dvh] xl:max-w-[830px]"
            sizes="(min-width: 1280px) 830px, (min-width: 1024px) 760px, 0px"
            priority
          />
        </motion.div>

        {/* Form column */}
        <motion.div
          {...enter(0.08)}
          className="mx-auto w-full max-w-[380px] lg:mx-0 lg:py-10"
        >
          <div className="relative flex w-full flex-col rounded-[24px] bg-white px-7 pt-8 pb-8 shadow-[0_24px_60px_-20px_rgba(122,84,0,0.45)]">
            <Link
              href="/"
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full text-[#9a9a9a] transition-colors hover:bg-black/5 hover:text-[#1f1f1f]"
              aria-label={t("close")}
            >
              <X className="h-[18px] w-[18px]" strokeWidth={2} />
            </Link>

            <AssetWithFallback
              src={assets.logo}
              alt="Bulky"
              width={156}
              height={37}
              placeholderLabel="Logo"
              className="mx-auto mb-7 h-auto w-[140px] object-contain"
            />

            <h1 className="text-[26px] leading-none font-extrabold tracking-[-0.015em] text-[#1f1f1f]">
              {t("title")}
            </h1>

            <div className="mt-2 flex items-center gap-1 text-[13px]">
              <span className="text-[#4a4a4a]">{t("noAccount")}</span>
              <Link
                href="/register"
                className="font-semibold text-[#f90] underline-offset-2 hover:underline"
              >
                {t("register")}
              </Link>
            </div>

            {loginMessage && (
              <p
                role="status"
                className="mt-4 rounded-[10px] border border-[#ffe08a] bg-[#fffaeb] px-3 py-2 text-[12px] leading-snug text-[#7a5a00]"
              >
                {loginMessage}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex w-full flex-col">
              <AuthField
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                label={t("phoneLabel")}
                icon={<Phone className="h-4 w-4" strokeWidth={2} />}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("phonePlaceholder")}
                required
              />

              <div className="mt-4">
                <AuthField
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  label={t("passwordLabel")}
                  icon={<Lock className="h-4 w-4" strokeWidth={2} />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  required
                  className="pr-11"
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPass((prev) => !prev)}
                      className="absolute top-1/2 right-3 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-[#757575] transition-colors hover:text-[#1f1f1f]"
                      aria-label={
                        showPass ? t("hidePassword") : t("showPassword")
                      }
                    >
                      {showPass ? (
                        <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" strokeWidth={2} />
                      )}
                    </button>
                  }
                />
              </div>

              <div className="mt-2.5 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-[12px] leading-none font-medium text-[#f90] underline-offset-2 hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="mt-5 h-11 w-full rounded-[10px] bg-[#ffcf02] text-[14px] font-bold text-[#1f1f1f] transition-[background-color,transform] hover:bg-[#f5c500] active:translate-y-px active:bg-[#e8b900] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loginMutation.isPending ? t("processing") : t("submit")}
              </Button>

              <div className="my-4">
                <OrDivider label={t("or")} />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="h-11 w-full justify-center gap-2.5 rounded-[10px] border-[#e4e4e4] bg-white text-[14px] font-semibold text-[#1f1f1f] transition-[background-color,transform] hover:bg-[#f7f7f7] active:translate-y-px"
              >
                <Image
                  src={assets.google}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
                {t("loginWithGoogle")}
              </Button>

            </form>

            {/* Separated from the primary login actions above by a divider and
                its own intro copy, so users coming from the old Bulky app (v1)
                understand *why* this button exists before they tap it, rather
                than mistaking it for a regular login shortcut. Plain anchor
                (not the locale-aware Link) because /recovery is a standalone
                route outside [locale], meant to be opened from the native
                app's WebView without a locale prefix. */}
            <div className="mt-6 border-t border-dashed border-[#e4e4e4] pt-5">
              <p className="text-[13px] font-semibold text-[#1f1f1f]">
                {t("recoverAccountHint")}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-[#757575]">
                {t("recoverAccountHintDesc")}
              </p>
              <NextLink
                href="/recovery"
                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#fff6e0] px-3 text-[13px] font-semibold whitespace-nowrap text-[#a06a00] transition-[background-color,transform] hover:bg-[#ffefc8] active:translate-y-px"
              >
                <KeyRound className="h-4 w-4 shrink-0" strokeWidth={2} />
                {t("recoverOldAccount")}
              </NextLink>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
