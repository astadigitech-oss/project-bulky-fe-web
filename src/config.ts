const backendHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const apiUrl = `${backendHost.replace(/\/$/, "")}/api`;
export const cookiesKey = process.env.NEXT_PUBLIC_COOKIES_KEY! || "cookies_key";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://bulky.id"
).replace(/\/$/, "");
