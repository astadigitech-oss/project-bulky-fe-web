import type { Metadata } from "next";
import { cookies } from "next/headers";
import RecoveryVerifyClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value === "en" ? "en" : "id";
  return { title: locale === "en" ? "Verify OTP | Bulky" : "Verifikasi OTP | Bulky" };
}

export default function RecoveryVerifyPage() {
  return <RecoveryVerifyClient />;
}
