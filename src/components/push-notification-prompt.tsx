"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useSession } from "@/providers/session-provider";
import { isWebPushConfigured, registerCurrentWebPush } from "@/lib/firebase/push-client";

export function PushNotificationPrompt() {
  const { isAuthenticated } = useSession();
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated) {
      setVisible(false);
      return;
    }
    if (!("Notification" in window) || !isWebPushConfigured()) return;

    if (Notification.permission === "granted") {
      void registerCurrentWebPush().catch((error) => {
        console.warn("Could not register Bulky web push notifications.", error);
      });
      return;
    }

    if (
      Notification.permission === "default" &&
      window.sessionStorage.getItem("bulky.push.dismissed") !== "1"
    ) {
      setVisible(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    function showForegroundNotification(event: Event) {
      const payload = (event as CustomEvent<{ notification?: { title?: string; body?: string }; data?: { deep_link?: string } }>).detail;
      const title = payload.notification?.title ?? (locale === "en" ? "Bulky notification" : "Notifikasi Bulky");
      const body = payload.notification?.body ?? "";
      toast(title, {
        description: body,
        action: {
          label: locale === "en" ? "View bids" : "Lihat bid",
          onClick: () => {
            const fallback = `/${locale}/profile/bids`;
            const target = payload.data?.deep_link || fallback;
            window.location.assign(target.startsWith("/") ? target : fallback);
          },
        },
      });
    }
    window.addEventListener("bulky:push-message", showForegroundNotification);
    return () => window.removeEventListener("bulky:push-message", showForegroundNotification);
  }, [locale]);

  async function enableNotifications() {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setVisible(false);
        toast.info(locale === "en" ? "Notifications were not enabled." : "Notifikasi belum diaktifkan.");
        return;
      }
      if (!(await registerCurrentWebPush())) {
        toast.error(locale === "en" ? "Push notifications are not supported here." : "Push notification tidak didukung di browser ini.");
      } else {
        toast.success(locale === "en" ? "Notifications are enabled." : "Notifikasi berhasil diaktifkan.");
      }
      setVisible(false);
    } catch {
      toast.error(locale === "en" ? "Could not enable notifications." : "Notifikasi gagal diaktifkan.");
    } finally {
      setBusy(false);
    }
  }

  function dismiss() {
    window.sessionStorage.setItem("bulky.push.dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-4 bottom-4 z-[80] mx-auto flex max-w-xl items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 text-black shadow-xl dark:border-white/10 dark:bg-neutral-900 dark:text-white">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
        <BellRing className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{locale === "en" ? "Get Bulky.id notifications" : "Aktifkan notifikasi Bulky.id"}</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {locale === "en" ? "Stay updated on your activity, auctions, news, and offers from Bulky.id." : "Dapatkan info terbaru tentang aktivitasmu, lelang, berita, dan penawaran dari Bulky.id."}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="ghost" size="sm" onClick={dismiss} disabled={busy}>
          {locale === "en" ? "Later" : "Nanti"}
        </Button>
        <Button size="sm" onClick={() => void enableNotifications()} disabled={busy}>
          {busy ? (locale === "en" ? "Enabling..." : "Memproses...") : (locale === "en" ? "Enable" : "Aktifkan")}
        </Button>
      </div>
    </aside>
  );
}
