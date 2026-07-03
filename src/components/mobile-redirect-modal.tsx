"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";

type DeviceOS = "ios" | "android" | "both";

const SESSION_KEY = "bulky_mobile_modal_dismissed";
const APP_STORE_URL = "https://apps.apple.com/id/app/bulky-id/id6738534149";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.bulky.app";

function detectDevice(): { isMobileOrTablet: boolean; os: DeviceOS } {
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);
  const isNarrowViewport = window.innerWidth < 1024;
  const isMobileOrTablet = isIOS || isAndroid || isNarrowViewport;

  let os: DeviceOS = "both";
  if (isIOS) os = "ios";
  else if (isAndroid) os = "android";

  return { isMobileOrTablet, os };
}

export function MobileRedirectModal() {
  const locale = useLocale();
  const t = useTranslations("MobileRedirectModal");
  const [visible, setVisible] = useState(false);
  const [os, setOs] = useState<DeviceOS>("both");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const { isMobileOrTablet, os: detectedOs } = detectDevice();
    if (isMobileOrTablet) {
      setOs(detectedOs);
      setVisible(true);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  function handleDismiss() {
    sessionStorage.setItem(SESSION_KEY, "1");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    setVisible(false);
  }

  if (!visible) return null;

  const assetLocale = locale === "id" ? "id" : "en";

  return (
    <>
      {/* Backdrop - fixed fullscreen */}
      <div
        onClick={handleDismiss}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      />

      {/* Bottom Sheet - fixed to bottom */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: "0 -10px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div className="px-6 pt-6 pb-10">
          {/* Handle */}
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
            aria-label={t("dismiss")}
          >
            <X size={16} />
          </button>

          {/* Logo + Brand */}
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
              <Image
                src="/assets/images/bulky-app-icon.png"
                fill
                alt="Bulky"
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t("from")}</p>
              <p className="text-sm font-semibold text-gray-800">Bulky.id</p>
            </div>
          </div>

          {/* Copy */}
          <h2 className="mb-2 text-lg font-bold text-gray-900">
            {t("title")}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-gray-500">
            {t("description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-3">
            {(os === "ios" || os === "both") && (
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative h-11 w-36">
                  <Image
                    src={`/assets/svgs/as_${assetLocale}.svg`}
                    fill
                    alt={t("appStore")}
                    className="object-contain"
                    sizes="144px"
                  />
                </div>
              </a>
            )}
            {(os === "android" || os === "both") && (
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative h-11 w-40">
                  <Image
                    src={`/assets/svgs/ps_${assetLocale}.svg`}
                    fill
                    alt={t("playStore")}
                    className="object-contain"
                    sizes="160px"
                  />
                </div>
              </a>
            )}
          </div>

          {/* Dismiss link */}
          <button
            onClick={handleDismiss}
            className="mt-4 w-full text-center text-sm text-gray-400 underline underline-offset-2"
          >
            {t("dismiss")}
          </button>
        </div>
      </div>
    </>
  );
}
