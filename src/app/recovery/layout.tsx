import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

// Standalone route, same pattern as src/app/oauth/layout.tsx: it bypasses
// `[locale]/layout.tsx` entirely (root src/app/layout.tsx is a pass-through),
// which means no NextIntlClientProvider/SessionProvider/QueryProviders and,
// critically, no <MobileRedirectModal /> — that modal blocks every route
// under `[locale]` on viewports below 1024px, which would make this page
// unusable from the native app's WebView.

export const metadata: Metadata = {
  title: "Pemulihan Akun | Bulky",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RecoveryLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0 }} className="antialiased">
        {children}
      </body>
    </html>
  );
}
