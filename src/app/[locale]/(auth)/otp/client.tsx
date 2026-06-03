"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import OtpVerificationPage from "./otp-verification-page";

type OtpPageClientProps = {
  phoneNumber?: string;
};

export default function OtpPageClient({ phoneNumber }: OtpPageClientProps) {
  const router = useRouter();

  useEffect(() => {
    const phone = sessionStorage.getItem("bulky_otp_phone");
    if (!phone) {
      router.replace("/register");
    }
  }, [router]);

  function handleSuccess(token: string) {
    sessionStorage.removeItem("bulky_otp_phone");
    sessionStorage.setItem("bulky_reg_token", token);
    const query = phoneNumber
      ? `?phone=${encodeURIComponent(phoneNumber)}`
      : "";
    router.push(`/register-form${query}`);
  }

  return (
    <OtpVerificationPage
      phoneNumber={phoneNumber}
      flow="register"
      onSuccess={handleSuccess}
    />
  );
}
