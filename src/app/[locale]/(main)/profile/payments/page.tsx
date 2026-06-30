import { getTranslations } from "next-intl/server";
import { ProfileShell } from "../_components/profile-shell";
import { PaymentsList } from "./_components/payments-list";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePages.payment");
  return { title: t("pageTitle") };
}

export default async function MenungguPembayaranPage() {
  const t = await getTranslations("ProfilePages.payment");
  return (
    <ProfileShell activeTab="payments">
      <p className="mb-6 text-base text-[#727272]">{t("heading")}</p>
      <PaymentsList />
    </ProfileShell>
  );
}
