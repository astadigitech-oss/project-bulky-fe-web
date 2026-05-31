import type { Metadata } from "next";
import ResetPasswordClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return {
    title: locale === "en" ? "Reset Password" : "Reset Kata Sandi",
  };
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;
  return <ResetPasswordClient phone={phone} />;
}
