"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const OTP_LENGTH = 6;
const RESEND_SECONDS = 119; // 01:59

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface OtpVerificationPageProps {
  phoneNumber?: string;
  onSuccess?: () => void;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function OtpVerificationPage({
  phoneNumber = "+62 8xx-xxxx-xxxx",
  onSuccess,
}: OtpVerificationPageProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const t = useTranslations("Otp");

  // ── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── Auto-focus box pertama saat mount ────────────────────────────────────
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // ── Handle input per kotak ───────────────────────────────────────────────
  const handleChange = useCallback(
    (index: number, value: string) => {
      // Hanya terima angka
      const digit = value.replace(/\D/g, "").slice(-1);
      const next = [...otp];
      next[index] = digit;
      setOtp(next);
      setError(null);

      // Auto-focus ke kotak berikutnya
      if (digit && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  // ── Handle backspace ─────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (otp[index]) {
          // Hapus digit di kotak ini dulu
          const next = [...otp];
          next[index] = "";
          setOtp(next);
        } else if (index > 0) {
          // Kalau sudah kosong, mundur ke kotak sebelumnya
          inputsRef.current[index - 1]?.focus();
        }
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  // ── Handle paste seluruh kode sekaligus ──────────────────────────────────
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, OTP_LENGTH);
      if (!pasted) return;
      const next = Array(OTP_LENGTH).fill("");
      pasted.split("").forEach((ch, i) => {
        next[i] = ch;
      });
      setOtp(next);
      // Focus ke kotak terakhir yang terisi atau kotak akhir
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputsRef.current[focusIndex]?.focus();
    },
    [],
  );

  // ── Submit verifikasi ────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError(t("errors.incomplete"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // TODO: panggil POST /api/auth/otp/verify ke backend Go Fiber
      // const res = await fetch("/api/auth/otp/verify", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ telepon: phoneNumber, kode: code }),
      // });
      // if (!res.ok) throw new Error("Kode OTP tidak valid.");
      console.log("Verifikasi OTP:", { phoneNumber, code });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.failed"));
      // Reset kotak input saat error
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  // ── Kirim ulang OTP ──────────────────────────────────────────────────────
  async function handleResend() {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      // TODO: panggil POST /api/auth/otp/send ke backend Go Fiber
      // await fetch("/api/auth/otp/send", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ telepon: phoneNumber }),
      // });
      console.log("Kirim ulang OTP ke:", phoneNumber);
      // Reset state
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(RESEND_SECONDS);
      setError(null);
      inputsRef.current[0]?.focus();
    } finally {
      setResending(false);
    }
  }

  const isComplete = otp.every((d) => d !== "");
  const canResend = timer <= 0;

  return (
    /**
     * Background putih — berbeda dari Login & Register yang kuning
     * Sesuai Figma: halaman ini standalone, bukan overlay di atas background
     */
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center w-full max-w-[480px]">
        {/* ── Icon verify (local asset) ── */}
        <img
          src="/assets/icons/icon-verify.svg"
          alt="OTP verification"
          className="w-[120px] h-[126px] object-contain mb-[24px] -translate-x-[-12px]"
        />

        {/* ── Judul ── */}
        <h1 className="text-[32px] font-bold text-black text-center leading-tight font-roboto mb-[12px]">
          {t("title")}
        </h1>

        {/* ── Copywriting WhatsApp — tambahan untuk kejelasan user ── */}
        <div className="text-center mb-[32px]">
          <p className="text-[14px] text-[#727272] font-normal font-roboto leading-[1.6]">
            {t("otpSent")}
          </p>
          <p className="text-[15px] font-bold text-black font-roboto mt-[4px]">
            {phoneNumber}
          </p>
          <p className="text-[13px] text-[#727272] font-normal font-roboto mt-[6px] leading-[1.6]">
            {t("otpGuide")}
            <br />
            {t("codeValidPrefix")}{" "}
            <span className="font-semibold text-black">
              {t("codeValidDuration")}
            </span>
            .
          </p>
        </div>

        {/* ── Form OTP ── */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full"
        >
          {/* 6 Kotak OTP */}
          <div
            className="flex gap-[12px] mb-[24px]"
            role="group"
            aria-label={t("otpGroupAria")}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                aria-label={t("otpDigitAria", { index: String(i + 1) })}
                className={[
                  "w-[53px] h-[72px] rounded-[8px] text-center text-[32px] font-bold text-black font-roboto",
                  "transition-all duration-150 focus:outline-none",
                  digit
                    ? "bg-[#d9d9d9] border-transparent"
                    : "bg-white border border-[#f90]",
                  // Kotak aktif (focus) pakai border orange
                  "focus:border-[#f90] focus:border focus:bg-white",
                ].join(" ")}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-[13px] font-roboto mb-[12px] text-center">
              {error}
            </p>
          )}

          {/* Tombol Verifikasi */}
          <button
            type="submit"
            disabled={loading || !isComplete}
            className={[
              "w-full max-w-[393px] h-[39px] rounded-[4px] text-[14px] font-bold text-black font-roboto",
              "transition-colors",
              isComplete && !loading
                ? "bg-[#ffcf02] hover:bg-[#f5c800] active:bg-[#e8bb00]"
                : "bg-[#ffcf02]/50 cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? t("verifying") : t("verify")}
          </button>

          {/* Kirim ulang + countdown */}
          <div className="mt-[20px] text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-[14px] font-normal text-[#f90] hover:underline font-roboto disabled:opacity-50"
              >
                {resending ? t("resending") : t("resend")}
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

          {/* Hint tambahan */}
          {/*<p className="mt-[12px] text-[12px] text-[#727272] font-normal font-roboto text-center leading-[1.6]">
            Pastikan WhatsApp kamu aktif dan terhubung ke internet.
            <br />
            Cek juga folder{" "}
            <span className="font-semibold text-black">Spam</span> atau{" "}
            <span className="font-semibold text-black">Arsip</span> jika kode
            tidak muncul di chat utama.
          </p>*/}
        </form>
      </div>
    </div>
  );
}
