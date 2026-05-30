import type { Metadata } from "next";
import RegisterPageClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return {
    title: locale === "en" ? "Register" : "Daftar",
  };
};

const RegisterPage = () => {
  return <RegisterPageClient />;
};

export default RegisterPage;
