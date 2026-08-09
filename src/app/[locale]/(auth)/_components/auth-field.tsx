"use client";

import { Input } from "@/components/ui/input";

/**
 * The labelled control shared by the auth cards.
 *
 * Layout is fixed by the mockups: label above, icon inside the control on the
 * left, optional action on the right, then hint and error stacked below. Error
 * replaces the hint rather than pushing it down, so the card height only
 * changes when a field goes from valid to invalid, not on every keystroke.
 */
export type AuthFieldProps = React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** Rendered inside the control, absolutely positioned against its right edge. */
  trailing?: React.ReactNode;
  hint?: string;
  error?: string;
  /** Extra content under the control, e.g. a password strength meter. */
  children?: React.ReactNode;
};

export function AuthField({
  id,
  label,
  icon,
  trailing,
  hint,
  error,
  children,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[13px] leading-none font-semibold text-[#1f1f1f]"
      >
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9a9a9a]">
          {icon}
        </span>
        <Input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={`h-11 rounded-[10px] bg-white pr-3.5 pl-10 text-base font-normal text-[#1f1f1f] transition-colors md:text-[15px] placeholder:text-[13px] placeholder:text-[#757575] ${
            error
              ? "border-[#d92d20] focus-visible:border-[#d92d20] focus-visible:ring-2 focus-visible:ring-[#d92d20]/25"
              : "border-[#e4e4e4] hover:border-[#d2d2d2] focus-visible:border-[#f90] focus-visible:ring-2 focus-visible:ring-[#f90]/25"
          } ${className ?? ""}`}
          {...props}
        />
        {trailing}
      </div>

      {children}

      {error ? (
        <p id={`${id}-error`} className="text-[12px] leading-snug text-[#d92d20]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[12px] leading-snug text-[#757575]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
