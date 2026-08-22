// Hands a freshly issued backend token to the server so it can be stored as
// an httpOnly cookie (see src/app/api/auth/session/route.ts) instead of the
// client setting it directly.
export async function establishSession(token: string): Promise<boolean> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.ok;
}
