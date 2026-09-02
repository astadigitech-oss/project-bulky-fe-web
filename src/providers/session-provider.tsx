"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { deleteCookie, getCookie } from "cookies-next/client";
import { useQueryClient } from "@tanstack/react-query";

import { sessionFlagCookie } from "@/config";
import { useApiQuery } from "@/lib/query/use-query";
import { useMutate } from "@/lib/query";
import type { SessionUser, CheckSessionResponse } from "@/services/auth/types";

// ─── Context ─────────────────────────────────────────────────────────────────

type SessionContextValue = {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  logout: () => {},
});

// ─── Provider ────────────────────────────────────────────────────────────────

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Non-httpOnly marker; the real token cookie is only readable server-side.
  const hasSessionFlag = getCookie(sessionFlagCookie);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError } = useApiQuery<CheckSessionResponse>({
    key: ["session", hasSessionFlag ?? ""],
    endpoint: "/me",
    enabled: !!hasSessionFlag,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  async function clearSession() {
    await fetch("/api/auth/session", { method: "DELETE" });
    deleteCookie(sessionFlagCookie, { path: "/" });
  }

  const logoutMutation = useMutate({
    endpoint: "/auth/logout",
    method: "post",
    onSuccess: async () => {
      await clearSession();
      queryClient.removeQueries({ queryKey: ["session"] });
      router.push("/login");
    },
    onError: { title: "LOGOUT" },
  });

  // If the flag exists but the session is invalid (401), clear the stale cookies.
  useEffect(() => {
    if (isError && hasSessionFlag) {
      clearSession();
    }
  }, [isError, hasSessionFlag]);

  const user = !isError ? (data?.data?.user ?? null) : null;
  const isAuthenticated = !!user;

  function logout() {
    logoutMutation.mutate({});
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        isLoading: !!hasSessionFlag && isLoading,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSession() {
  return useContext(SessionContext);
}

/**
 * Redirects to /login if user is not authenticated.
 * Use inside client components that require auth.
 *
 * @example
 * useProtectRoute();
 */
export function useProtectRoute() {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?reason=auth-required");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}
