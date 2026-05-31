import type { Metadata } from "next";
import VerifyForgotOtpClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return {
    title: locale === "en" ? "Verify OTP" : "Verifikasi OTP",
  };
};

export default async function VerifyForgotOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;
  return <VerifyForgotOtpClient phone={phone} />;
}
