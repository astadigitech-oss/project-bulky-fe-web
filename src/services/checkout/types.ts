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
};

export type PlaceOrderData = {
  pesanan_id: string;
  kode: string;
  total: number;
  expired_at: string;
  payment_url: string;
};

export type PlaceOrderResponse = BaseAuthResponse<PlaceOrderData>;

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
