import { getTranslations } from "next-intl/server";
import { ProfileShell } from "../../_components/profile-shell";
import { OrderDetail } from "./_components/order-detail";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePages.orderDetail");
  return { title: t("pageTitle") };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProfileShell activeTab="orders">
      <OrderDetail id={id} />
    </ProfileShell>
  );
}
