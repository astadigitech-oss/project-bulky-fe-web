"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

type DeviceOS = "ios" | "android" | "both";

const APP_STORE_URL = "https://apps.apple.com/id/app/bulky-id/id6738534149";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.bulky.app";

export function MobileRedirectModal() {
  const locale = useLocale();
  const t = useTranslations("MobileRedirectModal");
  const [os, setOs] = useState<DeviceOS>("both");

  useEffect(() => {
    // Hanya deteksi OS untuk menentukan tombol store yang ditampilkan
    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);
    if (isIOS) setOs("ios");
    else if (isAndroid) setOs("android");
  }, []);

  const assetLocale = locale === "id" ? "id" : "en";

  return (
    <>
      {/*
       * Lock scroll via CSS — aktif sejak render pertama (SSR/hydration),
       * tidak perlu tunggu useEffect sehingga tidak ada jeda scroll.
       */}
      <style>{`@media (max-width: 1023px) { html, body { overflow: hidden !important; } }`}</style>

      {/*
       * lg:hidden — visibility dikontrol CSS bukan JS state,
       * sehingga block langsung aktif tanpa flash konten.
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
