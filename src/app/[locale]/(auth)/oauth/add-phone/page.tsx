import type { Metadata } from "next";
import OAuthAddPhoneClient from "./client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Add Phone Number" : "Tambah Nomor HP",
  };
};

export default function OAuthAddPhonePage() {
  return <OAuthAddPhoneClient />;
}
