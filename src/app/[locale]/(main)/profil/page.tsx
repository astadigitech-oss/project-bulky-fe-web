import { redirect } from "@i18n/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil",
};

export default async function ProfilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/profil/pesanan", locale: locale as "en" | "id" });
}
