import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ProfileShell } from "../_components/profile-shell";
import { PaymentSuccessModal } from "./_components/payment-success-modal";
import { OrdersList } from "./_components/orders-list";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePages.orders");
  return { title: t("pageTitle") };
}

export default async function StatusPesananPage() {
  return (
    <ProfileShell activeTab="orders">
      <Suspense>
        <PaymentSuccessModal />
      </Suspense>
      <OrdersList />
    </ProfileShell>
  );
}
