import { getTranslations } from "next-intl/server";
import { EmptyState, ProfileShell } from "../_components/profile-shell";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePages.payment");
  return { title: t("pageTitle") };
}

export default async function MenungguPembayaranPage() {
  const t = await getTranslations("ProfilePages.payment");
  return (
    <ProfileShell activeTab="payments">
      <p className="text-base text-[#727272]">{t("heading")}</p>
      <EmptyState
        icon="payment"
        title={t("emptyTitle")}
        actionLabel={t("emptyAction")}
      />
    </ProfileShell>
  );
}
