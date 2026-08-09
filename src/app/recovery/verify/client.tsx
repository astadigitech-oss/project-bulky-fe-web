"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { OtpBoxes } from "../_components/otp-boxes";
import { RecoveryShell } from "../_components/recovery-shell";
import { StepIndicator } from "../_components/step-indicator";
import { useCountdown, formatCountdown } from "../_components/use-countdown";
import { recoveryVerifyOtp, recoveryRequestOtp, parseRecoveryError } from "../lib/api";
import { clearRecoverySession, getRecoverySession, setRecoverySession } from "../lib/session";
import { recoveryDict, useRecoveryLocale } from "../lib/dictionary";

const OTP_LENGTH = 6;

export default function RecoveryVerifyClient() {
  const router = useRouter();
  const [locale, setLocale] = useRecoveryLocale();
  const t = recoveryDict[locale];

  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useCountdown(0);

  useEffect(() => {
    const session = getRecoverySession();
    if (!session) {
      router.replace("/recovery?expired=1");
      return;
    }
    if (!session.phone) {
      router.replace("/recovery/phone");
      return;
    }
    setToken(session.token);
    setPhone(session.phone);

    const elapsed = session.otpIssuedAt ? Math.floor((Date.now() - session.otpIssuedAt) / 1000) : 0;
    const remaining = Math.max((session.otpExpiresIn ?? 300) - elapsed, 0);
    setTimer(remaining);
    setReady(true);
  }, [router, setTimer]);

  const isComplete = otp.every((d) => d !== "");
  const canResend = timer <= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !phone || verifying) return;

    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError(t.step3.incomplete);
      return;
    }

    setVerifying(true);
    setError(null);
    try {
      await recoveryVerifyOtp({ recovery_token: token, telepon: phone, kode: code });
      router.push("/recovery/complete");
    } catch (err) {
      const info = parseRecoveryError(err, t.step3.invalidOtp);
      if (info.status === 400) {
        clearRecoverySession();
        router.replace("/recovery?expired=1");
        return;
      }
      setError(info.message);
      setOtp(Array(OTP_LENGTH).fill(""));
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (!token || !phone || !canResend || resending) return;

    setResending(true);
    setError(null);
    try {
      const res = await recoveryRequestOtp({ recovery_token: token, telepon: phone });
      const otpExpiresIn = res.data.data?.otp_expires_in ?? 300;
      setRecoverySession({ otpExpiresIn, otpIssuedAt: Date.now() });
      setTimer(otpExpiresIn);
      setOtp(Array(OTP_LENGTH).fill(""));
    } catch (err) {
      const info = parseRecoveryError(err, t.common.genericError);
      setError(info.message);
    } finally {
      setResending(false);
    }
  }

  if (!ready || !phone) return null;

  return (
    <RecoveryShell locale={locale} onLocaleChange={setLocale}>
      <StepIndicator step={3} total={4} label={t.stepper.label(3)} />

      <div className="mb-4 flex justify-center">
        <img
          src="/assets/icons/icon-verify.svg"
          alt=""
          className="h-[72px] w-[68px] object-contain"
        />
      </div>

      <h1 className="mb-2 text-center text-[24px] font-bold leading-tight text-[#222]">
        {t.step3.title}
      </h1>
      <p className="text-center text-[14px] leading-relaxed text-[#727272]">
        {t.step3.otpSentPrefix}
      </p>
      <p className="mb-6 text-center text-[15px] font-bold text-black">{phone}</p>

      <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-5">
        <OtpBoxes
          value={otp}
          onChange={setOtp}
          disabled={verifying}
          groupAriaLabel={t.step3.otpGuide}
          digitAriaLabel={(i) => `${t.step3.title} ${i + 1}`}
        />

        {error && (
          <p role="alert" className="text-center text-[13px] leading-relaxed text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={verifying || !isComplete}
          className={[
            "h-11 w-full rounded-lg text-[14px] font-bold text-black transition-colors",
            isComplete && !verifying
              ? "bg-[#ffcf02] hover:bg-[#f5c800] active:bg-[#e8bb00]"
              : "cursor-not-allowed bg-[#ffcf02]/50",
          ].join(" ")}
        >
          {verifying ? t.step3.verifying : t.step3.verify}
        </button>

        <div className="text-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-[14px] text-[#f90] hover:underline disabled:opacity-50"
            >
              {resending ? t.step3.resending : t.step3.resend}
            </button>
          ) : (
            <p className="text-[14px] text-[#727272]">
              {t.step3.resendIn}{" "}
              <span className="font-semibold text-black">{formatCountdown(timer)}</span>
            </p>
          )}
        </div>
      </form>
    </RecoveryShell>
  );
}
