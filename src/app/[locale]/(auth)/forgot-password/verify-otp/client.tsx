"use client";

import { useRouter } from "@/i18n/navigation";

import OtpVerificationPage from "../../otp/otp-verification-page";

type Props = { phone?: string };

export default function VerifyForgotOtpClient({ phone }: Props) {
  const router = useRouter();

  return (
    <OtpVerificationPage
      phoneNumber={phone}
      onSuccess={() => {
        const query = phone ? `?phone=${encodeURIComponent(phone)}` : "";
        router.push(`/forgot-password/reset-password${query}`);
      }}
    />
  );
}
