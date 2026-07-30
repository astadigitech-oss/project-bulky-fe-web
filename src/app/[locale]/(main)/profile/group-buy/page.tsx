import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ProfileShell } from "../_components/profile-shell";
import { PaymentSuccessModal } from "../orders/_components/payment-success-modal";
import { GroupBuyList } from "./_components/group-buy-list";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePages.patungan");
  return { title: t("pageTitle") };
}

export default async function PembayaranPatunganPage() {
  return (
    <ProfileShell activeTab="group-buy">
      <Suspense>
        <PaymentSuccessModal redirectTo="/profile/group-buy" />
      </Suspense>
      <GroupBuyList />
    </ProfileShell>
  );
}
