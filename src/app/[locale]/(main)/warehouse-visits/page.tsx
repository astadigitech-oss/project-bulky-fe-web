import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WarehouseVisitBooking } from "./_components/booking";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("WarehouseVisits.booking");
  return { title: t("pageTitle") };
}

export default function WarehouseVisitsPage() {
  return <WarehouseVisitBooking />;
}
