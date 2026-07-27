import type { BaseAuthResponse } from "@/services/auth/types";

// ─── Shipping Cost ──────────────────────────────────────────────────────────

type ShippingOption = {
  tersedia: boolean;
  biaya_pengiriman: number;
  biaya_pengiriman_formatted: string;
  lead_time: number;
};

export type ShippingPickup = ShippingOption;

export type ShippingDeliveree = ShippingOption & {
  vehicle_type_id: string;
};

export type ShippingForwarderAsuransi = {
  persentase: number;
  premi: number;
  premi_formatted: string;
  tersedia: boolean;
};

export type ShippingForwarder = ShippingOption & {
  transport_type: string;
  load_type: string;
  asuransi: ShippingForwarderAsuransi;
};

export type ShippingCostData = {
  PICKUP: ShippingPickup;
  DELIVEREE: ShippingDeliveree;
  FORWARDER: ShippingForwarder;
};

export type CheckShippingCostBody = {
  alamat_buyer_id: string;
  slug?: string;
};

export type CheckShippingCostResponse = BaseAuthResponse<ShippingCostData>;

// ─── Checkout Item ─────────────────────────────────────────────────────────────

export type CheckoutItem = {
  produk_id: string;
  nama: string;
  gambar_url: string;
  harga: number;
  harga_formatted: string;
  is_active: boolean;
  is_sold: boolean;
};

// ─── Checkout Address ──────────────────────────────────────────────────────────

export type CheckoutAddress = {
  id: string;
  label: string;
  nama_penerima: string;
  telepon_penerima: string;
  alamat_lengkap: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  has_koordinat: boolean;
};

// ─── Checkout Data ─────────────────────────────────────────────────────────────

export type CheckoutData = {
  items: CheckoutItem[];
  total_item: number;
  biaya_produk: number;
  biaya_produk_formatted: string;
  ppn_persentase: number;
  biaya_ppn: number;
  biaya_ppn_formatted: string;
  alamat_default: CheckoutAddress | null;
};

// ─── Voucher ───────────────────────────────────────────────────────────────────

export type VoucherData = {
  kupon_id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  jenis_diskon: "persentase" | "jumlah_tetap";
  nilai_diskon: number;
  nilai_potongan: number;
};

export type ApplyVoucherBody = {
  kode: string;
};

export type ApplyVoucherResponse = BaseAuthResponse<VoucherData>;

// ─── Responses ─────────────────────────────────────────────────────────────────

export type GetCheckoutResponse = BaseAuthResponse<CheckoutData>;

export type PaymentType = "single_payment" | "split_payment";

// POST /place-order — place the order
export type PlaceOrderBody = {
  delivery_type: "PICKUP" | "DELIVEREE" | "FORWARDER";
  alamat_buyer_id?: string;
  biaya_pengiriman: number;
  with_insurance?: boolean;
  insurance_premi?: number;
  metode_pembayaran_id?: string;
  metode_pembayaran_kode?: string;
  catatan?: string;
  kupon_kode?: string;
  success_return_url?: string;
  slug?: string;
  disclaimer_id: string;
  disclaimer_agreed: boolean;
  payment_type: PaymentType;
  /** Required when payment_type is "split_payment" — buyer_id of invited friends, at least 1. */
  friend_ids?: string[];
};

export type PlaceOrderData = {
  pesanan_id: string;
  kode: string;
  total: number;
  expired_at: string;
  // Empty for split_payment orders — each participant pays their own portion
  // via the split-payment endpoints below.
  payment_url: string | null;
  participants_count: number;
};

export type PlaceOrderResponse = BaseAuthResponse<PlaceOrderData>;

// ─── Split Payment (Patungan) ──────────────────────────────────────────────────

export type SplitPaymentFriend = {
  buyer_id: string;
  nama: string;
  telepon: string;
  foto_url: string | null;
};

// GET /checkout/friends/search?phone=... — search for a friend to invite
export type SearchFriendResponse = {
  success: boolean;
  message: string;
  data: SplitPaymentFriend[];
};

// PATCH /pesanan/:kode/split-payment/amount — set my contribution amount
export type SetSplitPaymentAmountBody = {
  amount: number;
};

export type SetSplitPaymentAmountData = {
  remaining_after: number;
  total: number;
};

export type SetSplitPaymentAmountResponse = {
  success: boolean;
  message: string;
  data: SetSplitPaymentAmountData;
};

// POST /pesanan/:kode/split-payment/pay — create invoice for my portion
export type CreateSplitPaymentBody = {
  metode_pembayaran_id: string;
  metode_pembayaran_kode: string;
  success_return_url: string;
};

export type CreateSplitPaymentData = {
  payment_url: string;
  expired_at: string;
};

export type CreateSplitPaymentResponse = {
  success: boolean;
  message: string;
  data: CreateSplitPaymentData;
};

// ─── Payment Methods ──────────────────────────────────────────────────────────

export type PaymentChannel = {
  id: string;
  nama: string;
  kode: string;
  logo_value: string;
  urutan: number;
  is_active: boolean;
};

export type PaymentGroup = {
  nama: string;
  urutan: number;
  metode: PaymentChannel[];
};

export type GetPaymentMethodsResponse = BaseAuthResponse<PaymentGroup[]>;

// ─── Pickup Info ───────────────────────────────────────────────────────────────

export type PickupScheduleDay = {
  hari: number | string; // 0 = Sunday, 6 = Saturday
  jam_buka: string | null;
  jam_tutup: string | null;
  is_buka: boolean;
};

export type PickupInfoData = {
  id: string;
  nama: string;
  alamat: string;
  telepon: string;
  jadwal: PickupScheduleDay[];
};

export type GetPickupInfoResponse = BaseAuthResponse<PickupInfoData>;

// ─── Disclaimer ───────────────────────────────────────────────────────────────

export type DisclaimerData = {
  id: string;
  judul: string;
  konten: string; // HTML string
};

export type GetDisclaimerResponse = BaseAuthResponse<DisclaimerData>;
