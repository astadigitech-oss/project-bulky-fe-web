"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

type DeviceOS = "ios" | "android" | "both";

const APP_STORE_URL = "https://apps.apple.com/id/app/bulky-id/id6738534149";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.bulky.app";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function detectDeviceOS(): DeviceOS {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "both";
}

export function MobileRedirectModal() {
  const locale = useLocale();
  const t = useTranslations("MobileRedirectModal");
  // mounted = false saat SSR & first paint, true setelah hydration di browser.
  // Ini memastikan HTML yang dikirim ke server (termasuk Googlebot, yang
  // mobile-first indexing-nya memakai UA Android/Mobile Safari asli
  // sehingga tidak bisa dibedakan dari UA check) TIDAK PERNAH berisi teks
  // modal ini, karena modal baru di-render di client setelah JS jalan.
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const os = mounted ? detectDeviceOS() : "both";

  const assetLocale = locale === "id" ? "id" : "en";

  if (!mounted) return null;

  return (
    <>
      {/*
       * Lock scroll via CSS. Aman dirender di sini (bukan sebelum mounted)
       * karena elemen modal-nya sendiri juga baru muncul setelah mounted.
       */}
      <style>{`@media (max-width: 1023px) { html, body { overflow: hidden !important; } }`}</style>

      {/*
       * lg:hidden — visibility di viewport ≥1024px tetap dikontrol CSS,
       * sedangkan ada/tidaknya elemen ini di DOM dikontrol oleh `mounted`
       * di atas (client-only), supaya tidak ikut ke-SSR ke HTML mentah.
       */}
      <div className="lg:hidden fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-6 py-8">
        {/* Logo */}
        <div className="relative mb-6 h-20 w-20 overflow-hidden rounded-2xl shadow-md">
          <Image
            src="/assets/images/bulky-app-icon.png"
            fill
            alt="Bulky"
            className="object-contain"
            sizes="80px"
          />
        </div>

        {/* Copy */}
        <h2 className="mb-3 text-center text-2xl font-bold text-gray-900">
          {t("title")}
        </h2>
        <p className="mb-8 max-w-xs text-center text-sm leading-relaxed text-gray-500">
          {t("description")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-3">
          {(os === "ios" || os === "both") && (
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              <div className="relative h-12 w-40">
                <Image
                  src={`/assets/svgs/as_${assetLocale}.svg`}
                  fill
                  alt={t("appStore")}
                  className="object-contain"
                  sizes="160px"
                />
              </div>
            </a>
          )}
          {(os === "android" || os === "both") && (
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
              <div className="relative h-12 w-44">
                <Image
                  src={`/assets/svgs/ps_${assetLocale}.svg`}
                  fill
                  alt={t("playStore")}
                  className="object-contain"
                  sizes="176px"
                />
              </div>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
