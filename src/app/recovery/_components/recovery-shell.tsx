import Image from "next/image";
import type { ReactNode } from "react";
import { LanguageToggle } from "./language-toggle";
import type { RecoveryLocale } from "../lib/dictionary";

/**
 * Standalone shell for the recovery flow. Unlike the desktop-oriented
 * `(auth)` pages (centered card, hero image, forced by MobileRedirectModal
 * to a secondary role on small screens), mobile IS the primary surface here
 * since this route is opened directly inside the native app's WebView.
 * Content is top-aligned (not vertically centered) so it never clips on
 * short viewports, and padding respects the iOS safe area.
 */
export function RecoveryShell({
  children,
  locale,
  onLocaleChange,
}: {
  children: ReactNode;
  locale: RecoveryLocale;
  onLocaleChange: (locale: RecoveryLocale) => void;
}) {
  return (
    <main className="min-h-[100dvh] w-full bg-[#ffcf02]">
      <div
        className="mx-auto flex w-full max-w-[480px] flex-col items-center px-5 pb-10"
        style={{ paddingTop: "max(env(safe-area-inset-top), 1.75rem)" }}
      >
        <div className="mb-6 flex w-full items-center justify-between">
          <Image
            src="/assets/images/logo-bulky.webp"
            alt="Bulky"
            width={132}
            height={31}
            className="h-[31px] w-auto object-contain"
            priority
          />
          <LanguageToggle locale={locale} onChange={onLocaleChange} />
        </div>
        <div className="w-full rounded-[20px] bg-white px-5 py-7 shadow-sm sm:px-7 sm:py-8">
          {children}
        </div>
      </div>
    </main>
  );
}
