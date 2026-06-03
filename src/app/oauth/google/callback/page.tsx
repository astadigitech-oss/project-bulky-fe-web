"use client";

import { useEffect, useState } from "react";
import { setCookie } from "cookies-next/client";
import axios from "axios";
import Image from "next/image";

import { cookiesKey, apiUrl } from "@/config";
import type {
  GoogleLoginResponse,
  GoogleLoginExistingUserData,
  GoogleLoginNewUserData,
} from "@/services/auth/types";

export default function GoogleOAuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    const locale =
      document.cookie.split("; ").find((r) => r.startsWith("NEXT_LOCALE="))?.split("=")[1] ?? "id";

    if (errorParam || !code) {
      setError("Login dengan Google dibatalkan. / Google login was cancelled.");
      setTimeout(() => { window.location.href = `/${locale}/login`; }, 2000);
      return;
    }

    const redirectUri = `${window.location.origin}/oauth/google/callback`;

    axios
      .post<GoogleLoginResponse>(`${apiUrl}/auth/oauth/google`, {
        authorization_code: code,
        redirect_uri: redirectUri,
      })
      .then((res) => {
        const { data } = res.data;

        const locale =
          document.cookie.split("; ").find((r) => r.startsWith("NEXT_LOCALE="))?.split("=")[1] ?? "id";

        if (!data.needs_phone) {
          // Existing user — login directly
          const existing = data as GoogleLoginExistingUserData;
          setCookie(cookiesKey, existing.access_token, { path: "/" });
          window.location.href = `/${locale}`;
        } else {
          // New user — needs phone number
          const newUser = data as GoogleLoginNewUserData;
          sessionStorage.setItem("bulky_oauth_token", newUser.pending_oauth_token);
          window.location.href = `/${locale}/oauth/add-phone`;
        }
      })
      .catch(() => {
        setError("Gagal login dengan Google. Silakan coba lagi. / Failed to login with Google. Please try again.");
        setTimeout(() => { window.location.href = `/${locale}/login`; }, 2000);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
