import type { Metadata } from "next";
import LoginPageClient from "./login-page-client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return {
    title: locale === "en" ? "Login" : "Masuk",
  };
};

const LoginPage = () => {
  return <LoginPageClient />;
};

export default LoginPage;
