// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PROCESSING"
  | "READY"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID";
export type DeliveryType = "PICKUP" | "DELIVEREE" | "FORWARDER";

export type Order = {
  id: string;
  kode: string;
  nama_produk: string;
  gambar_url: string | null;
  harga_setelah_diskon_formatted: string | null;
  harga_sebelum_diskon_formatted: string | null;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_type: DeliveryType;
  delivery_status_label: string;
  tracking_url: string | null;
  payment_url: string | null;
};

export type OrderMeta = {
  halaman: number;
  per_halaman: number;
  total_data: number;
  total_halaman: number;
};

export type GetOrdersParams = {
  locale?: string;
  payment_status?: PaymentStatus;
  order_status?: OrderStatus;
  halaman?: number;
  per_halaman?: number;
};

export type GetOrdersResponse = {
  success: boolean;
  message: string;
  data: Order[];
  meta: OrderMeta;
};

// ─── Order Detail ─────────────────────────────────────────────────────────────

export type OrderStepperStep = {
  done: boolean;
  timestamp: string | null;
  timestamp_label: string | null;
};

export type OrderStepper = {
  done: OrderStepperStep;
  ordered: OrderStepperStep;
  packed: OrderStepperStep;
  shipped: OrderStepperStep;
};

export type OrderStatusHistoryItem = {
  timestamp: string;
  timestamp_label: string;
  label: string;
};

export type OrderDetailProduk = {
  id: string;
  nama: string;
  gambar_url: string | null;
  harga_sebelum_diskon: number;
  harga_sebelum_diskon_formatted: string;
  subtotal: number;
  subtotal_formatted: string;
};

export type OrderDetailBiaya = {
  biaya_produk: number;
  biaya_produk_formatted: string;
  biaya_pengiriman: number;
  biaya_pengiriman_formatted: string;
  biaya_ppn: number;
  biaya_ppn_formatted: string;
  biaya_lainnya: number;
  biaya_lainnya_formatted: string;
  total: number;
  total_formatted: string;
};

export type OrderDetail = {
  id: string;
  kode: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_type: DeliveryType;
  produk: OrderDetailProduk;
  biaya: OrderDetailBiaya;
  alamat_pengiriman: {
    nama_penerima: string;
    telepon_penerima: string;
    alamat_lengkap: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    kode_pos: string;
  } | null;
  catatan: string | null;
  stepper: OrderStepper;
  status_history: OrderStatusHistoryItem[];
  payment_url: string | null;
  tracking_url: string | null;
  expired_at: string | null;
  created_at: string;
};

export type GetOrderDetailResponse = {
  success: boolean;
  message: string;
  data: OrderDetail;
};

// ─── Pickup Info ──────────────────────────────────────────────────────────────

export type PickupScheduleDay = {
  hari: number | string;
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

export type GetPickupInfoResponse = {
  success: boolean;
  message: string;
  data: PickupInfoData;
};
