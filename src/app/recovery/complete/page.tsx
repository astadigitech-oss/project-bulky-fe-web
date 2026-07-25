import type { Metadata } from "next";
import { cookies } from "next/headers";
import RecoveryCompleteClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value === "en" ? "en" : "id";
  return { title: locale === "en" ? "Complete Recovery | Bulky" : "Selesaikan Pemulihan | Bulky" };
}

export default function RecoveryCompletePage() {
  return <RecoveryCompleteClient />;
}
