// ─── Payment Information ────────────────────────────────────────────────────

export type PaymentInformationData = {
  id: string;
  judul: string;
  slug: string;
  konten: string; // HTML string
};

export type GetPaymentInformationResponse = {
  success: boolean;
  message: string;
  data: PaymentInformationData;
};
