import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { cookiesKey } from "./config";

const intlMiddleware = createMiddleware(routing);

// Locale-prefixed segments that require a session; redirect at the edge
// instead of relying solely on client-side useProtectRoute().
const PROTECTED_SEGMENTS = ["/cart", "/checkout", "/profile"];

function isProtectedPath(pathname: string): boolean {
  const withoutLocale = pathname.replace(/^\/(en|id)(?=\/|$)/, "") || "/";
  return PROTECTED_SEGMENTS.some(
    (segment) => withoutLocale === segment || withoutLocale.startsWith(`${segment}/`),
  );
}

// Simple in-memory fixed-window limiter, per server instance. Good enough to
// stop a single misbehaving client/bot from taking the container down (which
// was showing up as 502s at Cloudflare); not a substitute for a real edge/CDN
// rate limit if traffic grows or the app scales to multiple instances.
const WINDOW_MS = 10_000;
const MAX_REQUESTS_PER_WINDOW = 60;
const MAX_TRACKED_IPS = 5_000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const hits = new Map<string, RateLimitEntry>();

function getClientIp(req: NextRequest): string | null {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0]?.trim();
    return ip || null;
  }

  return null;
}

// Bounds map growth from one-off IPs (bots/scanners) over the process lifetime.
function pruneExpiredEntries(now: number) {
  for (const [ip, entry] of hits) {
    if (now >= entry.resetAt) {
      hits.delete(ip);
    }
  }
}

function checkRateLimit(ip: string): {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  let entry = hits.get(ip);

  if (!entry || now >= entry.resetAt) {
    if (hits.size >= MAX_TRACKED_IPS) {
      pruneExpiredEntries(now);
    }

    if (hits.size >= MAX_TRACKED_IPS && !hits.has(ip)) {
      return {
        limited: true,
        remaining: 0,
        retryAfterSeconds: Math.ceil(WINDOW_MS / 1000),
      };
    }

    entry = {
      count: 1,
      resetAt: now + WINDOW_MS,
    };
    hits.set(ip, entry);

    return {
      limited: false,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      retryAfterSeconds: 0,
    };
  }

  entry.count += 1;
  const remaining = Math.max(MAX_REQUESTS_PER_WINDOW - entry.count, 0);

  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return {
      limited: true,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  return {
    limited: false,
    remaining,
    retryAfterSeconds: 0,
  };
}

export default function proxy(req: NextRequest) {
  const ip = getClientIp(req);
  if (ip) {
    const { limited, retryAfterSeconds } = checkRateLimit(ip);
    if (limited) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
          "X-RateLimit-Remaining": "0",
          "Cache-Control": "no-store",
        },
      });
    }
  }

  // next-intl only understands paths under `[locale]`; oauth/recovery live
  // outside that and just bypass it (they still went through the rate limit above).
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/oauth") || pathname.startsWith("/recovery")) {
    return NextResponse.next();
  }

  // Edge-level gate: catches direct navigation/refresh before client JS
  // (useProtectRoute) ever runs. Only checks the httpOnly cookie's presence,
  // not validity — /me still verifies it and clears the cookie if stale.
  if (isProtectedPath(pathname) && !req.cookies.get(cookiesKey)) {
    const locale = pathname.match(/^\/(en|id)(?=\/|$)/)?.[1] ?? routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("reason", "auth-required");
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
