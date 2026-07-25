"use client";

import { useEffect, useState } from "react";

export type RecoveryLocale = "id" | "en";

function buildDict(locale: RecoveryLocale) {
  const id = {
    common: {
      showPassword: "Tampilkan kata sandi",
      hidePassword: "Sembunyikan kata sandi",
      genericError: "Terjadi kesalahan. Silakan coba lagi.",
      sessionExpired: "Sesi pemulihan sudah berakhir. Silakan mulai ulang.",
    },
    stepper: {
      label: (step: number) => `Langkah ${step} dari 4`,
    },
    step1: {
      title: "Pulihkan Akses Akun",
      description:
        "Masuk dengan email dan kata sandi akun Bulky lama kamu untuk memulai pemulihan.",
      emailLabel: "Email",
      emailPlaceholder: "nama@email.com",
      passwordLabel: "Kata Sandi",
      passwordPlaceholder: "Masukkan kata sandi lama",
      submit: "Lanjutkan",
      submitting: "Memeriksa...",
      footerHelp: "Butuh bantuan? Hubungi layanan pelanggan Bulky.",
    },
    step2: {
      title: "Hubungkan Nomor Telepon",
      description:
        "Masukkan nomor WhatsApp aktif kamu. Kode verifikasi akan dikirim ke nomor ini.",
      phoneLabel: "Nomor Telepon",
      phonePlaceholder: "08xxxxxxxxxx",
      submit: "Kirim Kode OTP",
      submitting: "Mengirim kode...",
    },
    step3: {
      title: "Verifikasi Nomor Telepon",
      otpSentPrefix: "Kode OTP telah dikirim ke",
      otpGuide: "Masukkan 6 digit kode yang kamu terima lewat WhatsApp",
      verify: "Verifikasi",
      verifying: "Memverifikasi...",
      resend: "Kirim ulang kode",
      resending: "Mengirim ulang...",
      resendIn: "Kirim ulang dalam",
      invalidOtp: "Kode OTP tidak valid atau sudah kedaluwarsa",
      incomplete: "Masukkan 6 digit kode terlebih dahulu",
    },
    step4: {
      title: "Selesaikan Pemulihan Akun",
      description: "Pilih salah satu opsi kata sandi di bawah untuk menyelesaikan pemulihan.",
      keepPasswordTitle: "Tetap gunakan kata sandi saat ini",
      keepPasswordDesc: "Kamu bisa langsung masuk memakai kata sandi lama.",
      newPasswordTitle: "Buat kata sandi baru",
      newPasswordDesc: "Perbarui kata sandi akun kamu sekarang.",
      newPasswordLabel: "Kata Sandi Baru",
      confirmPasswordLabel: "Konfirmasi Kata Sandi Baru",
      passwordMinError: "Kata sandi minimal 8 karakter",
      passwordMatchError: "Konfirmasi kata sandi tidak sama",
      submit: "Selesaikan Pemulihan",
      submitting: "Menyelesaikan...",
      successTitle: "Akun Berhasil Dipulihkan",
      successDesc: "Kamu sekarang bisa masuk menggunakan akun ini.",
      continueToLogin: "Lanjut ke Halaman Masuk",
    },
  };

  const en: typeof id = {
    common: {
      showPassword: "Show password",
      hidePassword: "Hide password",
      genericError: "Something went wrong. Please try again.",
      sessionExpired: "Your recovery session has ended. Please start again.",
    },
    stepper: {
      label: (step: number) => `Step ${step} of 4`,
    },
    step1: {
      title: "Recover Account Access",
      description: "Sign in with your old Bulky account's email and password to start recovery.",
      emailLabel: "Email",
      emailPlaceholder: "name@email.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your old password",
      submit: "Continue",
      submitting: "Checking...",
      footerHelp: "Need help? Contact Bulky customer support.",
    },
    step2: {
      title: "Connect Your Phone Number",
      description: "Enter your active WhatsApp number. We will send a verification code to it.",
      phoneLabel: "Phone Number",
      phonePlaceholder: "08xxxxxxxxxx",
      submit: "Send OTP Code",
      submitting: "Sending code...",
    },
    step3: {
      title: "Verify Your Phone Number",
      otpSentPrefix: "An OTP code has been sent to",
      otpGuide: "Enter the 6 digit code you received via WhatsApp",
      verify: "Verify",
      verifying: "Verifying...",
      resend: "Resend code",
      resending: "Resending...",
      resendIn: "Resend in",
      invalidOtp: "The OTP code is invalid or has expired",
      incomplete: "Enter the 6 digit code first",
    },
    step4: {
      title: "Complete Account Recovery",
      description: "Choose one of the password options below to finish recovery.",
      keepPasswordTitle: "Keep my current password",
      keepPasswordDesc: "You can sign in right away with your old password.",
      newPasswordTitle: "Create a new password",
      newPasswordDesc: "Update your account password now.",
      newPasswordLabel: "New Password",
      confirmPasswordLabel: "Confirm New Password",
      passwordMinError: "Password must be at least 8 characters",
      passwordMatchError: "Password confirmation does not match",
      submit: "Complete Recovery",
      submitting: "Finishing up...",
      successTitle: "Account Recovered",
      successDesc: "You can now sign in using this account.",
      continueToLogin: "Continue to Login",
    },
  };

  return locale === "en" ? en : id;
}

export const recoveryDict: Record<RecoveryLocale, ReturnType<typeof buildDict>> = {
  id: buildDict("id"),
  en: buildDict("en"),
};

/**
 * Reads the NEXT_LOCALE cookie the same way src/app/oauth/google/callback/page.tsx
 * does, and allows changing it. This route sits outside the next-intl middleware
 * matcher (see src/proxy.ts), so nothing else will ever write this cookie for a
 * user landing here fresh from the native app - the toggle below is the only way
 * to change language on this flow.
 */
export function useRecoveryLocale(): [RecoveryLocale, (locale: RecoveryLocale) => void] {
  const [locale, setLocaleState] = useState<RecoveryLocale>("id");

  useEffect(() => {
    const match = document.cookie.split("; ").find((r) => r.startsWith("NEXT_LOCALE="));
    const value = match?.split("=")[1];
    setLocaleState(value === "en" ? "en" : "id");
  }, []);

  function setLocale(next: RecoveryLocale) {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setLocaleState(next);
  }

  return [locale, setLocale];
}
