// Recovery flow state passed between steps. Kept in sessionStorage (not the
// URL) since it carries a bearer-style recovery_token — same reasoning as the
// existing `bulky_fp_token` used by the forgot-password flow.

const STORAGE_KEY = "bulky_recovery_session";

export type RecoverySessionData = {
  token: string;
  /** epoch ms — recovery_token expires 15 min after login-legacy succeeds */
  tokenExpiresAt: number;
  phone?: string;
  /** seconds, from the most recent request-otp response */
  otpExpiresIn?: number;
  /** epoch ms — when the current OTP was (re)sent */
  otpIssuedAt?: number;
};

export function getRecoverySession(): RecoverySessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RecoverySessionData;
    if (!parsed.token || Date.now() > parsed.tokenExpiresAt) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setRecoverySession(patch: Partial<RecoverySessionData>): RecoverySessionData {
  const current = getRecoverySession() ?? ({} as RecoverySessionData);
  const next = { ...current, ...patch };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearRecoverySession() {
  sessionStorage.removeItem(STORAGE_KEY);
}
