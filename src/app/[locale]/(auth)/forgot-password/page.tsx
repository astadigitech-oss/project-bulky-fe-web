import type { Metadata } from "next";
import ForgotPasswordClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return {
    title: locale === "en" ? "Forgot Password" : "Lupa Kata Sandi",
  };
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
