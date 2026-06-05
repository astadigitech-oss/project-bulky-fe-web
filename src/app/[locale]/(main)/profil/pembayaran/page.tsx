import { EmptyState, ProfileShell } from "../_components/profile-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menunggu Pembayaran",
};

export default function MenungguPembayaranPage() {
  return (
    <ProfileShell activeTab="pembayaran">
      <p className="text-base text-[#727272]">Menunggu Pembayaran</p>
      <EmptyState
        icon="payment"
        title="Tidak ada produk yang belum dibayar"
        actionLabel="Mulai Belanja"
      />
    </ProfileShell>
  );
}
