import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import RecoveryLoginClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value === "en" ? "en" : "id";
  return { title: locale === "en" ? "Recover Account | Bulky" : "Pulihkan Akun | Bulky" };
}

export default function RecoveryLoginPage() {
  return (
    <Suspense fallback={null}>
      <RecoveryLoginClient />
    </Suspense>
  );
}
