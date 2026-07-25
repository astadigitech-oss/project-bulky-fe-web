"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordField } from "./_components/password-field";
import { RecoveryShell } from "./_components/recovery-shell";
import { StepIndicator } from "./_components/step-indicator";
import { useCountdown, formatCountdown } from "./_components/use-countdown";
import { recoveryLogin, parseRecoveryError } from "./lib/api";
import { clearRecoverySession, setRecoverySession } from "./lib/session";
import { recoveryDict, useRecoveryLocale } from "./lib/dictionary";

export default function RecoveryLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useRecoveryLocale();
  const t = recoveryDict[locale];

  const expired = searchParams.get("expired") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useCountdown(0);

  const rateLimited = retryAfter > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || rateLimited) return;

    setLoading(true);
    setError(null);
    try {
      const res = await recoveryLogin({ email, password });
      const data = res.data.data;
      if (data) {
        // Overwrite (not merge) so a stale phone/OTP state from an earlier
        // abandoned attempt never leaks into this fresh session.
        clearRecoverySession();
        setRecoverySession({
          token: data.recovery_token,
          tokenExpiresAt: Date.now() + data.expires_in * 1000,
        });
        router.push("/recovery/phone");
      }
    } catch (err) {
      const info = parseRecoveryError(err, t.common.genericError);
      setError(info.message);
      if (info.retryAfter) setRetryAfter(info.retryAfter);
    } finally {
      setLoading(false);
    }
  }

  return (
    <RecoveryShell locale={locale} onLocaleChange={setLocale}>
      <StepIndicator step={1} total={4} label={t.stepper.label(1)} />

      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#fff4cc]">
        <KeyRound className="h-5 w-5 text-[#f90]" strokeWidth={2} />
      </div>

      <h1 className="mb-2 text-[24px] font-bold leading-tight text-[#222]">{t.step1.title}</h1>
      <p className="mb-5 text-[14px] leading-relaxed text-[#727272]">{t.step1.description}</p>

      {expired && !error && (
        <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-[12px] text-yellow-800">
          {t.common.sessionExpired}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[14px] font-semibold text-[#727272]">
            {t.step1.emailLabel}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.step1.emailPlaceholder}
            required
            autoComplete="email"
            className="h-11 rounded border-[#f90] px-3 text-[16px] font-light text-[#727272] placeholder:text-[#9a9a9a] focus-visible:border-[#f90]"
          />
        </div>

        <PasswordField
          id="password"
          label={t.step1.passwordLabel}
          value={password}
          onChange={setPassword}
          placeholder={t.step1.passwordPlaceholder}
          showLabel={t.common.showPassword}
          hideLabel={t.common.hidePassword}
          required
          autoComplete="current-password"
        />

        {error && (
          <p role="alert" className="text-[13px] leading-relaxed text-red-500">
            {error}
            {rateLimited && ` (${formatCountdown(retryAfter)})`}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || rateLimited}
          className="mt-1 h-11 w-full rounded-lg bg-[#ffcf02] text-[14px] font-bold text-black hover:bg-[#f5c800] active:bg-[#e8bb00]"
        >
          {loading ? t.step1.submitting : t.step1.submit}
        </Button>
      </form>

      <p className="mt-6 text-center text-[12px] leading-relaxed text-[#9a9a9a]">
        {t.step1.footerHelp}
      </p>
    </RecoveryShell>
  );
}
