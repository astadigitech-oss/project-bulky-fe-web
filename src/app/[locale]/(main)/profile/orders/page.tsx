import { getTranslations } from "next-intl/server";
import { OrderCard, ProfileShell, orders } from "../_components/profile-shell";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePages.orders");
  return { title: t("pageTitle") };
}

export default async function StatusPesananPage() {
  const t = await getTranslations("ProfilePages.orders");

  const statuses = [
    { label: t("filters.all"), width: "w-[132px]" },
    { label: t("filters.waitingConfirmation"), width: "w-[184px]" },
    { label: t("filters.inProcess"), width: "w-[132px]" },
    { label: t("filters.arrived"), width: "w-[156px]" },
    { label: t("filters.cancelled"), width: "w-[150px]" },
  ];

  return (
    <ProfileShell activeTab="orders">
      <div className="mb-12 flex flex-col gap-4 xl:flex-row xl:items-center">
        <p className="shrink-0 text-base text-[#727272]">{t("statusLabel")}</p>
        <div className="flex flex-1 flex-wrap gap-4">
          {statuses.map((status, index) => (
            <button
              key={status.label}
              className={`${status.width} shrink-0 whitespace-nowrap rounded border px-4 py-3.5 text-center text-sm transition-colors ${
                index === 0
                  ? "border-[#ff9900] text-[#1d1d1d] hover:bg-[#fff8df]"
                  : "border-[#727272] text-[#727272] hover:border-[#ffcf02] hover:bg-[#fff8df] hover:text-[#1d1d1d]"
              }`}
              type="button"
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </ProfileShell>
  );
}
