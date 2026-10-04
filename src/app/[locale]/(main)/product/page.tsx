import { permanentRedirect } from "next/navigation";

export default async function LegacyProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, item);
    } else if (value !== undefined) {
      search.set(key, value);
    }
  }

  const queryString = search.toString();
  permanentRedirect(
    `/${locale}/products${queryString ? `?${queryString}` : ""}`,
  );
}
