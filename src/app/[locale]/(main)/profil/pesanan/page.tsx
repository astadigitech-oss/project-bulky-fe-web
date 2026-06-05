import { OrderCard, ProfileShell, orders } from "../_components/profile-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status Pesanan",
};

const statuses = [
  { label: "Semua", width: "w-[132px]" },
  { label: "Menunggu Konfirmasi", width: "w-[184px]" },
  { label: "Proses", width: "w-[132px]" },
  { label: "Tiba Ditujuan", width: "w-[156px]" },
  { label: "Dibatalkan", width: "w-[150px]" },
];

export default function StatusPesananPage() {
  return (
    <ProfileShell activeTab="pesanan">
      <div className="mb-12 flex flex-col gap-4 xl:flex-row xl:items-center">
        <p className="shrink-0 text-base text-[#727272]">Status</p>
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
