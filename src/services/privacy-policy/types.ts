// ─── Privacy Policy ────────────────────────────────────────────────────────

export type PrivacyPolicyData = {
  id: string;
  judul: string;
  slug: string;
  konten: string; // HTML string
};

export type GetPrivacyPolicyResponse = {
  success: boolean;
  message: string;
  data: PrivacyPolicyData;
};
