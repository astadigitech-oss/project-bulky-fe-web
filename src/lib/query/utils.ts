import { apiUrl, apiProxyUrl } from "@config";
import { QueryClient } from "@tanstack/react-query";

// utils.ts
export function buildUrl(endpoint: string, searchParams?: Record<string, any>) {
  const url = new URL(apiUrl + endpoint);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== undefined) url.searchParams.append(key, String(v));
        });
      } else if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

// Same as buildUrl, but relative and routed through the first-party proxy
// (see src/app/api/proxy) for client-side calls that need the session cookie.
export function buildProxyUrl(endpoint: string, searchParams?: Record<string, any>) {
  const url = new URL(apiProxyUrl + endpoint, "http://placeholder");
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== undefined) url.searchParams.append(key, String(v));
        });
      } else if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.pathname + url.search;
}

export function isRecord(value: any): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 *
 * @param key bakal di buat sesuai jumlah key
 * @example
 * ```tsx
 *    await invalidateQuery([["key-a"], ["key-b"]]);
 * ```
 * dan akan di generate seperti ini
 * ```tsx
 *    queryClient.invalidateQueries({ queryKey: ["key-a"] })
 *    queryClient.invalidateQueries({ queryKey: ["key-b"] })
 * ```
 */
export const invalidateQuery = async (
  queryClient: QueryClient,
  keys: string[][],
) => {
  await Promise.all(
    keys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
  );
  await new Promise((res) => setTimeout(res, 100));
};
