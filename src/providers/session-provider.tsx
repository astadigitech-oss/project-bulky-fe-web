"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { deleteCookie, getCookie } from "cookies-next/client";
import { useQueryClient } from "@tanstack/react-query";

import { cookiesKey } from "@/config";
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
  const token = getCookie(cookiesKey);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useApiQuery<CheckSessionResponse>({
    key: ["session", token ?? ""],
    endpoint: "/me",
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutate({
    endpoint: "/auth/logout",
    method: "post",
    onSuccess: () => {
      deleteCookie(cookiesKey, { path: "/" });
      queryClient.removeQueries({ queryKey: ["session"] });
      window.location.href = "/login";
    },
    onError: { title: "LOGOUT" },
  });

  // If token exists but session is invalid (401), clear the stale cookie
  useEffect(() => {
    if (isError && token) {
      deleteCookie(cookiesKey, { path: "/" });
    }
  }, [isError, token]);

  const user = !isError ? (data?.data?.user ?? null) : null;
  const isAuthenticated = !!user;

  function logout() {
    logoutMutation.mutate({});
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        isLoading: !!token && isLoading,
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
