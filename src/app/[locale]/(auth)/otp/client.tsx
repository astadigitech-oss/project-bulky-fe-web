"use client";

import OtpVerificationPage from "./otp-verification-page";

type OtpPageClientProps = {
  phoneNumber?: string;
};

export default function OtpPageClient({ phoneNumber }: OtpPageClientProps) {
  return <OtpVerificationPage phoneNumber={phoneNumber} />;
}
