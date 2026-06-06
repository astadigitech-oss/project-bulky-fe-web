import Image from "next/image";
import { Button } from "@ui/button";
import { Link } from "@i18n/navigation";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Mail,
  MapPin,
  Package,
  Truck,
  Warehouse,
} from "lucide-react";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { ProfileSidebarClient } from "./profile-sidebar-client";

const tabValues = ["payments", "orders", "group-buy", "edit"] as const;

type ProfileTab = (typeof tabValues)[number];

export type OrderStatus = "Dikemas" | "Selesai";

export const orders = [
  {
    id: "22312938123",
    name: "Palet Sepatu Olahraga",
    price: "Rp. 5.000.000",
    originalPrice: "Rp. 6.500.000",
    status: "Dikemas" as OrderStatus,
  },
  {
    id: "22312938124",
    name: "Palet Sepatu Olahraga 2",
    price: "Rp. 5.950.000",
    originalPrice: "Rp. 7.500.000",
    status: "Selesai" as OrderStatus,
  },
];

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
    { href: "/profile/edit", label: t("tabs.edit"), value: "edit" },
  ] as const;

  return (
    <main className="bg-[#f0f0f0] px-6 py-6 lg:px-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 lg:flex-row">
        <aside className="relative overflow-hidden rounded-lg bg-[#ffcf02] p-7 text-center lg:w-72 lg:shrink-0">
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

        <section className="min-h-[640px] flex-1 overflow-hidden rounded-lg bg-white shadow-sm lg:h-[calc(100vh-9rem)]">
          <div className="h-full overflow-y-auto p-6">
            <nav className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {tabs.map((tab) => (
                <Link
                  key={tab.value}
                  href={tab.href}
                  className={cn(
                    "flex h-9 items-center justify-center whitespace-nowrap rounded-lg text-base font-normal text-black transition-colors",
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
          </div>
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

export async function OrderCard({ order }: { order: (typeof orders)[number] }) {
  const t = await getTranslations("ProfilePages.orders.card");
  const isDone = order.status === "Selesai";

  return (
    <article className="border-b border-[#d9d9d9] py-4 last:border-b-0">
      <div className="grid gap-6 md:grid-cols-[minmax(360px,1fr)_150px_170px] md:items-start">
        <div className="flex gap-3">
          <div className="flex size-30 shrink-0 items-center justify-center rounded-[20px] border border-[#727272cc] bg-[#efefef]">
            <Package className="size-16 text-[#727272]" strokeWidth={1.4} />
          </div>
          <div>
            <h3 className="mb-2 text-sm text-black">{order.name}</h3>
            <p className="mb-1 text-xl font-bold text-[#ff9900]">
              {order.price}
            </p>
            <p className="mb-7 text-[11px] text-[#727272] line-through">
              {order.originalPrice}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-[#01798a]">
              <Warehouse className="size-4" /> {t("palletType")}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-7 text-sm md:items-center">
          <p className="whitespace-nowrap text-black">{t("deliveryStatus")}</p>
          <p className="whitespace-nowrap font-bold text-[#01798a]">
            {isDone ? t("statusDone") : t("statusPacking")}
          </p>
        </div>

        {isDone ? (
          <button
            type="button"
            className="flex h-11 items-center justify-center rounded bg-[#ffcf02] px-8 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300] hover:text-black"
          >
            {t("viewHistory")}
          </button>
        ) : (
          <Link
            href="/profile/orders/lacak"
            className="flex h-11 items-center justify-center rounded bg-[#ffcf02] px-8 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#f0c300] hover:text-black"
          >
            {t("trackOrder")}
          </Link>
        )}
      </div>
    </article>
  );
}


export async function TrackingContent() {
  const t = await getTranslations("ProfilePages.tracking");

  const steps = [
    { title: t("steps.ordered"), time: "15 Oktober 2025\n12:00 wib", active: true, icon: Package },
    { title: t("steps.packed"), time: "15 Oktober 2025\n15:00 wib", active: true, icon: Warehouse },
    { title: t("steps.shipped"), time: "-", active: false, icon: Truck },
    { title: t("steps.done"), time: "-", active: false, icon: CheckCircle2 },
  ];

  return (
    <div>
      <Button
        nativeButton={false}
        variant="ghost"
        render={<Link href="/profile/orders" />}
        className="mb-4 h-8 px-0 text-sm text-[#727272] hover:bg-transparent"
      >
        {t("back")}
      </Button>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-t border-[#d9d9d9] pt-6">
        <div className="flex gap-5">
          <h1 className="text-base text-black">{t("title")}</h1>
          <p className="text-sm text-[#01798a]">Palet Sepatu Olahraga</p>
        </div>
        <p className="text-sm text-[#727272]">Order ID. 22312938123</p>
      </div>

      <div className="mb-10 grid gap-6 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative text-center">
              {index < steps.length - 1 ? (
                <div
                  className={cn(
                    "absolute left-1/2 top-14 hidden h-1 w-full md:block",
                    steps[index + 1].active ? "bg-[#ffcf02]" : "bg-[#727272cc]",
                  )}
                />
              ) : null}
              <div className="relative z-10 mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-white text-[#01798a]">
                <Icon className="size-9" strokeWidth={1.5} />
              </div>
              <div
                className={cn(
                  "relative z-10 mx-auto mb-2 size-4 rounded-full border-2 border-white",
                  step.active ? "bg-[#ffcf02]" : "bg-[#727272cc]",
                )}
              />
              <p className="text-base text-black">{step.title}</p>
              <p className="whitespace-pre-line text-[13px] text-black">{step.time}</p>
            </div>
          );
        })}
      </div>

      <section className="border-t border-[#d9d9d9] pt-5">
        <h2 className="mb-3 text-base text-black">{t("notes")}</h2>
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm text-black">
              <MapPin className="size-4" /> {t("shippingAddress")}
            </h3>
            <p className="text-sm text-black">
              Andi Santoso — Jl. Melati No. 45, RT 05/RW 02, Kel. Cempaka Putih,
              Jakarta Pusat, DKI Jakarta 10310
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-base text-black">{t("status")}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-[90px_1fr] gap-4 text-xs text-[#01798a]">
                <p>15 Okt 2025<br />15:00 wib</p>
                <p>Paket sedang dikemas di Gudang Warehouse Depok</p>
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-4 text-xs text-[#9db2ce]">
                <p>15 Okt 2025<br />12:00 wib</p>
                <p>Pesanan dibuat</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export { Mail };
