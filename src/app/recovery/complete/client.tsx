"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, KeyRound, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PasswordField } from "../_components/password-field";
import { RecoveryShell } from "../_components/recovery-shell";
import { StepIndicator } from "../_components/step-indicator";
import { recoveryComplete, parseRecoveryError } from "../lib/api";
import { clearRecoverySession, getRecoverySession } from "../lib/session";
import { recoveryDict, useRecoveryLocale } from "../lib/dictionary";
import type { RecoveryCompleteBuyer } from "@/services/auth/types";

type PasswordChoice = "keep" | "new";

export default function RecoveryCompleteClient() {
  const router = useRouter();
  const [locale, setLocale] = useRecoveryLocale();
  const t = recoveryDict[locale];

  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [choice, setChoice] = useState<PasswordChoice>("keep");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buyer, setBuyer] = useState<RecoveryCompleteBuyer | null>(null);

  useEffect(() => {
    const session = getRecoverySession();
    if (!session) {
      router.replace("/recovery?expired=1");
      return;
    }
    setToken(session.token);
    setReady(true);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || loading) return;

    if (choice === "new") {
      if (newPassword.length < 8) {
        setError(t.step4.passwordMinError);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(t.step4.passwordMatchError);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const res = await recoveryComplete({
        recovery_token: token,
        keep_password: choice === "keep",
        ...(choice === "new" ? { new_password: newPassword } : {}),
      });
      const data = res.data.data;
      if (data?.buyer) {
        setBuyer(data.buyer);
        clearRecoverySession();
      }
    } catch (err) {
      const info = parseRecoveryError(err, t.common.genericError);
      // new_password presence is already validated client-side, so a 400
      // here means the recovery session itself is invalid/expired.
      if (info.status === 400) {
        clearRecoverySession();
        router.replace("/recovery?expired=1");
        return;
      }
      setError(info.message);
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return null;

  if (buyer) {
    return (
      <RecoveryShell locale={locale} onLocaleChange={setLocale}>
        <div className="flex flex-col items-center py-2 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CircleCheck className="h-7 w-7 text-green-600" strokeWidth={2} />
          </div>
          <h1 className="mb-2 text-[22px] font-bold leading-tight text-[#222]">
            {t.step4.successTitle}
          </h1>
          <p className="mb-6 text-[14px] leading-relaxed text-[#727272]">{t.step4.successDesc}</p>

          <div className="mb-6 w-full rounded-xl bg-[#f8f8f8] px-4 py-4 text-left">
            <p className="text-[14px] font-semibold text-black">{buyer.full_name}</p>
            <p className="text-[13px] text-[#727272]">{buyer.email}</p>
            <p className="text-[13px] text-[#727272]">{buyer.phone_number}</p>
          </div>

          <a
            href={`/${locale}/login`}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#ffcf02] text-[14px] font-bold text-black hover:bg-[#f5c800] active:bg-[#e8bb00]"
          >
            {t.step4.continueToLogin}
          </a>
        </div>
      </RecoveryShell>
    );
  }

  return (
    <RecoveryShell locale={locale} onLocaleChange={setLocale}>
      <StepIndicator step={4} total={4} label={t.stepper.label(4)} />

      <h1 className="mb-2 text-[24px] font-bold leading-tight text-[#222]">{t.step4.title}</h1>
      <p className="mb-6 text-[14px] leading-relaxed text-[#727272]">{t.step4.description}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setChoice("keep")}
          aria-pressed={choice === "keep"}
          className={[
            "flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
            choice === "keep" ? "border-[#f90] bg-[#fff8e6]" : "border-[#e5e5e5] bg-white",
          ].join(" ")}
        >
          <ShieldCheck
            className={`h-5 w-5 shrink-0 ${choice === "keep" ? "text-[#f90]" : "text-[#9a9a9a]"}`}
            strokeWidth={2}
          />
          <span>
            <span className="block text-[14px] font-semibold text-[#222]">
              {t.step4.keepPasswordTitle}
            </span>
            <span className="block text-[12px] text-[#727272]">{t.step4.keepPasswordDesc}</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setChoice("new")}
          aria-pressed={choice === "new"}
          className={[
            "flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
            choice === "new" ? "border-[#f90] bg-[#fff8e6]" : "border-[#e5e5e5] bg-white",
          ].join(" ")}
        >
          <KeyRound
            className={`h-5 w-5 shrink-0 ${choice === "new" ? "text-[#f90]" : "text-[#9a9a9a]"}`}
            strokeWidth={2}
          />
          <span>
            <span className="block text-[14px] font-semibold text-[#222]">
              {t.step4.newPasswordTitle}
            </span>
            <span className="block text-[12px] text-[#727272]">{t.step4.newPasswordDesc}</span>
          </span>
        </button>

        {choice === "new" && (
          <div className="mt-1 flex flex-col gap-4">
            <PasswordField
              id="newPassword"
              label={t.step4.newPasswordLabel}
              value={newPassword}
              onChange={setNewPassword}
              showLabel={t.common.showPassword}
              hideLabel={t.common.hidePassword}
              required
              autoComplete="new-password"
            />
            <PasswordField
              id="confirmPassword"
              label={t.step4.confirmPasswordLabel}
              value={confirmPassword}
              onChange={setConfirmPassword}
              showLabel={t.common.showPassword}
              hideLabel={t.common.hidePassword}
              required
              autoComplete="new-password"
            />
          </div>
        )}

        {error && (
          <p role="alert" className="text-[13px] leading-relaxed text-red-500">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-1 h-11 w-full rounded-lg bg-[#ffcf02] text-[14px] font-bold text-black hover:bg-[#f5c800] active:bg-[#e8bb00]"
        >
          {loading ? t.step4.submitting : t.step4.submit}
        </Button>
      </form>
    </RecoveryShell>
  );
}
