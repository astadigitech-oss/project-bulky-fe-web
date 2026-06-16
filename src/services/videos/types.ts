// ─── Shared ────────────────────────────────────────────────────────────────────

export type VideoKategori = {
  nama: string;
  slug: string;
};

// ─── Video List ────────────────────────────────────────────────────────────────

export type VideoListItem = {
  id: string;
  judul: string;
  slug: string;
  deskripsi: string;
  thumbnail_url: string;
  durasi_detik: number;
  view_count: number;
  kategori: VideoKategori;
  published_at: string;
};

export type VideoListMeta = {
  halaman: number;
  per_halaman: number;
  total_data: number;
  total_halaman: number;
};

export type GetVideoListResponse = {
  data: VideoListItem[];
  meta: VideoListMeta;
  success: boolean;
};

// ─── Video Detail ──────────────────────────────────────────────────────────────

export type VideoRelatedItem = {
  id: string;
  judul: string;
  slug: string;
  thumbnail_url: string;
  durasi_detik: number;
  view_count: number;
  kategori: VideoKategori;
  published_at: string;
};

export type VideoDetail = VideoListItem & {
  video_url: string;
  video_lainnya: VideoRelatedItem[];
};

export type GetVideoDetailResponse = {
  data: VideoDetail;
  success: boolean;
};

// ─── Kategori Video ────────────────────────────────────────────────────────────

export type GetKategoriVideoResponse = {
  data: VideoKategori[];
  success: boolean;
};
