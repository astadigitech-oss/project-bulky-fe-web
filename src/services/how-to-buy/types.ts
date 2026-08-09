// ─── How To Buy ─────────────────────────────────────────────────────────────

export type HowToBuyData = {
  id: string;
  judul: string;
  slug: string;
  konten: string; // HTML string
};

export type GetHowToBuyResponse = {
  success: boolean;
  message: string;
  data: HowToBuyData;
};
