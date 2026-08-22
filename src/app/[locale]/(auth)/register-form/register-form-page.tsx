"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { CircleCheck, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { AuthField } from "../_components/auth-field";
import { useMutate } from "@/lib/query";
import { establishSession } from "@/lib/auth-session";
import type { RegisterBody, RegisterResponse } from "@/services/auth/types";

/**
 * Sibling surface to the login page, and deliberately identical to it in
 * everything but content: same yellow field, same flow lines, same 24px card on
 * a warm-tinted shadow, same 10px controls with the icon inside on the left.
 *
 * Radius scale, no exceptions: card and framed hero 24px, controls 10px, pill
 * only for the rule under the wordmark. Accent is #f90 for links and focus;
 * #ffcf02 is reserved for the page field and the single primary action. Red and
 * green appear only as validation state, never as decoration.
 */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* Four tiers, matching the four segments. The label matters as much as the
   colour: a bar that communicates only through hue fails WCAG 1.4.1 for anyone
   who cannot separate the reds from the greens. */
const STRENGTH_TIERS = [
  { min: 12, filled: 4, color: "bg-[#12b76a]", key: "strengthStrong" },
  { min: 10, filled: 3, color: "bg-[#eaaa08]", key: "strengthGood" },
  { min: 8, filled: 2, color: "bg-[#f79009]", key: "strengthFair" },
  { min: 0, filled: 1, color: "bg-[#d92d20]", key: "strengthWeak" },
] as const;

const strengthOf = (value: string) =>
  STRENGTH_TIERS.find((tier) => value.length >= tier.min) ?? STRENGTH_TIERS[3];

/** Stashed by the OTP step, consumed here. */
const REG_TOKEN_KEY = "bulky_reg_token";

interface RegisterFormPageProps {
  verifiedPhone?: string;
}

export default function RegisterFormPage({
  verifiedPhone = "",
}: RegisterFormPageProps) {
  const t = useTranslations("RegisterForm");
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const reduceMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const assets = useMemo(
    () => ({
      logo: "/assets/images/logo-bulky.webp",
      hero: "/assets/images/hero-register-form.webp",
    }),
    [],
  );

  // Guard the route: without a verified-OTP token there is nothing to submit.
  // The token itself is read at submit time rather than mirrored into state,
  // since it is never rendered and copying it in on mount was a setState-in-
  // effect cascade.
  useEffect(() => {
    if (!sessionStorage.getItem(REG_TOKEN_KEY)) router.replace("/register");
  }, [router]);

  const registerMutation = useMutate<RegisterResponse, RegisterBody>({
    endpoint: "/auth/register",
    method: "post",
    isPublic: true,
    onSuccess: async (data) => {
      const authToken = data.data.data?.token;
      if (authToken && (await establishSession(authToken))) {
        sessionStorage.removeItem(REG_TOKEN_KEY);
        window.location.href = `/${locale}`;
      }
    },
    onError: { title: "REGISTER" },
  });

  function validateEmail(value: string): string | null {
    if (!value) return null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return t("errors.emailInvalid");
    return null;
  }

  function validatePassword(value: string): string | null {
    if (!value) return t("errors.passwordRequired");
    if (value.length < 8) return t("errors.passwordMin");
    return null;
  }

  function validate(): boolean {
    const next: typeof errors = {};

    if (!name.trim()) next.name = t("errors.nameRequired");
    if (!verifiedPhone.trim()) next.phone = t("errors.phoneRequired");

    const emailErr = validateEmail(email);
    if (emailErr) next.email = emailErr;

    const passErr = validatePassword(password);
    if (passErr) next.password = passErr;

    if (!confirmPassword) {
      next.confirmPassword = t("errors.confirmPasswordRequired");
    } else if (confirmPassword !== password) {
      next.confirmPassword = t("errors.confirmPasswordMismatch");
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});
    registerMutation.mutate({
      body: {
        name,
        token: sessionStorage.getItem(REG_TOKEN_KEY) ?? "",
        password,
        confirm_password: confirmPassword,
        email: email || undefined,
      },
    });
  }

  // One entry transition, staggered brand-then-form so the reading order is
  // established on a page users always land on cold. Collapses to static under
  // prefers-reduced-motion.
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 16 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.5, delay, ease: EASE },
  });

  const strength = strengthOf(password);
  const showStrength = password.length > 0 && !errors.password;

  const eyeButton = (shown: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute top-1/2 right-3 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-[#757575] transition-colors hover:text-[#1f1f1f]"
      aria-label={shown ? t("hidePassword") : t("showPassword")}
    >
      {shown ? (
        <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} />
      ) : (
        <Eye className="h-[18px] w-[18px]" strokeWidth={2} />
      )}
    </button>
  );

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#ffcf02]">
      <Image
        src="/assets/images/bg-banner-default-new.webp"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover select-none"
      />

      <section className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-y-8 px-5 py-10 md:px-8 lg:min-h-[100dvh] lg:grid-cols-[1fr_380px] lg:gap-x-10 lg:pl-12 xl:gap-x-16">
        {/* Brand column. The warehouse shot is a rectangular photo rather than a
            cutout like the login couriers, so it sits in a framed panel on the
            card's radius instead of standing on the yellow. */}
        <motion.div {...enter(0)} className="flex flex-col">
          <div className="text-center lg:pl-2 lg:text-left">
            <p className="text-[22px] leading-tight font-medium text-white drop-shadow-[0_1px_6px_rgba(150,100,0,0.3)] sm:text-[26px] lg:text-[30px]">
              {t("welcomePrefix")}
            </p>
            <p className="mt-1 text-[44px] leading-[0.98] font-extrabold tracking-[-0.02em] text-white drop-shadow-[0_2px_10px_rgba(150,100,0,0.32)] sm:text-[56px] lg:text-[64px]">
              Bulky.id
            </p>
            <span className="mx-auto mt-4 block h-[5px] w-[86px] rounded-full bg-white lg:mx-0" />
          </div>

          <div className="relative mt-8 hidden aspect-[700/637] w-full max-w-[560px] overflow-hidden rounded-[24px] shadow-[0_24px_60px_-20px_rgba(122,84,0,0.45)] lg:block lg:max-h-[52dvh] xl:max-w-[620px]">
            <Image
              src={assets.hero}
              alt={t("heroAlt")}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 620px, (min-width: 1024px) 560px, 0px"
              priority
            />
          </div>
        </motion.div>

        {/* Form column */}
        <motion.div
          {...enter(0.08)}
          className="mx-auto w-full max-w-[380px] lg:mx-0 lg:py-10"
        >
          <div className="flex w-full flex-col rounded-[24px] bg-white px-7 pt-8 pb-8 shadow-[0_24px_60px_-20px_rgba(122,84,0,0.45)]">
            <Image
              src={assets.logo}
              alt="Bulky"
              width={156}
              height={37}
              className="mx-auto mb-7 h-auto w-[140px] object-contain"
              priority
            />

            <h1 className="text-[26px] leading-tight font-extrabold tracking-[-0.015em] text-[#1f1f1f]">
              {t("title")}
            </h1>
            <p className="mt-2 text-[13px] leading-snug text-[#4a4a4a]">
              {t("subtitle")}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex w-full flex-col gap-4"
              noValidate
            >
              <AuthField
                id="name"
                type="text"
                autoComplete="name"
                label={t("nameLabel")}
                icon={<User className="h-4 w-4" strokeWidth={2} />}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder={t("namePlaceholder")}
                required
                error={errors.name}
              />

              <AuthField
                id="phone"
                type="tel"
                label={t("phoneLabel")}
                icon={<Phone className="h-4 w-4" strokeWidth={2} />}
                value={verifiedPhone}
                readOnly
                required
                error={errors.phone}
                hint={t("phoneVerifiedHint")}
                className="cursor-not-allowed bg-[#fafafa] pr-28 text-[#4a4a4a]"
                trailing={
                  <span className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 text-[11px] font-semibold text-[#12b76a]">
                    <CircleCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
                    {t("verified")}
                  </span>
                }
              />

              <AuthField
                id="email"
                type="email"
                autoComplete="email"
                label={t("emailLabel")}
                icon={<Mail className="h-4 w-4" strokeWidth={2} />}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder={t("emailPlaceholder")}
                error={errors.email}
              />

              <AuthField
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                label={t("passwordLabel")}
                icon={<Lock className="h-4 w-4" strokeWidth={2} />}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password || errors.confirmPassword)
                    setErrors((prev) => ({
                      ...prev,
                      password: undefined,
                      confirmPassword: undefined,
                    }));
                }}
                placeholder={t("passwordPlaceholder")}
                required
                error={errors.password}
                className="pr-11"
                trailing={eyeButton(showPass, () => setShowPass((v) => !v))}
              >
                {showStrength && (
                  <div className="mt-1 flex items-center gap-2">
                    <div
                      className="flex flex-1 gap-1"
                      role="img"
                      aria-label={`${t("strengthLabel")}: ${t(strength.key)}`}
                    >
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i < strength.filled ? strength.color : "bg-[#ececec]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-[#757575]">
                      {t(strength.key)}
                    </span>
                  </div>
                )}
              </AuthField>

              <AuthField
                id="confirmPassword"
                type={showConfirmPass ? "text" : "password"}
                autoComplete="new-password"
                label={t("confirmPasswordLabel")}
                icon={<Lock className="h-4 w-4" strokeWidth={2} />}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                }}
                placeholder={t("confirmPasswordPlaceholder")}
                required
                error={errors.confirmPassword}
                className="pr-11"
                trailing={eyeButton(showConfirmPass, () =>
                  setShowConfirmPass((v) => !v),
                )}
              />

              {errors.general && (
                <p
                  role="alert"
                  className="rounded-[10px] border border-[#fecdca] bg-[#fffbfa] px-3 py-2 text-[12px] leading-snug text-[#b42318]"
                >
                  {errors.general}
                </p>
              )}

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="mt-1 h-11 w-full rounded-[10px] bg-[#ffcf02] text-[14px] font-bold text-[#1f1f1f] transition-[background-color,transform] hover:bg-[#f5c500] active:translate-y-px active:bg-[#e8b900] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {registerMutation.isPending ? t("processing") : t("submit")}
              </Button>

              <p className="text-center text-[11px] leading-[18px] text-[#757575]">
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
              </p>
            </form>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
