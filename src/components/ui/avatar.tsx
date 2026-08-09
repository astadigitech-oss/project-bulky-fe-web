"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 after:border-border group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "rounded-full aspect-square size-full object-cover",
        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "bg-muted text-muted-foreground size-8 rounded-full text-sm group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3 ring-background relative flex shrink-0 items-center justify-center ring-2",
        className,
      )}
      {...props}
    />
  );
}

// ─── UserAvatar ───────────────────────────────────────────────────────────────
// Wrapper yang mencegah fallback muncul saat image masih loading.
// Fallback (initial name) hanya muncul jika src null/undefined atau image error (404).

type UserAvatarProps = {
  src?: string | null;
  name: string;
  className?: string;
  fallbackClassName?: string;
  isLoading?: boolean; // skeleton saat data belum di-fetch
};

function UserAvatar({ src, name, className, fallbackClassName, isLoading = false }: UserAvatarProps) {
  const [imgStatus, setImgStatus] = React.useState<"idle" | "loading" | "loaded" | "error">(
    src ? "loading" : "idle",
  );

  // Reset status setiap kali src berubah
  React.useEffect(() => {
    setImgStatus(src ? "loading" : "idle");
  }, [src]);

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  if (isLoading) {
    return (
      <Avatar className={className}>
        <AvatarFallback className={cn("animate-pulse bg-gray-200", fallbackClassName)} />
      </Avatar>
    );
  }

  return (
    <Avatar className={className}>
      {/* Image — selalu di-render jika src ada, tapi disembunyikan saat error */}
      {src && imgStatus !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onLoad={() => setImgStatus("loaded")}
          onError={() => setImgStatus("error")}
          className={cn(
            "rounded-full aspect-square size-full object-cover",
            // Sembunyikan saat masih loading agar fallback tidak sempat muncul
            imgStatus === "loading" ? "invisible absolute" : "",
          )}
        />
      )}

      {/* Skeleton saat image sedang di-fetch */}
      {src && imgStatus === "loading" && (
        <AvatarFallback className={cn("animate-pulse bg-gray-200", fallbackClassName)} />
      )}

      {/* Fallback initial — hanya muncul jika src null atau image error */}
      {(!src || imgStatus === "error") && (
        <AvatarFallback className={fallbackClassName}>{initials}</AvatarFallback>
      )}
    </Avatar>
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  UserAvatar,
};
