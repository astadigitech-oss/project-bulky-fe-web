"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { AuthField } from "../_components/auth-field";
import { useMutate } from "@/lib/query";
import type {
  RegisterRequestOtpBody,
  RegisterRequestOtpResponse,
} from "@/services/auth/types";

/**
 * Sibling surface to the login page, and deliberately identical to it in
 * everything but content: same yellow field, same flow lines, same 24px card on
 * a warm-tinted shadow, same 10px controls with the icon inside on the left.
 *
 * Radius scale, no exceptions: card 24px, controls 10px, pill only for the rule
 * under the wordmark. Accent is #f90 for links, focus and the checkbox; #ffcf02
 * is reserved for the page field and the single primary action.
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

export default function RegisterPage() {
  const t = useTranslations("Register");
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assets = useMemo(
    () => ({
      container: "/assets/images/register-container.svg",
      people: "/assets/images/register-people.svg",
      logo: "/assets/images/logo-bulky.webp",
      google: "/assets/images/login-google.svg",
    }),
    [],
  );

  const requestOtpMutation = useMutate<
    RegisterRequestOtpResponse,
    RegisterRequestOtpBody
  >({
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

  // One entry transition, staggered brand-then-form so the reading order is
  // established on a page users always land on cold. Collapses to static under
  // prefers-reduced-motion.
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 16 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.5, delay, ease: EASE },
  });

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#ffcf02]">
      <Image
        src="/assets/images/bg-banner-default-new.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover select-none"
      />

      <section className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-y-8 px-5 py-10 md:px-8 lg:min-h-[100dvh] lg:grid-cols-[1fr_380px] lg:gap-x-10 lg:py-0 lg:pl-12 xl:gap-x-12">
        {/* Brand column. Bottom-aligned on desktop so the staff stand on the
            viewport floor, the way the couriers do on the login page. */}
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

          {/* Two stacked cutouts standing on the same floor. Sizing is driven
              by the wrapper's HEIGHT, not width: the people define 100% and the
              container art is 84% as tall, which is the ratio the two pieces
              were drawn at. The wrapper's width then follows from the in-flow
              container art (`w-fit`), so the people stay planted at the same
              spot on the containers at every viewport size.

              That also means height is what has to be capped against the
              available WIDTH, or the wrapper blows out the `1fr` grid track and
              shoves the card off screen. The container art renders 1.3435x as
              wide as the wrapper is tall (0.84 * 926/579), and the brand column
              gets `100vw - 500px` below 1280 and a fixed 772px above it, hence:
                - 74.4vw - 372px  ->  the width limit, (100vw - 500px) / 1.3435
                - 570px           ->  the same limit at the capped 1280 container
                - 66dvh           ->  so a short viewport shrinks it instead of
                                      pushing the card below the fold */}
          <div className="relative mt-6 hidden w-fit items-end lg:flex lg:h-[min(66dvh,570px,74.4vw_-_372px)]">
            <AssetWithFallback
              src={assets.container}
              alt=""
              width={926}
              height={579}
              placeholderLabel=""
              className="h-[84%] w-auto max-w-none object-contain select-none"
              sizes="(min-width: 1024px) 780px, 0px"
              priority
            />
            <AssetWithFallback
              src={assets.people}
              alt={t("heroAlt")}
              width={542}
              height={725}
              placeholderLabel="Hero"
              className="absolute bottom-0 left-[13.3%] h-full w-auto max-w-none object-contain select-none"
              sizes="(min-width: 1024px) 440px, 0px"
              priority
            />
          </div>
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
              <span className="text-[#4a4a4a]">{t("alreadyHaveAccount")}</span>
              <Link
                href="/login"
                className="font-semibold text-[#f90] underline-offset-2 hover:underline"
              >
                {t("login")}
              </Link>
            </div>

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

              {/* Consent sits ABOVE the button it gates. Below it, the user is
                  asked to agree to something after the action that depends on
                  the agreement. */}
              <label className="mt-4 flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (e.target.checked) setError(null);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-[4px] accent-[#f90]"
                />
                <span className="text-[12px] leading-[18px] text-[#4a4a4a]">
                  {t("termsPrefix")}{" "}
                  <Link
                    href="/syarat-ketentuan"
                    className="font-semibold text-[#f90] underline-offset-2 hover:underline"
                  >
                    {t("terms")}
                  </Link>{" "}
                  {t("and")}{" "}
                  <Link
                    href="/kebijakan-privasi"
                    className="font-semibold text-[#f90] underline-offset-2 hover:underline"
                  >
                    {t("privacy")}
                  </Link>
                </span>
              </label>

              {error && (
                <p
                  role="alert"
                  className="mt-3 rounded-[10px] border border-[#fecdca] bg-[#fffbfa] px-3 py-2 text-[12px] leading-snug text-[#b42318]"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={requestOtpMutation.isPending}
                className="mt-5 h-11 w-full rounded-[10px] bg-[#ffcf02] text-[14px] font-bold text-[#1f1f1f] transition-[background-color,transform] hover:bg-[#f5c500] active:translate-y-px active:bg-[#e8b900] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {requestOtpMutation.isPending ? t("processing") : t("submit")}
              </Button>

              <div className="my-4">
                <OrDivider label={t("or")} />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleRegister}
                className="h-11 w-full justify-center gap-2.5 rounded-[10px] border-[#e4e4e4] bg-white text-[14px] font-semibold text-[#1f1f1f] transition-[background-color,transform] hover:bg-[#f7f7f7] active:translate-y-px"
              >
                <Image
                  src={assets.google}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
                {t("registerWithGoogle")}
              </Button>
            </form>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
