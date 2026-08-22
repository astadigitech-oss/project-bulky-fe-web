import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Simple in-memory fixed-window limiter, per server instance. Good enough to
// stop a single misbehaving client/bot from taking the container down (which
// was showing up as 502s at Cloudflare); not a substitute for a real edge/CDN
// rate limit if traffic grows or the app scales to multiple instances.
const WINDOW_MS = 10_000;
const MAX_REQUESTS_PER_WINDOW = 60;
const MAX_TRACKED_IPS = 5_000;

const hits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

function checkRateLimit(ip: string): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now >= entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return { limited: true, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { limited: false, retryAfterSeconds: 0 };
}

// Bounds map growth from one-off IPs (bots/scanners) over the process lifetime.
function pruneExpiredEntries(now: number) {
  if (hits.size < MAX_TRACKED_IPS) return;
  for (const [ip, entry] of hits) {
    if (now >= entry.resetAt) hits.delete(ip);
  }
}

export default function proxy(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited, retryAfterSeconds } = checkRateLimit(ip);
  pruneExpiredEntries(Date.now());

  if (limited) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    });
  }

  // next-intl only understands paths under `[locale]`; oauth/recovery live
  // outside that and just bypass it (they still went through the rate limit above).
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/oauth") || pathname.startsWith("/recovery")) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
