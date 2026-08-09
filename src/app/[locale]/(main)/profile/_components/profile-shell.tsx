import Image from "next/image";
import { Button } from "@ui/button";
import { Link } from "@i18n/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { ProfileSidebarClient } from "./profile-sidebar-client";

const tabValues = ["payments", "orders", "group-buy", "review", "edit"] as const;

type ProfileTab = (typeof tabValues)[number];


export async function ProfileShell({
  activeTab,
  children,
}: {
  activeTab: ProfileTab;
  children: ReactNode;
}) {
  const t = await getTranslations("Profile");

  const tabs = [
    { href: "/profile/payments", label: t("tabs.payment"), value: "payments" },
    { href: "/profile/orders", label: t("tabs.orders"), value: "orders" },
    { href: "/profile/group-buy", label: t("tabs.patungan"), value: "group-buy" },
    { href: "/profile/review", label: t("tabs.review"), value: "review" },
    { href: "/profile/edit", label: t("tabs.edit"), value: "edit" },
  ] as const;

  return (
    <main className="bg-[#f0f0f0] px-6 py-6 lg:px-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 lg:flex-row lg:items-start">
        <aside className="relative overflow-hidden rounded-lg bg-[#ffcf02] p-7 text-center lg:sticky lg:top-24 lg:h-[calc(100vh-9rem)] lg:w-72 lg:shrink-0">
          {/* Looper decorations */}
          <Image
            src="/assets/images/Looper-kiri.svg"
            alt=""
            width={260}
            height={220}
            aria-hidden
            className="pointer-events-none absolute -bottom-8 left-0 w-full rotate-[-10deg] select-none opacity-80"
          />
          <Image
            src="/assets/images/Looper-kiri.svg"
            alt=""
            width={260}
            height={220}
            aria-hidden
            className="pointer-events-none absolute -right-0 -top-8 w-full rotate-160 select-none opacity-80"
          />
          <div className="relative z-10">
            <h2 className="mb-7 text-2xl font-bold text-black">{t("bioData")}</h2>
            <ProfileSidebarClient />
          </div>
        </aside>

        <section className="min-h-[640px] flex-1 rounded-lg bg-white p-6 shadow-sm">
          <nav className="mb-8 flex gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.value}
                href={tab.href}
                className={cn(
                  "flex h-9 flex-1 items-center justify-center whitespace-nowrap rounded-lg text-base font-normal text-black transition-colors",
                  activeTab === tab.value
                    ? "bg-[#ffcf02] font-bold hover:bg-[#ffcf02]"
                    : "bg-[#efefef] hover:bg-[#e5e5e5]",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          {children}
        </section>
      </div>
    </main>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  icon,
}: {
  title: string;
  description?: string;
  actionLabel: string;
  icon: "payment" | "split";
}) {
  const illustration =
    icon === "payment"
      ? {
          src: "/assets/images/profile/empty-illustration.svg",
          alt: "Ilustrasi tidak ada produk yang belum dibayar",
          width: 209,
          height: 209,
        }
      : {
          src: "/assets/images/profile/patungan-illustration.svg",
          alt: "Ilustrasi tidak ada pembayaran patungan",
          width: 250,
          height: 166,
        };

  return (
    <div className="flex min-h-[470px] flex-col items-center justify-center text-center">
      <div className="mb-9 flex h-[209px] w-[250px] items-center justify-center">
        <Image
          src={illustration.src}
          alt={illustration.alt}
          width={illustration.width}
          height={illustration.height}
          className="h-auto w-auto"
          priority
        />
      </div>
      <p className="text-base text-black">{title}</p>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-[#727272]">{description}</p>
      ) : null}
      <Button className="mt-4 h-11 rounded bg-[#ffcf02] px-12 text-sm font-bold text-black shadow-none transition-colors hover:bg-[#f0c300] hover:text-black">
        {actionLabel}
      </Button>
    </div>
  );
}
