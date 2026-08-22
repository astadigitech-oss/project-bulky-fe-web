const backendHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const apiUrl = `${backendHost.replace(/\/$/, "")}/api`;
export const cookiesKey = process.env.NEXT_PUBLIC_COOKIES_KEY! || "cookies_key";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://bulky.id"
).replace(/\/$/, "");

// Client fetches go through this first-party proxy so the auth token stays in
// an httpOnly cookie (`cookiesKey`) that JS never reads. See src/app/api/proxy.
export const apiProxyUrl = "/api/proxy";
// Non-httpOnly marker cookie; readable by client JS to know a session exists
// without ever exposing the real token.
export const sessionFlagCookie = "has_session";
