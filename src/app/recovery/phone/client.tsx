"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecoveryShell } from "../_components/recovery-shell";
import { StepIndicator } from "../_components/step-indicator";
import { useCountdown, formatCountdown } from "../_components/use-countdown";
import { recoveryRequestOtp, parseRecoveryError } from "../lib/api";
import { clearRecoverySession, getRecoverySession, setRecoverySession } from "../lib/session";
import { recoveryDict, useRecoveryLocale } from "../lib/dictionary";

export default function RecoveryPhoneClient() {
  const router = useRouter();
  const [locale, setLocale] = useRecoveryLocale();
  const t = recoveryDict[locale];

  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useCountdown(0);

  useEffect(() => {
    const session = getRecoverySession();
    if (!session) {
      router.replace("/recovery?expired=1");
      return;
    }
    setToken(session.token);
    setReady(true);
  }, [router]);

  const rateLimited = retryAfter > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || loading || rateLimited) return;

    setLoading(true);
    setError(null);
    try {
      const res = await recoveryRequestOtp({ recovery_token: token, telepon: phone });
      const data = res.data.data;
      if (data) {
        setRecoverySession({
          phone: data.telepon,
          otpExpiresIn: data.otp_expires_in,
          otpIssuedAt: Date.now(),
        });
        router.push("/recovery/verify");
      }
    } catch (err) {
      const info = parseRecoveryError(err, t.common.genericError);
      if (info.status === 400) {
        clearRecoverySession();
        router.replace("/recovery?expired=1");
        return;
      }
      setError(info.message);
      if (info.retryAfter) setRetryAfter(info.retryAfter);
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return null;

  return (
    <RecoveryShell locale={locale} onLocaleChange={setLocale}>
      <StepIndicator step={2} total={4} label={t.stepper.label(2)} />

      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#fff4cc]">
        <Smartphone className="h-5 w-5 text-[#f90]" strokeWidth={2} />
      </div>

      <h1 className="mb-2 text-[24px] font-bold leading-tight text-[#222]">{t.step2.title}</h1>
      <p className="mb-6 text-[14px] leading-relaxed text-[#727272]">{t.step2.description}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-[14px] font-semibold text-[#727272]">
            {t.step2.phoneLabel}
          </label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.step2.phonePlaceholder}
            required
            autoComplete="tel"
            className="h-11 rounded border-[#f90] px-3 text-[16px] font-light text-[#727272] placeholder:text-[#9a9a9a] focus-visible:border-[#f90]"
          />
        </div>

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
          {loading ? t.step2.submitting : t.step2.submit}
        </Button>
      </form>
    </RecoveryShell>
  );
}
