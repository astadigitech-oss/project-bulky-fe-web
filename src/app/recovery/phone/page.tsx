import type { Metadata } from "next";
import { cookies } from "next/headers";
import RecoveryPhoneClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value === "en" ? "en" : "id";
  return { title: locale === "en" ? "Add Phone Number | Bulky" : "Tambah Nomor Telepon | Bulky" };
}

export default function RecoveryPhonePage() {
  return <RecoveryPhoneClient />;
}
