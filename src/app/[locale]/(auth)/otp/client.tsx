"use client";

import { useRouter } from "@/i18n/navigation";
import OtpVerificationPage from "./otp-verification-page";

type OtpPageClientProps = {
  phoneNumber?: string;
};

export default function OtpPageClient({ phoneNumber }: OtpPageClientProps) {
  const router = useRouter();

  return (
    <OtpVerificationPage
      phoneNumber={phoneNumber}
      onSuccess={() => {
        const query = phoneNumber
          ? `?phone=${encodeURIComponent(phoneNumber)}`
          : "";
        router.push(`/register-form${query}`);
      }}
    />
  );
}
