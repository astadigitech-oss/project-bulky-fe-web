import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import React, { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import QueryProviders from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ToastProvider } from "@/providers/toast-provider";
import { GoogleMapsProvider } from "@/providers/google-maps-provider";
import { MobileRedirectModal } from "@/components/mobile-redirect-modal";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/config";
import { JsonLd } from "@/components/json-ld";
import "../globals.css";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bulky.id",
  url: siteUrl,
  logo: `${siteUrl}/assets/images/logo-bulky.webp`,
  sameAs: ["https://instagram.com/bulky.id", "https://tiktok.com/@bulky.id"],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Bulky",
    default: "Bulky",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const LocaleLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd data={organizationJsonLd} />
        <QueryProviders>
          <NuqsAdapter>
            <NextIntlClientProvider>
              <SessionProvider>
                <GoogleMapsProvider>
                  <ToastProvider />
                  <MobileRedirectModal />
                  {children}
                </GoogleMapsProvider>
              </SessionProvider>
            </NextIntlClientProvider>
          </NuqsAdapter>
        </QueryProviders>
      </body>
    </html>
  );
};

export default LocaleLayout;
