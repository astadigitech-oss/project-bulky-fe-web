import axios, { AxiosError } from "axios";

import { apiUrl } from "@/config";
import type {
  RecoveryLoginBody,
  RecoveryLoginResponse,
  RecoveryRequestOtpBody,
  RecoveryRequestOtpResponse,
  RecoveryVerifyOtpBody,
  RecoveryVerifyOtpResponse,
  RecoveryCompleteBody,
  RecoveryCompleteResponse,
  RecoveryErrorBody,
} from "@/services/auth/types";

// This route group lives outside `[locale]` (see layout.tsx), so it has no
// QueryProviders / useMutate available. Calls are plain axios, same pattern
// as src/app/oauth/google/callback/page.tsx.

export function recoveryLogin(body: RecoveryLoginBody) {
  return axios.post<RecoveryLoginResponse>(`${apiUrl}/auth/recovery/login-legacy`, body);
}

export function recoveryRequestOtp(body: RecoveryRequestOtpBody) {
  return axios.post<RecoveryRequestOtpResponse>(`${apiUrl}/auth/recovery/request-otp`, body);
}

export function recoveryVerifyOtp(body: RecoveryVerifyOtpBody) {
  return axios.post<RecoveryVerifyOtpResponse>(`${apiUrl}/auth/recovery/verify-otp`, body);
}

export function recoveryComplete(body: RecoveryCompleteBody) {
  return axios.post<RecoveryCompleteResponse>(`${apiUrl}/auth/recovery/complete`, body);
}

export type RecoveryApiErrorInfo = {
  message: string;
  status?: number;
  retryAfter?: number;
};

/** Extracts a human-readable message + optional retry_after from a failed recovery call. */
export function parseRecoveryError(err: unknown, fallback: string): RecoveryApiErrorInfo {
  const axiosErr = err as AxiosError<RecoveryErrorBody>;
  const body = axiosErr?.response?.data;
  return {
    message: body?.message || fallback,
    status: axiosErr?.response?.status,
    retryAfter: body?.data?.retry_after,
  };
}
