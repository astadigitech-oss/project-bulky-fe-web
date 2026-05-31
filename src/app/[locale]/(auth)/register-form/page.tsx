import type { Metadata } from "next";
import RegisterFormClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return {
    title: locale === "en" ? "Complete Registration" : "Lengkapi Pendaftaran",
  };
};

const RegisterForm = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ phone?: string }>;
}) => {
  await params;
  const { phone } = await searchParams;

  return <RegisterFormClient verifiedPhone={phone} />;
};

export default RegisterForm;
