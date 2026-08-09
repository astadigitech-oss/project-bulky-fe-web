import { MyFlag } from "@/components/flag";
import type { RecoveryLocale } from "../lib/dictionary";

export function LanguageToggle({
  locale,
  onChange,
}: {
  locale: RecoveryLocale;
  onChange: (locale: RecoveryLocale) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-black/10 bg-white/60 p-0.5">
      <button
        type="button"
        onClick={() => onChange("id")}
        aria-pressed={locale === "id"}
        className={[
          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors",
          locale === "id" ? "bg-white text-black shadow-sm" : "text-black/60",
        ].join(" ")}
      >
        <MyFlag isSquare className="size-3.5" />
        ID
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        aria-pressed={locale === "en"}
        className={[
          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors",
          locale === "en" ? "bg-white text-black shadow-sm" : "text-black/60",
        ].join(" ")}
      >
        <MyFlag en isSquare className="size-3.5" />
        EN
      </button>
    </div>
  );
}
