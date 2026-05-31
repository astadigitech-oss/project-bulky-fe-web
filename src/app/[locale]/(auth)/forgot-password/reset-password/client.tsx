"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = { phone?: string };

export default function ResetPasswordClient({ phone }: Props) {
  const t = useTranslations("ForgotPasswordReset");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const assets = useMemo(
    () => ({
      hero: "/assets/images/hero-login.svg",
      logo: "/assets/images/logo-bulky.webp",
      looperLeft: "/assets/images/Looper-kiri.svg",
      looperRight: "/assets/images/Looper-kanan.svg",
    }),
    [],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError(t("errors.passwordMin"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("errors.notMatch"));
      return;
    }

    setError(null);
    setLoading(true);
    try {
      console.log("Reset password:", { phone, password });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#ffcf02] px-5 py-8 md:px-10">
      <Image src={assets.looperLeft} alt="" width={902} height={768} className="pointer-events-none absolute left-0 top-1/2 h-auto w-[52vw] min-w-[700px] -translate-y-1/2 select-none opacity-80" />
      <Image src={assets.looperRight} alt="" width={684} height={768} className="pointer-events-none absolute right-0 top-1/2 h-auto w-[40vw] min-w-[520px] -translate-y-1/2 select-none opacity-80" />

      <section className="relative z-10 flex w-full max-w-[1366px] items-center justify-center gap-12 lg:justify-between lg:px-[146px]">
        <div className="hidden lg:block">
          <Image src={assets.hero} alt={t("heroAlt")} width={537} height={537} className="h-[537px] w-[537px] rounded-xl object-cover" sizes="(min-width: 1024px) 537px, 0px" priority />
        </div>

        <div className="relative flex w-full max-w-[420px] flex-col rounded-[20px] bg-white px-[26px] pb-[32px] pt-[36px] shadow-sm">
          <Image src={assets.logo} alt="Bulky" width={156} height={37} className="mb-[20px] h-[37px] w-auto object-contain" />
          <h1 className="mb-[8px] text-[30px] leading-none font-bold text-[#222]">{t("title")}</h1>
          <p className="mb-[16px] text-[13px] text-[#727272]">{t("phoneLabel")}: <span className="font-semibold text-black">{phone || "-"}</span></p>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-[12px] flex flex-col gap-[6px]">
              <label htmlFor="password" className="text-[14px] font-semibold text-[#727272]">{t("passwordLabel")}</label>
              <div className="relative">
                <Input id="password" type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("passwordPlaceholder")} required className="h-[39px] rounded border-[#f90] px-[12px] pr-[40px] text-[16px] font-light text-[#727272] placeholder:text-[#9a9a9a] focus-visible:border-[#f90]" />
                <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-black/60" aria-label={showPass ? t("hidePassword") : t("showPassword")}>
                  {showPass ? <EyeOff className="h-[16px] w-[20px]" /> : <Eye className="h-[16px] w-[20px]" />}
                </button>
              </div>
            </div>

            <div className="mb-[16px] flex flex-col gap-[6px]">
              <label htmlFor="confirmPassword" className="text-[14px] font-semibold text-[#727272]">{t("confirmPasswordLabel")}</label>
              <div className="relative">
                <Input id="confirmPassword" type={showConfirmPass ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("confirmPasswordPlaceholder")} required className="h-[39px] rounded border-[#f90] px-[12px] pr-[40px] text-[16px] font-light text-[#727272] placeholder:text-[#9a9a9a] focus-visible:border-[#f90]" />
                <button type="button" onClick={() => setShowConfirmPass((p) => !p)} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-black/60" aria-label={showConfirmPass ? t("hidePassword") : t("showPassword")}>
                  {showConfirmPass ? <EyeOff className="h-[16px] w-[20px]" /> : <Eye className="h-[16px] w-[20px]" />}
                </button>
              </div>
            </div>

            {error && <p className="mb-[12px] text-[12px] text-red-500">{error}</p>}
            {success && <p className="mb-[12px] rounded-md bg-green-50 px-3 py-2 text-[12px] text-green-700">{t("success")}</p>}

            <Button type="submit" disabled={loading} className="mb-[16px] h-[39px] w-full rounded-lg bg-[#ffcf02] text-[14px] font-bold text-black hover:bg-[#f5c800]">
              {loading ? t("processing") : t("submit")}
            </Button>

            <Link href="/login" className="text-center text-[13px] text-[#f90] hover:underline">{t("backToLogin")}</Link>
          </form>
        </div>
      </section>
    </main>
  );
}
