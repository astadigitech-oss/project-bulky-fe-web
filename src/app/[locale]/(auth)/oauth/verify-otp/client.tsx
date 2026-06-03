"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { setCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import type { AxiosError } from "axios";

import { useMutate } from "@/lib/query";
import { cookiesKey, apiUrl } from "@/config";
import type { GoogleVerifyOtpResponse } from "@/services/auth/types";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 119;

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getApiErrorMessage(err: unknown): string {
  return (
    ((err as AxiosError<{ message: string }>)?.response?.data as any)?.message ?? ""
  );
}

export default function OAuthVerifyOtpClient({ phoneNumber }: { phoneNumber?: string }) {
  const t = useTranslations("OAuthVerifyOtp");
  const router = useRouter();
  const oauthTokenRef = useRef<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem("bulky_oauth_token");
    if (!token) { router.replace("/login"); return; }
    oauthTokenRef.current = token;
    if (!phoneNumber) { router.replace("/oauth/add-phone"); return; }
    inputsRef.current[0]?.focus();
  }, [router, phoneNumber]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const resendMutation = useMutate<unknown, { pending_oauth_token: string; telepon: string }>({
    endpoint: "/auth/oauth/request-otp",
    method: "post",
    isPublic: true,
    onSuccess: () => {
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(RESEND_SECONDS);
      setError(null);
      inputsRef.current[0]?.focus();
    },
    onError: { title: "OAUTH_RESEND_OTP" },
  });

  const handleChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError(null);
    if (digit && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }, [otp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp]; next[index] = ""; setOtp(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = oauthTokenRef.current;
    if (!token || !phoneNumber) return;
    const code = otp.join("");
    if (code.length < OTP_LENGTH) { setError(t("errors.incomplete")); return; }
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/auth/oauth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pending_oauth_token: token, telepon: phoneNumber, kode: code }),
      });
      const data: GoogleVerifyOtpResponse = await res.json();
      if (!res.ok) throw new Error((data as any).message);
      const accessToken = data.data?.access_token;
      if (accessToken) {
        setCookie(cookiesKey, accessToken, { path: "/" });
        sessionStorage.removeItem("bulky_oauth_token");
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err?.message || t("errors.failed"));
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  }

  function handleResend() {
    const token = oauthTokenRef.current;
    if (!token || !phoneNumber || timer > 0 || resendMutation.isPending) return;
    resendMutation.mutate({ body: { pending_oauth_token: token, telepon: phoneNumber } });
  }

  const isComplete = otp.every((d) => d !== "");
  const canResend = timer <= 0;

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center w-full max-w-[480px]">
        <img
          src="/assets/icons/icon-verify.svg"
          alt=""
          className="w-[120px] h-[126px] object-contain mb-[24px] -translate-x-[-12px]"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />

        <h1 className="text-[32px] font-bold text-black text-center leading-tight font-roboto mb-[12px]">
          {t("title")}
        </h1>

        <div className="text-center mb-[32px]">
          <p className="text-[14px] text-[#727272] font-normal font-roboto leading-[1.6]">
            {t("sentTo")}
          </p>
          <p className="text-[15px] font-bold text-black font-roboto mt-[4px]">
            {phoneNumber}
          </p>
          <p className="text-[13px] text-[#727272] font-normal font-roboto mt-[6px] leading-[1.6]">
            {t("guide")}
            <br />
            {t("codeValidPrefix")}{" "}
            <span className="font-semibold text-black">{t("codeValidDuration")}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
          <div className="flex gap-[12px] mb-[24px]" role="group">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={[
                  "w-[53px] h-[72px] rounded-[8px] text-center text-[32px] font-bold text-black font-roboto",
                  "transition-all duration-150 focus:outline-none",
                  digit ? "bg-[#d9d9d9] border-transparent" : "bg-white border border-[#f90]",
                  "focus:border-[#f90] focus:border focus:bg-white",
                ].join(" ")}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-[13px] font-roboto mb-[12px] text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isVerifying || !isComplete}
            className={[
              "w-full max-w-[393px] h-[39px] rounded-[4px] text-[14px] font-bold text-black font-roboto transition-colors",
              isComplete && !isVerifying
                ? "bg-[#ffcf02] hover:bg-[#f5c800] active:bg-[#e8bb00]"
                : "bg-[#ffcf02]/50 cursor-not-allowed",
            ].join(" ")}
          >
            {isVerifying ? t("verifying") : t("verify")}
          </button>

          <div className="mt-[20px] text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendMutation.isPending}
                className="text-[14px] font-normal text-[#f90] hover:underline font-roboto disabled:opacity-50"
              >
                {resendMutation.isPending ? t("resending") : t("resend")}
              </button>
            ) : (
              <p className="text-[14px] font-normal text-[#727272] font-roboto">
                {t("noCode")}{" "}
                <span className="font-semibold text-black">
                  {t("resendIn")} {formatTimer(timer)}
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
