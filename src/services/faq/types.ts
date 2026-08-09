// ─── FAQ ────────────────────────────────────────────────────────────────────

export type FaqItem = {
  id: string;
  pertanyaan: string;
  jawaban: string;
};

export type GetFaqResponse = {
  success: boolean;
  message: string;
  data: FaqItem[];
};
