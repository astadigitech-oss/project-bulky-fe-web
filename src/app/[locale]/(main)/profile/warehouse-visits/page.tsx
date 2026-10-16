import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProfileShell } from "../_components/profile-shell";
import { WarehouseVisitHistory } from "./_components/history";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("WarehouseVisits.history");
  return { title: t("pageTitle") };
}

export default function WarehouseVisitHistoryPage() {
  return (
    <ProfileShell activeTab="warehouse-visits">
      <WarehouseVisitHistory />
    </ProfileShell>
  );
}
