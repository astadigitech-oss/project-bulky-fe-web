import type { Metadata } from "next";
import OtpPageClient from "./client";

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

const OtpPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ phone?: string }>;
}) => {
  await params;
  const { phone } = await searchParams;

  return <OtpPageClient phoneNumber={phone} />;
};

export default OtpPage;
