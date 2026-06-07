import { getTranslations } from "next-intl/server";
import { ProfileShell, TrackingContent } from "../../_components/profile-shell";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePages.tracking");
  return { title: t("pageTitle") };
}

export default function LacakPesananPage() {
  return (
    <ProfileShell activeTab="orders">
      <TrackingContent />
    </ProfileShell>
  );
}
