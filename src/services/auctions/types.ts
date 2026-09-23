export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginationMeta = {
  first_page: number;
  last_page: number;
  current_page: number;
  total_items: number;
  per_page: number;
};

export type AuctionCard = {
  id: string;
  code: string;
  slug: string;
  name: string;
  thumbnail_url: string | null;
  status: "OPEN";
  currency: "IDR";
  grand_total: string;
  min_bid_percent: number;
  min_bid_amount: string;
  total_quantity: number;
};

export type AuctionListResponse = ApiEnvelope<AuctionCard[]> & {
  meta: PaginationMeta;
};

export type AuctionBanner = {
  banner_url: string;
  nama: string;
  kategori: string[];
};

export type AuctionTaxonomy = {
  id: string;
  name: string;
  slug: string;
};

export type AuctionDetail = AuctionCard & {
  description: string | null;
  images: string[];
  items: Array<{
    name: string;
    quantity: number;
    unit_price: string;
    subtotal: string;
  }>;
  origin: { type: "SUPPLIER" | "BULKY_WAREHOUSE"; label: string; city: string | null };
  opened_at: string | null;
  discrepancy_percentage: number;
  dimensions: { panjang_cm: number; lebar_cm: number; tinggi_cm: number };
  berat_kg: number;
  volume_m3: number;
  pdf: { url: string; name: string } | null;
  category: AuctionTaxonomy;
  product_condition: AuctionTaxonomy;
  package_condition: AuctionTaxonomy;
  source: AuctionTaxonomy;
};

export type AuctionDetailResponse = ApiEnvelope<AuctionDetail>;

export type ShippingEstimate = {
  shipping_quote_id: string;
  provider: "forwarder" | "deliveree";
  service: string;
  sla_days: string;
  label: string;
  amount: string;
  currency: "IDR";
  is_estimate: true;
};

export type ShippingEstimatesResponse = ApiEnvelope<ShippingEstimate[]>;

export type OwnBid = {
  id: string;
  thumbnail_url: string | null;
  batch_name: string;
  status: "PENDING" | "WON" | "LOST";
  bid: { input_mode: "AMOUNT" | "PERCENT"; amount: string; input_percent: string };
  shipping_estimate: {
    provider: string;
    service: string;
    amount: string;
    currency: "IDR";
    is_estimate: boolean;
  };
  ppn_estimate: { rate: string; amount: string; currency: "IDR"; is_estimate: boolean };
  estimated_total: string;
  currency: "IDR";
  note: string;
  created_at: string;
};

export type OwnBidResponse = ApiEnvelope<OwnBid>;
export type MyBidsResponse = ApiEnvelope<OwnBid[]> & { meta: PaginationMeta };

export type ShippingDestination = {
  address: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  latitude?: number;
  longitude?: number;
};
