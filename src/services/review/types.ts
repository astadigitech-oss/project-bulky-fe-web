// ─── Pending Review ───────────────────────────────────────────────────────────

export type PendingReviewItem = {
  order_id: string;
  pesanan_item_id: string;
  produk_id: string;
  nama_produk: string;
  gambar_produk: string;
  harga_satuan: number;
  harga_satuan_formatted: string;
  qty: number;
};

export type GetPendingReviewResponse = {
  success: boolean;
  message: string;
  data: PendingReviewItem[];
};

// ─── Add Review ───────────────────────────────────────────────────────────────

export type AddReviewData = {
  id: string;
  created_at: string;
  rating: number;
  komentar: string;
  is_approved: boolean;
};

export type AddReviewResponse = {
  success: boolean;
  message: string;
  data: AddReviewData;
};

// ─── Reviewed List ────────────────────────────────────────────────────────────

export type ReviewedItem = {
  id: string;
  produk_id: string;
  nama_produk: string;
  gambar_produk: string;
  rating: number;
  komentar: string;
  media: string[];
  is_approved: boolean;
  created_at: string;
};

export type ReviewedMeta = {
  first_page: number;
  last_page: number;
  current_page: number;
  from: number;
  last: number;
  total: number;
  total_items: number;
  per_page: number;
};

export type GetReviewedListResponse = {
  success: boolean;
  message: string;
  data: ReviewedItem[];
  meta: ReviewedMeta;
};
