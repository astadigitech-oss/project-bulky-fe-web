import { ProfileShell } from "../_components/profile-shell";
import { EditProfileClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profil",
};

export default function EditProfilPage() {
  return (
    <ProfileShell activeTab="edit">
      <EditProfileClient />
    </ProfileShell>
  );
}
