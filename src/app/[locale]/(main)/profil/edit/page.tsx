import { EditProfileContent, ProfileShell } from "../_components/profile-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profil",
};

export default function EditProfilPage() {
  return (
    <ProfileShell activeTab="edit">
      <EditProfileContent />
    </ProfileShell>
  );
}
