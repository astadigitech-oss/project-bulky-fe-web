"use client";

import { useCallback, useRef } from "react";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  groupAriaLabel: string;
  digitAriaLabel: (index: number) => string;
};

// Adapted from (auth)/otp/otp-verification-page.tsx, but standalone (that
// component depends on next-intl, unavailable outside `[locale]`), with
// larger 48px boxes for touch and `autoComplete="one-time-code"` so iOS /
// Android WebViews can offer SMS/WhatsApp OTP autofill.
export function OtpBoxes({ value, onChange, disabled, groupAriaLabel, digitAriaLabel }: Props) {
  const length = value.length;
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (index: number, raw: string) => {
      const digit = raw.replace(/\D/g, "").slice(-1);
      const next = [...value];
      next[index] = digit;
      onChange(next);
      if (digit && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [value, onChange, length],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (value[index]) {
          const next = [...value];
          next[index] = "";
          onChange(next);
        } else if (index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
      }
      if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
      if (e.key === "ArrowRight" && index < length - 1) inputsRef.current[index + 1]?.focus();
    },
    [value, onChange, length],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (!pasted) return;
      const next = Array(length).fill("");
      pasted.split("").forEach((ch, i) => {
        next[i] = ch;
      });
      onChange(next);
      inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
    },
    [length, onChange],
  );

  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label={groupAriaLabel}>
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={digitAriaLabel(i)}
          className={[
            "h-12 max-w-12 flex-1 rounded-[8px] border text-center text-[22px] font-bold text-black transition-colors",
            "focus:outline-none focus:border-[#f90]",
            digit ? "border-transparent bg-[#f0f0f0]" : "border-[#f90] bg-white",
            disabled ? "opacity-50" : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
