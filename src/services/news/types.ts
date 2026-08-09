// ─── News (Article) ───────────────────────────────────────────────────────────

export type NewsListItem = {
  id: string;
  title: string;
  slug: string;
  image: string;
  highlight: string;
  date: string;
};

export type GetNewsListResponse = {
  success: boolean;
  message: string;
  data: NewsListItem[];
};

export type PaginationMeta = {
  first_page: number;
  last_page: number;
  current_page: number;
  from: number;
  last: number;
  total: number;
  total_items: number;
  per_page: number;
};

export type GetNewsListPaginatedResponse = {
  success: boolean;
  message: string;
  data: NewsListItem[];
  meta: PaginationMeta;
};

export type GetNewsCategoriesResponse = {
  success: boolean;
  message: string;
  data: NewsCategory[];
};

// ─── News Detail ──────────────────────────────────────────────────────────────

export type NewsCategory = {
  name: string;
  slug: string;
};

export type NewsLabel = {
  name: string;
  slug: string;
};

export type NewsDetailItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  content: string;
  category: NewsCategory;
  label: NewsLabel[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
};

export type GetNewsDetailResponse = {
  success: boolean;
  message: string;
  data: {
    data: NewsDetailItem;
    recomendation: NewsListItem[];
  };
};
