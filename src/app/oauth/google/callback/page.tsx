"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { apiUrl } from "@/config";
import { establishSession } from "@/lib/auth-session";
import type {
  GoogleLoginResponse,
  GoogleLoginExistingUserData,
  GoogleLoginNewUserData,
} from "@/services/auth/types";

export default function GoogleOAuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    async function completeGoogleLogin() {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");
      const locale =
        document.cookie
          .split("; ")
          .find((entry) => entry.startsWith("NEXT_LOCALE="))
          ?.split("=")[1] ?? "id";

      if (errorParam || !code) {
        if (!cancelled) {
          setError("Login dengan Google dibatalkan. / Google login was cancelled.");
          redirectTimer = setTimeout(() => router.replace(`/${locale}/login`), 2000);
        }
        return;
      }

      try {
        const res = await axios.post<GoogleLoginResponse>(
          `${apiUrl}/auth/oauth/google`,
          {
            authorization_code: code,
            redirect_uri: `${window.location.origin}/oauth/google/callback`,
          },
        );
        const { data } = res.data;

        if (!data.needs_phone) {
          // Existing user — login directly
          const existing = data as GoogleLoginExistingUserData;
          if (await establishSession(existing.access_token)) {
            router.replace(`/${locale}`);
          }
        } else {
          // New user — needs phone number
          const newUser = data as GoogleLoginNewUserData;
          sessionStorage.setItem("bulky_oauth_token", newUser.pending_oauth_token);
          router.replace(`/${locale}/oauth/add-phone`);
        }
      } catch {
        if (!cancelled) {
          setError("Gagal login dengan Google. Silakan coba lagi. / Failed to login with Google. Please try again.");
          redirectTimer = setTimeout(() => router.replace(`/${locale}/login`), 2000);
        }
      }
    }

    void completeGoogleLogin();

    return () => {
      cancelled = true;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#ffcf02]">
      <div className="flex flex-col items-center gap-5 rounded-[20px] bg-white px-10 py-8 shadow-sm">
        <Image
          src="/assets/images/logo-bulky.webp"
          alt="Bulky"
          width={120}
          height={29}
          className="h-[29px] w-auto object-contain"
        />
        {error ? (
          <div className="flex flex-col items-center gap-1">
            <p className="text-[15px] font-semibold text-red-500">{error}</p>
            <p className="text-[12px] text-[#727272]">Mengarahkan ke halaman login… / Redirecting to login page…</p>
          </div>
        ) : (
          <>
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#ffcf02] border-t-black" />
            <p className="text-[14px] font-semibold text-[#222]">Memproses login Google… / Processing Google login…</p>
          </>
        )}
      </div>
    </div>
  );
}
