"use client";

import { UserAvatar } from "@/components/ui/avatar";
import { useApiQuery } from "@/lib/query/use-query";
import { useProtectRoute } from "@/providers/session-provider";
import type { GetProfileResponse } from "@/services/profile/types";

export function ProfileSidebarClient() {
  useProtectRoute();

  const { data, isLoading } = useApiQuery<GetProfileResponse>({
    key: ["profile"],
    endpoint: "/profile",
  });

  const user = data?.data;

  return (
    <>
      <UserAvatar
        src={user?.image}
        name={user?.name ?? ""}
        isLoading={isLoading}
        className="mx-auto mb-4 size-24"
        fallbackClassName="bg-white text-3xl font-bold text-black"
      />
      <div className="space-y-1 text-base text-black">
        {isLoading ? (
          <div className="space-y-2">
            <div className="mx-auto h-5 w-32 animate-pulse rounded bg-black/20" />
            <div className="mx-auto h-4 w-40 animate-pulse rounded bg-black/20" />
            <div className="mx-auto h-4 w-28 animate-pulse rounded bg-black/20" />
          </div>
        ) : (
          <>
            <p className="font-bold">{user?.name ?? "—"}</p>
            {user?.email && <p>{user.email}</p>}
            <p>{user?.phone ?? "—"}</p>
          </>
        )}
      </div>
    </>
  );
}
