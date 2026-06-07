import { getTranslations } from "next-intl/server";
import { EmptyState, ProfileShell } from "../_components/profile-shell";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePages.patungan");
  return { title: t("pageTitle") };
}

export default async function PembayaranPatunganPage() {
  const t = await getTranslations("ProfilePages.patungan");
  return (
    <ProfileShell activeTab="group-buy">
      <p className="text-base text-[#727272]">{t("heading")}</p>
      <EmptyState
        icon="split"
        title={t("emptyTitle")}
        actionLabel={t("emptyAction")}
      />
    </ProfileShell>
  );
}
