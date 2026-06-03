import type { Metadata } from "next";
import OAuthVerifyOtpClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  return {
    title: locale === "en" ? "OTP Verification" : "Verifikasi OTP",
  };
};

export default async function OAuthVerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;
  return <OAuthVerifyOtpClient phoneNumber={phone} />;
}
