import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookiesKey, sessionFlagCookie } from "@/config";

// Matches backend JWT_EXPIRY_HOURS default (168h = 7 days).
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  const { token } = (await req.json().catch(() => ({}))) as { token?: string };
  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set(cookiesKey, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  // Non-sensitive marker so client components know a session exists without
  // ever reading the httpOnly token cookie themselves.
  cookieStore.set(sessionFlagCookie, "1", {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(cookiesKey);
  cookieStore.delete(sessionFlagCookie);
  return NextResponse.json({ ok: true });
}
