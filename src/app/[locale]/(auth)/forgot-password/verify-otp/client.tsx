"use client";

import { useRouter } from "@/i18n/navigation";
import OtpVerificationPage from "../../otp/otp-verification-page";

type Props = { phone?: string };

export default function VerifyForgotOtpClient({ phone }: Props) {
  const router = useRouter();

  function handleSuccess(token: string) {
    sessionStorage.setItem("bulky_fp_token", token);
    const query = phone ? `?phone=${encodeURIComponent(phone)}` : "";
    router.push(`/forgot-password/reset-password${query}`);
  }

  return (
    <OtpVerificationPage
      phoneNumber={phone}
      flow="forgot-password"
      onSuccess={handleSuccess}
    />
  );
}
