import { EmptyState, ProfileShell } from "../_components/profile-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembayaran Patungan",
};

export default function PembayaranPatunganPage() {
  return (
    <ProfileShell activeTab="patungan">
      <p className="text-base text-[#727272]">Patungan</p>
      <EmptyState
        icon="split"
        title="Tidak ada pembayaran patungan"
        actionLabel="Buat Pembayaran Patungan"
      />
    </ProfileShell>
  );
}
