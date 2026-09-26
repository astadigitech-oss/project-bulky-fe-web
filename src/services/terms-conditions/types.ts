// ─── Terms & Conditions ────────────────────────────────────────────────────

export type TermsConditionsData = {
  id: string;
  judul: string;
  slug: string;
  konten: string; // HTML string
  terms_version: string;
};

export type GetTermsConditionsResponse = {
  success: boolean;
  message: string;
  data: TermsConditionsData;
};
