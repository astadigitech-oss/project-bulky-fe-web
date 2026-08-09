"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showLabel: string;
  hideLabel: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
};

// Touch targets bumped to h-11 (44px) vs. the 39px used on the desktop-first
// (auth) pages — this flow is opened primarily inside a mobile WebView.
export function PasswordField({
  id,
  label,
  value,
  onChange,
  showLabel,
  hideLabel,
  placeholder,
  required,
  autoComplete,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[14px] font-semibold text-[#727272]">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="h-11 rounded border-[#f90] px-3 pr-11 text-[16px] font-light text-[#727272] placeholder:text-[#9a9a9a] focus-visible:border-[#f90]"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-black/60"
          aria-label={visible ? hideLabel : showLabel}
        >
          {visible ? <EyeOff className="h-4 w-5" /> : <Eye className="h-4 w-5" />}
        </button>
      </div>
    </div>
  );
}
