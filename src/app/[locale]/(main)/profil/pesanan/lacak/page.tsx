import { ProfileShell, TrackingContent } from "../../_components/profile-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lacak Pesanan",
};

export default function LacakPesananPage() {
  return (
    <ProfileShell activeTab="pesanan">
      <TrackingContent />
    </ProfileShell>
  );
}
