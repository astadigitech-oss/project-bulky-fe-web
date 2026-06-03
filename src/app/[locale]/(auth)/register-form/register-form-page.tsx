"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { setCookie } from "cookies-next/client";

import { useMutate } from "@/lib/query";
import { cookiesKey } from "@/config";
import type { RegisterBody, RegisterResponse } from "@/services/auth/types";

interface FormFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

function FormField({ id, label, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="text-[13px] font-bold text-[#727272]">
        {label}
      </label>
      {children}
    </div>
  );
}

interface RegisterFormPageProps {
  verifiedPhone?: string;
}

export default function RegisterFormPage({
  verifiedPhone = "",
}: RegisterFormPageProps) {
  const t = useTranslations("RegisterForm");
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [regToken, setRegToken] = useState("");

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
      looperLeft: "/assets/images/Looper-kiri.svg",
      looperRight: "/assets/images/Looper-kanan.svg",
      hero: "/assets/images/hero-register-form.svg",
    }),
    [],
  );

  // Read OTP token from sessionStorage (set after verify-otp)
  useEffect(() => {
    const token = sessionStorage.getItem("bulky_reg_token");
    if (!token) {
      router.replace("/register");
      return;
    }
    setRegToken(token);
  }, [router]);

  const registerMutation = useMutate<RegisterResponse, RegisterBody>({
    endpoint: "/auth/register",
    method: "post",
    isPublic: true,
    onSuccess: (data) => {
      const authToken = data.data.data?.token;
      if (authToken) {
        setCookie(cookiesKey, authToken, { path: "/" });
        sessionStorage.removeItem("bulky_reg_token");
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
    if (!verifiedPhone.trim()) next.phone = "Nomor telepon wajib diisi";

    const emailErr = validateEmail(email);
    if (emailErr) next.email = emailErr;

    const passErr = validatePassword(password);
    if (passErr) next.password = passErr;

    if (!confirmPassword) {
      next.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (confirmPassword !== password) {
      next.confirmPassword = "Konfirmasi password tidak sama";
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
        token: regToken,
        password,
        confirm_password: confirmPassword,
        email: email || undefined,
      },
    });
  }

  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#ffcf02] px-5 py-4 md:px-10 md:py-6 lg:px-0 lg:py-0">
      <Image
        src={assets.looperLeft}
        alt=""
        width={902}
        height={768}
        className="pointer-events-none absolute left-0 top-1/2 h-auto w-[52vw] min-w-[700px] -translate-y-1/2 select-none opacity-80"
      />
      <Image
        src={assets.looperRight}
        alt=""
        width={684}
        height={768}
        className="pointer-events-none absolute right-0 top-1/2 h-auto w-[40vw] min-w-[520px] -translate-y-1/2 select-none opacity-80"
      />

      <section className="relative z-10 flex h-full w-full items-center justify-center lg:mx-auto lg:h-[calc(100vh-40px)] lg:max-w-[1320px] lg:grid lg:grid-cols-[500px_1fr] lg:items-stretch lg:overflow-hidden lg:rounded-[20px]">
        <div className="flex h-[calc(100vh-32px)] w-full max-w-[492px] min-h-0 flex-col rounded-[20px] bg-white px-[26px] py-[28px] shadow-sm md:h-[calc(100vh-48px)] lg:h-full lg:max-w-none lg:rounded-none lg:px-[28px] lg:py-[24px]">
          <Image
            src={assets.logo}
            alt="Bulky"
            width={156}
            height={37}
            className="mb-[30px] h-[37px] w-auto object-contain"
            priority
          />

          <h1 className="mb-[18px] text-[24px] leading-tight font-bold text-[#222]">
            {t("title")}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto pr-1 pb-2"
            noValidate
          >
            <FormField id="name" label={t("nameLabel")}>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder={t("namePlaceholder")}
                required
                className={[
                  "h-[36px] rounded border px-[12px] text-[14px] font-light text-black",
                  "placeholder:text-[#727272] focus:outline-none focus:ring-1 transition-colors",
                  errors.name
                    ? "border-red-400 focus:ring-red-400"
                    : "border-[#f90] focus:ring-[#f90]",
                ].join(" ")}
              />
              {errors.name && (
                <p className="text-[12px] text-red-500">{errors.name}</p>
              )}
            </FormField>

            <FormField id="phone" label={t("phoneLabel")}>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  value={verifiedPhone}
                  readOnly
                  required
                  className={[
                    "h-[36px] w-full cursor-not-allowed rounded border bg-[#fffbf0] px-[12px] text-[14px] font-light text-black",
                    errors.phone ? "border-red-400" : "border-[#f90]",
                  ].join(" ")}
                />
                <span className="absolute right-[10px] top-1/2 flex -translate-y-1/2 items-center gap-[4px] text-[11px] font-bold text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-[13px] w-[13px]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("verified")}
                </span>
              </div>
              {errors.phone && (
                <p className="text-[12px] text-red-500">{errors.phone}</p>
              )}
              <p className="text-[11px] text-[#727272]">
                {t("phoneVerifiedHint")}
              </p>
            </FormField>

            <FormField id="email" label={t("emailLabel")}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder={t("emailPlaceholder")}
                className={[
                  "h-[36px] rounded border px-[12px] text-[14px] font-light text-black",
                  "placeholder:text-[#727272] focus:outline-none focus:ring-1 transition-colors",
                  errors.email
                    ? "border-red-400 focus:ring-red-400"
                    : "border-[#f90] focus:ring-[#f90]",
                ].join(" ")}
              />
              {errors.email && (
                <p className="text-[12px] text-red-500">{errors.email}</p>
              )}
            </FormField>

            <FormField id="password" label={t("passwordLabel")}>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
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
                  className={[
                    "h-[36px] w-full rounded border px-[12px] pr-[40px] text-[14px] font-light text-black",
                    "placeholder:text-[#727272] focus:outline-none focus:ring-1 transition-colors",
                    errors.password
                      ? "border-red-400 focus:ring-red-400"
                      : "border-[#f90] focus:ring-[#f90]",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2"
                  aria-label={showPass ? t("hidePassword") : t("showPassword")}
                >
                  {showPass ? (
                    <EyeOff className="h-[16px] w-[20px] text-[#727272]" />
                  ) : (
                    <Eye className="h-[16px] w-[20px] text-[#727272]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-red-500">{errors.password}</p>
              )}
              {password.length > 0 && !errors.password && (
                <div className="mt-[2px] flex gap-[4px]">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={[
                        "h-[3px] flex-1 rounded-full transition-colors",
                        password.length >= 12
                          ? "bg-green-500"
                          : password.length >= 10
                            ? i < 3
                              ? "bg-yellow-400"
                              : "bg-[#d9d9d9]"
                            : password.length >= 8
                              ? i < 2
                                ? "bg-orange-400"
                                : "bg-[#d9d9d9]"
                              : i < 1
                                ? "bg-red-400"
                                : "bg-[#d9d9d9]",
                      ].join(" ")}
                    />
                  ))}
                </div>
              )}
            </FormField>

            <FormField id="confirmPassword" label="Konfirmasi Password">
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                  }}
                  placeholder="Ulangi password"
                  required
                  className={[
                    "h-[36px] w-full rounded border px-[12px] pr-[40px] text-[14px] font-light text-black",
                    "placeholder:text-[#727272] focus:outline-none focus:ring-1 transition-colors",
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-red-400"
                      : "border-[#f90] focus:ring-[#f90]",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass((v) => !v)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2"
                  aria-label={
                    showConfirmPass
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showConfirmPass ? (
                    <EyeOff className="h-[16px] w-[20px] text-[#727272]" />
                  ) : (
                    <Eye className="h-[16px] w-[20px] text-[#727272]" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[12px] text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </FormField>

            {errors.general && (
              <p className="text-center text-[13px] text-red-500">
                {errors.general}
              </p>
            )}

            <div className="flex-1" />

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="h-[39px] min-h-[39px] w-full shrink-0 rounded-[4px] bg-[#ffcf02] text-[14px] font-bold text-black transition-colors hover:bg-[#f5c800] active:bg-[#e8bb00] disabled:opacity-60"
            >
              {registerMutation.isPending ? t("processing") : t("submit")}
            </button>

            <p className="shrink-0 text-center text-[11px] leading-[18px] text-black">
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
          </form>
        </div>

        <div className="relative hidden h-full w-full lg:block">
          <Image
            src={assets.hero}
            alt={t("heroAlt")}
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
        </div>
      </section>
    </main>
  );
}
