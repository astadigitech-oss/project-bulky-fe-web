import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiUrl, cookiesKey } from "@/config";

// Streams requests through to the backend, attaching the auth token from the
// httpOnly session cookie server-side so it never has to touch client JS.
export const runtime = "nodejs";

const REQUEST_TIMEOUT_MS = 15_000;

// Backend has no brute-force protection on these endpoints (see
// /memories/repo/production-errors.md), so it's enforced here instead.
const AUTH_RATE_LIMITED_PATHS = ["auth/login", "auth/register"];
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS_PER_WINDOW = 10;
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

function isAuthRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now >= entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS_PER_WINDOW;
}

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetPath = path.join("/");

  if (
    req.method === "POST" &&
    AUTH_RATE_LIMITED_PATHS.some((p) => targetPath.startsWith(p))
  ) {
    if (isAuthRateLimited(getClientIp(req))) {
      return NextResponse.json(
        { success: false, message: "Too many attempts. Please try again later." },
        { status: 429 },
      );
    }
  }

  const url = new URL(`${apiUrl}/${targetPath}`);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.append(key, value));

  const cookieStore = await cookies();
  const token = cookieStore.get(cookiesKey)?.value;

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (token) headers.set("authorization", `Bearer ${token}`);

  const hasBody = !["GET", "HEAD"].includes(req.method);
  // Buffered (not streamed): piping req.body directly into fetch() is flaky
  // across Next.js runtimes ("expected non-null body source"). Request
  // bodies here (JSON, review/photo uploads) are small enough to buffer.
  const body = hasBody ? await req.arrayBuffer() : undefined;

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });

    const resHeaders = new Headers();
    const resContentType = res.headers.get("content-type");
    if (resContentType) resHeaders.set("content-type", resContentType);

    const resBody = await res.arrayBuffer();
    return new NextResponse(resBody, { status: res.status, headers: resHeaders });
  } catch (err) {
    console.error("[proxy] upstream request failed:", err);
    return NextResponse.json(
      { success: false, message: "Upstream request failed or timed out." },
      { status: 502 },
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
